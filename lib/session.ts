import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

// Validar ou gerar SESSION_SECRET
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    console.error('❌ SESSION_SECRET não definido no .env');
    console.log('💡 Gere um secret seguro com: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    throw new Error('SESSION_SECRET é obrigatório');
  }

  if (secret.length < 32) {
    console.error('❌ SESSION_SECRET muito curto (mínimo 32 caracteres)');
    console.log('💡 Secret atual tem apenas', secret.length, 'caracteres');
    throw new Error('SESSION_SECRET deve ter no mínimo 32 caracteres');
  }

  return secret;
}

const sessionOptions = {
  password: getSessionSecret(),
  cookieName: 'mypocket_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}
