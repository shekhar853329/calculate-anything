import React from 'react';
import * as LucideIcons from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
  categorySlug?: string;
}

export function getCategoryTheme(categorySlug?: string) {
  switch (categorySlug) {
    case 'date-age':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/50',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-100 dark:border-rose-900/60',
        badgeBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
        gradient: 'from-rose-500/10 to-orange-500/10',
      };
    case 'mathematics':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-900/60',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
        gradient: 'from-amber-500/10 to-yellow-500/10',
      };
    case 'text-formatting':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/50',
        text: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-100 dark:border-teal-900/60',
        badgeBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
        gradient: 'from-teal-500/10 to-emerald-500/10',
      };
    case 'developer':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/50',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-100 dark:border-indigo-900/60',
        badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
        gradient: 'from-indigo-500/10 to-purple-500/10',
      };
    case 'unit-conversion':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/50',
        text: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-100 dark:border-sky-900/60',
        badgeBg: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
        gradient: 'from-sky-500/10 to-cyan-500/10',
      };
    case 'finance':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-100 dark:border-emerald-900/60',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
        gradient: 'from-emerald-500/10 to-teal-500/10',
      };
    case 'image-file':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/50',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-100 dark:border-purple-900/60',
        badgeBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
        gradient: 'from-purple-500/10 to-pink-500/10',
      };
    case 'productivity':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-100 dark:border-blue-900/60',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        gradient: 'from-blue-500/10 to-indigo-500/10',
      };
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-100 dark:border-blue-900/60',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
        gradient: 'from-blue-500/10 to-indigo-500/10',
      };
  }
}

export function ToolIcon({ name, className = 'w-5 h-5' }: ToolIconProps) {
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Calculator;
  return <IconComponent className={className} aria-hidden="true" />;
}

