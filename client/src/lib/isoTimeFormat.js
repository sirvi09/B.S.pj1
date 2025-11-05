export default function isoTimeFormat(time) {
  if (!time) return "N/A";

  const date = new Date(`1970-01-01T${time}:00`);

  if (isNaN(date.getTime())) return time;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
