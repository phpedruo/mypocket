import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza strings para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove tags HTML e scripts maliciosos
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Não permite nenhuma tag HTML
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Mantém o conteúdo, apenas remove tags
  }).trim();
}

/**
 * Sanitiza objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
