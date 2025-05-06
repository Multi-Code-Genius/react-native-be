export const convertToIST = (timeStr: string, date: string) => {
  const [time, meridian] = timeStr.toLowerCase().split(/(am|pm)/);
  let hour = parseInt(time.trim());
  if (meridian === "pm" && hour !== 12) {
    hour += 12;
  } else if (meridian === "am" && hour === 12) {
    hour = 0;
  }

  const dateTimeString = `${date}T${String(hour).padStart(2, "0")}:00:00+05:30`;
  return new Date(dateTimeString);
};
