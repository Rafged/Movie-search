import { format } from "date-fns";

export function formatDate(dateStr?: string, fmt = "dd MMM yyyy") {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return format(d, fmt);
  } catch {
    return dateStr;
  }
}
