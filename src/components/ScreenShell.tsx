import type { ReactNode } from 'react';

export function ScreenShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between px-6 py-10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white ${className}`}
    >
      {children}
    </div>
  );
}
