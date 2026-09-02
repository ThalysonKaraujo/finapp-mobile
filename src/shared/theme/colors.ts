export const colors = {
  primary: '#0066FF',
  primaryDark: '#0047B3',
  primaryLight: '#3385FF',
  primaryMuted: '#E6F0FF',
  primarySubtle: '#F0F6FE',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceHover: '#E2E8F0',

  textPrimary: '#0A192F',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  border: '#E2E8F0',
  borderFocus: '#0066FF',
  divider: '#F1F5F9',

  income: '#10B981',
  incomeBackground: '#ECFDF5',
  incomeBorder: '#A7F3D0',

  expense: '#EF4444',
  expenseBackground: '#FEF2F2',
  expenseBorder: '#FECACA',

  transfer: '#6366F1',
  transferBackground: '#EEF2FF',
  transferBorder: '#C7D2FE',

  warning: '#F59E0B',
  warningBackground: '#FFFBEB',
  info: '#0284C7',
  infoBackground: '#F0F9FF',
} as const;

export type Colors = typeof colors;
