export type ThemeMode = 'light' | 'dark';

export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  title: string;
  avatar: string;
  isGuest: boolean;
  theme: ThemeMode;
  colorMode: ColorMode;
  createdAt?: string;
}
