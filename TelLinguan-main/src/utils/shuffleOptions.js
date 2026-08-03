// Shuffles an options array while tracking each option's original index,
// so the selected choice can be mapped back before submitting to the backend
// (which scores against the original, unshuffled answer index).
export const shuffleOptions = (options) => {
  const indexed = options.map((text, originalIndex) => ({ text, originalIndex }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return indexed;
};
