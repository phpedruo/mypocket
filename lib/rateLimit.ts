import { NextResponse } from 'next/server';

// Armazena tentativas por IP
const attempts = new Map<string, { count: number; resetAt: number }>();

// Configurações
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos de bloqueio

/**
 * Rate limiter simples por IP
 */
export function rateLimit(ip: string): { allowed: boolean; response?: NextResponse } {
  const now = Date.now();
  const record = attempts.get(ip);

  // Se não existe registro ou passou o tempo de reset
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  // Se já atingiu o limite
  if (record.count >= MAX_ATTEMPTS) {
    const timeLeft = Math.ceil((record.resetAt - now) / 1000 / 60);
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: `Muitas tentativas. Tente novamente em ${timeLeft} minutos.`,
        },
        { status: 429 }
      ),
    };
  }

  // Incrementa tentativas
  record.count++;
  attempts.set(ip, record);

  return { allowed: true };
}

/**
 * Obtém IP do cliente
 */
export function getClientIp(request: Request): string {
  // Tenta headers de proxy primeiro
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback para localhost em desenvolvimento
  return 'unknown';
}

// Limpa registros antigos a cada 1 hora
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attempts.entries()) {
    if (now > record.resetAt) {
      attempts.delete(ip);
    }
  }
}, 60 * 60 * 1000);
