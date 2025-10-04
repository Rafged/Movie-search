export function getVoteColor(v) {
  // v expected 0..10
  if (v >= 8) return '#66E900';
  if (v >= 6) return '#E9D100';
  if (v >= 4) return '#E97E00';
  return '#E90000';
}
