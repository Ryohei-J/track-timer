const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Bare video ID
  if (VIDEO_ID_REGEX.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    // youtube.com/watch?v=X or music.youtube.com/watch?v=X
    if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
      const id = url.searchParams.get("v");
      return id && VIDEO_ID_REGEX.test(id) ? id : null;
    }

    // youtu.be/X
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return VIDEO_ID_REGEX.test(id) ? id : null;
    }

    // youtube.com/embed/X or youtube.com/shorts/X
    if (url.hostname.includes("youtube.com")) {
      const match = url.pathname.match(/\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[2];
    }
  } catch {
    // Not a valid URL
  }

  return null;
}
