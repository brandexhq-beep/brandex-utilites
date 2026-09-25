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

  const widthMap = {
    sm: 95,
    md: 127,
    lg: 175
  };

  const pixelHeight = {
    sm: 24,
    md: 32,
    lg: 44
  };

  return (
    <div className={`flex items-center space-x-2 select-none ${className}`}>
      <img 
        src="/brandex-logo.png" 
        alt="Brandex" 
        width={widthMap[size]}
        height={pixelHeight[size]}
        decoding="async"
        loading="eager"
        className={`${heightMap[size]} w-auto object-contain shrink-0 ${
          variant === 'dark' ? 'brightness-0 invert' : ''
        }`}
      />
    </div>
  );
}
