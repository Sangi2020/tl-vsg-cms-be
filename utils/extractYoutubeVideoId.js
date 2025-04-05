/**
 * Extracts the YouTube Video ID from a given URL.
 * The YouTube video URL.
 * @param {string} url 
 * The extracted video ID or null if not found.
 * @returns {string|null}
 */

export const extractVideoId = (url) => {
    if (!url || typeof url !== "string") return null;
  
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
  
    return match && match[2].length === 11 ? match[2] : null;
  };