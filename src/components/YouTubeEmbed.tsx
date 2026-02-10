"use client";

interface YouTubeEmbedProps {
  elementId: string;
}

export function YouTubeEmbed({ elementId }: YouTubeEmbedProps) {
  return (
    <div className="w-40 h-24 rounded-lg overflow-hidden bg-black/50 yt-player-container">
      <div id={elementId} />
    </div>
  );
}
