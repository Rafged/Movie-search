export function ratingColor(v: number) {
  if (v >= 7) return "#66E900";
  if (v >= 5) return "#E9D100";
  if (v >= 3) return "#E97E00";
  return "#E90000";
}
