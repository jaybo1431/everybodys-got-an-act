import type { Genre } from '../domain/types';

const GENRE_LABEL: Record<Genre, string> = {
  comedy: 'Comedy',
  drama: 'Drama',
  horror: 'Horror',
  action: 'Action',
  romance: 'Romance',
};

/** Minimal linework icon per genre — no photography, keeps the look consistent without stock imagery. */
function GenreIcon({ genre }: { genre: Genre }) {
  const stroke = 'rgb(var(--color-gold-light))';
  switch (genre) {
    case 'comedy':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 10a2 2 0 100-4 2 2 0 000 4zM16 10a2 2 0 100-4 2 2 0 000 4zM7 14c1.5 2 3.5 3 5 3s3.5-1 5-3"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9.25" stroke={stroke} strokeWidth="1.25" opacity="0.4" />
        </svg>
      );
    case 'drama':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l2.2 5.3 5.7.5-4.3 3.8 1.3 5.6L12 15.6 6.9 18.2l1.3-5.6-4.3-3.8 5.7-.5L12 3z" stroke={stroke} strokeWidth="1.25" strokeLinejoin="round" />
        </svg>
      );
    case 'horror':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3a9 9 0 100 18 9 9 0 010-18z"
            stroke={stroke}
            strokeWidth="1.25"
          />
          <path d="M12 3a6.5 6.5 0 010 18" fill={stroke} opacity="0.35" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.25" />
        </svg>
      );
  }
}

interface GenreCardProps {
  genre: Genre;
  onClick: () => void;
}

export function GenreCard({ genre, onClick }: GenreCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-surface hover:bg-surface-2 border border-hairline/10 hover:border-gold/30 rounded-lg px-5 py-5 transition text-left"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-md bg-surface-2 border border-hairline/10 shrink-0">
        <GenreIcon genre={genre} />
      </span>
      <span className="text-lg font-semibold font-display text-ink">{GENRE_LABEL[genre]}</span>
      <span className="ml-auto text-gold-light text-xl">&rsaquo;</span>
    </button>
  );
}
