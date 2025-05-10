export function convertTo24Hour(time: string): string {
  const match = time.match(/(\d+):(\d+)\s*(am|pm)/i);

  if (!match) throw new Error("Invalid time format");

  const [_, hour, minute, ampm] = match;
  let h = parseInt(hour);

  if (ampm.toLowerCase() === "pm" && h !== 12) h += 12;
  if (ampm.toLowerCase() === "am" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${minute}`;
}
