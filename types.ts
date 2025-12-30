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
  morningSnack: string; // 08:45
  mainMeal: string;     // 10:20
  afternoonSnack1: string; // 13:30
  afternoonSnack2: string; // 15:05
  month?: number;
  year?: number;
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

export interface GeneralSettings {
  pageTitle: string;
  schoolName: string;
  hotline: string;
  email: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
}