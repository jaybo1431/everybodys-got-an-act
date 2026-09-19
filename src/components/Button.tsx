import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'gold' | 'surface' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gold: 'shimmer-gold text-bg shadow-gold-glow',
  surface: 'bg-surface-2 hover:bg-surface-2/80 text-ink border border-hairline/10',
  ghost: 'bg-transparent hover:bg-ink/5 text-ink border border-hairline/20',
  danger: 'bg-red-900/80 hover:bg-red-900 text-ink border border-red-500/30',
};

export function Button({ variant = 'gold', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-7 py-4 rounded-pill font-sans font-semibold text-base tracking-tight transition active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
