import type { VideoHTMLAttributes } from 'react';

export function VideoPlayer({ className = '', ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <video
      controls
      playsInline
      className={`w-full rounded-md bg-black border border-hairline/10 ${className}`}
      {...props}
    />
  );
}
