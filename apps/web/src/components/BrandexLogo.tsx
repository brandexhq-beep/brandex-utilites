import React from 'react';

interface BrandexLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' for white/light bg, 'dark' for dark navy bg
}

export default function BrandexLogo({ 
  className = "", 
  size = 'md',
  variant = 'light' 
}: BrandexLogoProps) {
  const heightMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-11'
  };

  return (
    <div className={`flex items-center space-x-2 select-none ${className}`}>
      <img 
        src="/brandex-logo.png" 
        alt="Brandex Logo" 
        className={`${heightMap[size]} w-auto object-contain shrink-0 ${
          variant === 'dark' ? 'brightness-0 invert' : ''
        }`}
      />
    </div>
  );
}
