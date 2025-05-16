export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

export function istToUTC(time: string, dateStr: string): Date {
  const time24 = convertTo24Hour(time);
  return new Date(`${dateStr}T${time24}:00+05:30`);
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const inputDateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return inputDateOnly < todayOnly;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
