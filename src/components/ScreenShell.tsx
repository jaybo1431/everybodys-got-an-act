import type { ReactNode } from 'react';

export function ScreenShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`screen-height w-full flex flex-col items-center justify-between px-6 safe-top safe-bottom bg-bg text-ink ${className}`}
    >
      {children}
    </div>
  );
}
