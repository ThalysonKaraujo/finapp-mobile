import { describe, expect, it } from 'vitest';
import { CategorySchema, CreateCategorySchema } from './category.types';

describe('Category Schemas Validation', () => {
  it('should validate a complete category object', () => {
    const category = {
      id: 'cat-123',
      name: 'Alimentação',
      color: '#0066FF',
    };
    const result = CategorySchema.safeParse(category);
    expect(result.success).toBe(true);
  });

  it('should validate CreateCategorySchema with valid name and color', () => {
    const input = {
      name: 'Lazer',
      color: '#10B981',
    };
    const result = CreateCategorySchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject category name with less than 2 characters', () => {
    const input = {
      name: 'A',
      color: '#10B981',
    };
    const result = CreateCategorySchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
