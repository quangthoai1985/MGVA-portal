import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface DailyMenu {
  id?: string;  // Firestore document ID
  week: number;  // 1-4
  dayOfWeek: number;  // 2-7 (Monday-Saturday)
  day: string;  // "Thứ 2", "Thứ 3", etc.
  date: string;  // "DD/MM" format
  lunch: string;
  snack: string;
  isHoliday?: boolean;  // Mark as holiday
  holidayName?: string;  // Holiday name (e.g., "Quốc khánh 2/9")
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
}

export interface TabProps {
  label: string;
  value: string;
  content: ReactNode;
}