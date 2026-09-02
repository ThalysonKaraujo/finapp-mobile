import { Tag } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { CreateCategorySchema, categoryApi } from '@/entities/category';
import { colors, spacing } from '@/shared/theme';
import {
  Button,
  Card,
  ColorPicker,
  Header,
  Input,
  ScreenWrapper,
} from '@/shared/ui';

interface CreateCategoryPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateCategoryPage: React.FC<CreateCategoryPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0066FF');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    const validation = CreateCategorySchema.safeParse({
      name: name.trim(),
      color: selectedColor,
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
      await categoryApi.createCategory(validation.data);
      Alert.alert('Sucesso', 'Categoria criada com sucesso!', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.message || 'Falha ao criar categoria.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Header title='Nova Categoria' onBack={onBack} />

      <Card variant='outlined' padding='lg' style={styles.card}>
        <Input
          label='Nome da Categoria'
          placeholder='Ex: Alimentação, Lazer, Moradia'
          value={name}
          onChangeText={setName}
          leftIcon={<Tag size={20} color={colors.textSecondary} />}
          error={errors.name}
        />

        <ColorPicker
          label='Cor de Identificação'
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />

        <Button
          title='Salvar Categoria'
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
    marginTop: spacing.lg,
  },
});
