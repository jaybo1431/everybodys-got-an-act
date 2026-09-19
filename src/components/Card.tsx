import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-surface border border-hairline/10 rounded-lg shadow-elevated ${className}`}
      {...props}
    />
  );
}
