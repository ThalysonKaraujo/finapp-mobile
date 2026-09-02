import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDateFriendly(dateInput: string | Date): string {
  try {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (Number.isNaN(date.getTime())) return '';

    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm')}`;
    }
    if (isYesterday(date)) {
      return `Ontem, ${format(date, 'HH:mm')}`;
    }
    return format(date, "d 'de' MMM, HH:mm", { locale: ptBR });
  } catch {
    return String(dateInput);
  }
}

export function formatDateShort(dateInput: string | Date): string {
  try {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (Number.isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy');
  } catch {
    return String(dateInput);
  }
}

export function formatDateFull(dateInput: string | Date): string {
  try {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (Number.isNaN(date.getTime())) return '';
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return String(dateInput);
  }
}
