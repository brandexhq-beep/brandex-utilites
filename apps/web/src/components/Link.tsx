import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

export default function Link({ href, children, className, ...props }: LinkProps) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
