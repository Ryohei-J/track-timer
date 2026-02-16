export interface LibraryTrack {
  id: string;
  label: string;
  src: string;
}

export const LIBRARY_TRACKS: LibraryTrack[] = [
  { id: "rain", label: "Rain", src: "/audio/rain.mp3" },
  { id: "cafe", label: "Cafe", src: "/audio/cafe.mp3" },
  { id: "jazz", label: "Jazz", src: "/audio/jazz.mp3" },
  { id: "lofi", label: "Lo-Fi Beats", src: "/audio/lofi.mp3" },
  // { id: "forest", label: "Forest", src: "/audio/forest.mp3" },
  // { id: "fireplace", label: "Fireplace", src: "/audio/fireplace.mp3" },
  // { id: "ocean", label: "Ocean Waves", src: "/audio/ocean.mp3" },
  // { id: "whitenoise", label: "White Noise", src: "/audio/whitenoise.mp3" },
  // { id: "piano", label: "Piano", src: "/audio/piano.mp3" },
  // { id: "brownoise", label: "Brown Noise", src: "/audio/brownoise.mp3" },
];

export const DEFAULT_LIBRARY_TRACK_ID = "rain";

export function getTrackById(id: string): LibraryTrack | undefined {
  return LIBRARY_TRACKS.find((t) => t.id === id);
}
