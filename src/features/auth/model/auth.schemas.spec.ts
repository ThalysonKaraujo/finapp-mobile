import { describe, expect, it } from 'vitest';
import { LoginSchema, RegisterSchema } from './auth.schemas';

describe('Auth Schemas Validation', () => {
  describe('LoginSchema', () => {
    it('should validate a correct email and password', () => {
      const result = LoginSchema.safeParse({
        email: 'usuario@exemplo.com',
        password: 'senha-segura-123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = LoginSchema.safeParse({
        email: 'email-invalido',
        password: 'senha-segura-123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Insira um e-mail válido');
      }
    });

    it('should reject password with less than 6 characters', () => {
      const result = LoginSchema.safeParse({
        email: 'usuario@exemplo.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'A senha deve ter pelo menos 6 caracteres',
        );
      }
    });
  });

  describe('RegisterSchema', () => {
    it('should validate matching password and confirmPassword', () => {
      const result = RegisterSchema.safeParse({
        name: 'Thalyson',
        email: 'thalyson@exemplo.com',
        password: 'senha-super-segura',
        confirmPassword: 'senha-super-segura',
      });
      expect(result.success).toBe(true);
    });

    it('should reject when confirmPassword does not match password', () => {
      const result = RegisterSchema.safeParse({
        name: 'Thalyson',
        email: 'thalyson@exemplo.com',
        password: 'senha-super-segura',
        confirmPassword: 'senha-diferente',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('As senhas não conferem');
      }
    });

    it('should reject name with less than 2 characters', () => {
      const result = RegisterSchema.safeParse({
        name: 'A',
        email: 'thalyson@exemplo.com',
        password: 'senha-super-segura',
        confirmPassword: 'senha-super-segura',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'O nome deve ter pelo menos 2 caracteres',
        );
      }
    });
  });
});
