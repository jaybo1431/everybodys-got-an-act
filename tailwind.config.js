/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        ink: 'rgb(var(--color-text) / <alpha-value>)',
        'ink-dim': 'rgb(var(--color-text-dim) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--color-gold-light) / <alpha-value>)',
        'gold-dark': 'rgb(var(--color-gold-dark) / <alpha-value>)',
        silver: 'rgb(var(--color-silver) / <alpha-value>)',
        'silver-light': 'rgb(var(--color-silver-light) / <alpha-value>)',
        hairline: 'rgb(var(--color-border) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        elevated: 'var(--shadow-elevated)',
        'gold-glow': 'var(--shadow-gold-glow)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      height: {
        svh: '100svh',
      },
      minHeight: {
        svh: '100svh',
      },
    },
  },
  plugins: [],
};
