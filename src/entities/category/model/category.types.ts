import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome da categoria é obrigatório'),
  color: z.string().min(1, 'A cor é obrigatória'),
  icon: z.string().nullable().optional(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  color: z.string().min(1, 'Selecione uma cor para a categoria'),
  icon: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
