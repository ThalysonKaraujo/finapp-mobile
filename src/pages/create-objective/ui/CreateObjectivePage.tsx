import { Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { CreateObjectiveSchema, objectiveApi } from '@/entities/objective';
import { colors, spacing } from '@/shared/theme';
import {
  AmountInput,
  Button,
  Card,
  DatePickerInput,
  Header,
  Input,
  ScreenWrapper,
} from '@/shared/ui';

interface CreateObjectivePageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateObjectivePage: React.FC<CreateObjectivePageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [targetAmountCents, setTargetAmountCents] = useState(0);
  const [deadline, setDeadline] = useState<Date>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    const validation = CreateObjectiveSchema.safeParse({
      name: name.trim(),
      targetAmount: targetAmountCents,
      deadline: deadline.toISOString(),
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
      await objectiveApi.createObjective(validation.data);
      Alert.alert('Sucesso', 'Meta criada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao criar meta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header title='Nova Meta Financeira' onBack={onBack} />

      <Card variant='outlined' padding='lg' style={styles.card}>
        <AmountInput
          valueCents={targetAmountCents}
          onChangeCents={setTargetAmountCents}
          label='Valor Alvo'
          error={errors.targetAmount}
        />

        <Input
          label='Nome do Objetivo'
          placeholder='Ex: Reserva de Emergência, Viagem, Carro'
          value={name}
          onChangeText={setName}
          leftIcon={<Target size={20} color={colors.textSecondary} />}
          error={errors.name}
        />

        <DatePickerInput
          label='Data Limite / Prazo'
          value={deadline}
          onChange={setDeadline}
          error={errors.deadline}
        />

        <Button
          title='Salvar Meta'
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
