/**
 * BrandEX UI Package
 * Reusable UI primitives, styling utilities, and shared component abstractions.
 */

import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export * from 'lucide-react';
