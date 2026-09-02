import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().optional(),
  image: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export interface AuthSession {
  user: User;
  token?: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

export interface SignUpResponse {
  token?: string;
  user: User;
  message?: string;
}
