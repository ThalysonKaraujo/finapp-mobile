import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
  padding?: keyof typeof spacing;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  onPress,
  style,
  ...rest
}) => {
  const containerStyle = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    variant === 'elevated' && shadows.md,
    variant === 'default' && shadows.sm,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={containerStyle}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  default: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    borderWidth: 0,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  subtle: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 0,
  },
});
