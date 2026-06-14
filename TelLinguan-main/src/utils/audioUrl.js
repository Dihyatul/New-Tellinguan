/**
 * Converts a Google Drive view/share URL to a direct streamable URL.
 * Passes through all other URLs unchanged.
 */
export const resolveAudioUrl = (url) => {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};
