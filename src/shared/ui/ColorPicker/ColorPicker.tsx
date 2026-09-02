import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const PALETTE_COLORS = [
  '#0066FF', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#64748B', // Slate
];

export interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  label = 'Cor',
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.paletteGrid}>
        {PALETTE_COLORS.map((color) => {
          const isSelected =
            selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <TouchableOpacity
              key={color}
              activeOpacity={0.8}
              onPress={() => onSelectColor(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                isSelected && styles.colorCircleSelected,
              ]}
            >
              {isSelected && (
                <Check size={16} color='#FFFFFF' strokeWidth={3} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  label: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2.5,
    borderColor: colors.surface,
    transform: [{ scale: 1.15 }],
  },
});
