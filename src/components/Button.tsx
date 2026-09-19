import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-white',
  ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20',
  danger: 'bg-red-500/80 hover:bg-red-500 text-white',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-6 py-3 rounded-full font-semibold text-lg transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
