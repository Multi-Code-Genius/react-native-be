export function generateReadableName(): string {
  const adjectives = [
    "Fast",
    "Blue",
    "Happy",
    "Lazy",
    "Clever",
    "Brave",
    "Chill",
    "Witty",
  ];
  const nouns = [
    "Fox",
    "Tiger",
    "Panda",
    "Hawk",
    "Wolf",
    "Eagle",
    "Lion",
    "Bear",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(10 + Math.random() * 90);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}
