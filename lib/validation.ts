import { z } from 'zod';
import validator from 'validator';

// Schema para signup
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .refine((email) => validator.isEmail(email), {
      message: 'Email inválido',
    }),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100, 'Senha muito longa')
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
      {
        message: 'Senha deve conter letra maiúscula, minúscula e número',
      }
    ),
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome muito longo')
    .trim(),
});

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .refine((email) => validator.isEmail(email), {
      message: 'Email inválido',
    }),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha muito longa'),
});

// Schema para transações
export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    message: 'Tipo deve ser income ou expense',
  }),
  amount: z
    .number()
    .positive('Valor deve ser positivo')
    .max(999999999, 'Valor muito alto')
    .or(
      z
        .string()
        .transform((val) => parseFloat(val))
        .pipe(z.number().positive().max(999999999))
    ),
  description: z
    .string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(200, 'Descrição muito longa')
    .trim(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inválida',
  }),
  recurring: z.boolean().optional(),
  frequency: z.enum(['monthly', 'yearly']).nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  incomeSourceId: z.string().uuid().nullable().optional(),
});

// Schema para categorias
export const categorySchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(2).max(100).trim(),
      type: z.string().min(2).max(50).trim(),
    })
  ).max(50, 'Máximo de 50 categorias por vez'),
});

// Schema para fontes de renda
export const incomeSourceSchema = z.object({
  incomeSources: z.array(
    z.object({
      name: z.string().min(2).max(100).trim(),
    })
  ).max(50, 'Máximo de 50 fontes de renda por vez'),
});
