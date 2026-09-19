export function Countdown({ count }: { count: number }) {
  return (
    <div className="text-shimmer-gold text-[7rem] leading-none font-display font-extrabold drop-shadow-lg">
      {count > 0 ? count : 'Go'}
    </div>
  );
}
