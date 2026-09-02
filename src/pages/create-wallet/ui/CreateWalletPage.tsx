import { Wallet as WalletIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { CreateWalletSchema, walletApi } from '@/entities/wallet';
import { colors, spacing } from '@/shared/theme';
import {
  AmountInput,
  Button,
  Card,
  Header,
  Input,
  ScreenWrapper,
} from '@/shared/ui';

interface CreateWalletPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateWalletPage: React.FC<CreateWalletPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [initialBalanceCents, setInitialBalanceCents] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    const validation = CreateWalletSchema.safeParse({
      name: name.trim(),
      balance: initialBalanceCents,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await walletApi.createWallet(validation.data);
      Alert.alert('Sucesso', 'Carteira criada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao criar carteira.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header title='Nova Carteira' onBack={onBack} />

      <Card variant='outlined' padding='lg' style={styles.card}>
        <AmountInput
          valueCents={initialBalanceCents}
          onChangeCents={setInitialBalanceCents}
          label='Saldo Inicial (Opcional)'
        />

        <Input
          label='Nome da Carteira'
          placeholder='Ex: Nubank, Carteira Física, Inter'
          value={name}
          onChangeText={setName}
          leftIcon={<WalletIcon size={20} color={colors.textSecondary} />}
          error={errors.name}
        />

        <Button
          title='Criar Carteira'
          onPress={handleSubmit}
          loading={isLoading}
          size='lg'
          style={styles.submitBtn}
        />
      </Card>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
