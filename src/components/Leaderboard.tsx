import { ParticipantCard } from './ParticipantCard';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  tagline?: string;
}

export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  const ranked = [...entries].sort((a, b) => b.score - a.score);
  return (
    <div className="w-full space-y-2.5">
      {ranked.map((entry, i) => (
        <ParticipantCard key={entry.id} rank={i + 1} name={entry.name} score={entry.score} tagline={entry.tagline} />
      ))}
    </div>
  );
}
