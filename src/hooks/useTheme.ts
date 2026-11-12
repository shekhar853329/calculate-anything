import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = stored ?? preferred;
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };
  return { theme, toggle };
}
