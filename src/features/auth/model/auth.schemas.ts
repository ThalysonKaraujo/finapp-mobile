import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Insira um e-mail válido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Insira um e-mail válido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
