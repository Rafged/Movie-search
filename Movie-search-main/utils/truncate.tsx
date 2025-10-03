export function truncate(str, n) {
  if (!str) return '';
  if (str.length <= n) return str;
  // find last space before n
  const idx = str.lastIndexOf(' ', n);
  if (idx > 0) return str.slice(0, idx) + '...';
  return str.slice(0, n) + '...';
}
