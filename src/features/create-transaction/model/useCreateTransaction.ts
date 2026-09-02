import { useState } from 'react';
import { CreateTransactionInput, CreateTransactionSchema, transactionApi } from '@/entities/transaction';

export function useCreateTransaction(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const submit = async (input: CreateTransactionInput) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    const validation = CreateTransactionSchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      setValidationErrors(fieldErrors);
      setIsLoading(false);
      return false;
    }

    try {
      await transactionApi.createTransaction(validation.data);
      setIsLoading(false);
      onSuccess?.();
      return true;
    } catch (err: any) {
      const message = err?.message || 'Erro ao criar transação. Verifique os dados.';
      setError(message);
      setIsLoading(false);
      return false;
    }
  };

  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  return {
    submit,
    isLoading,
    error,
    validationErrors,
    clearErrors,
  };
}
