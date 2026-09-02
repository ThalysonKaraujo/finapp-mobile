import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { formatDateShort } from '../../lib';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '../../theme';

export interface DatePickerInputProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label = 'Data',
  value,
  onChange,
  error,
  containerStyle,
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleOpenPicker = () => {
    setTempDate(value);
    setShowPicker(true);
  };

  const handleConfirmIOS = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancelIOS = () => {
    setShowPicker(false);
  };

  const formattedDisplay = formatDateShort(value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOpenPicker}
        style={[styles.inputContainer, Boolean(error) && styles.inputError]}
      >
        <View style={styles.leftIcon}>
          <Calendar size={20} color={colors.textSecondary} />
        </View>

        <Text style={styles.dateText}>{formattedDisplay}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Android Picker */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode='date'
          display='default'
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS Modal Picker */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType='fade'
          onRequestClose={handleCancelIOS}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancelIOS}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancelIOS}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Selecionar Data</Text>
                <TouchableOpacity onPress={handleConfirmIOS}>
                  <Text style={styles.modalConfirmText}>Concluir</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode='date'
                display='spinner'
                onChange={handleChange}
                textColor={colors.textPrimary}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                locale='pt-BR'
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    width: '100%',
  },
  label: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.expense,
  },
  dateText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.expense,
    marginTop: spacing.xs,
  },
  // iOS Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 47, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.xxl,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  modalCancelText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  modalConfirmText: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: '700',
  },
});
