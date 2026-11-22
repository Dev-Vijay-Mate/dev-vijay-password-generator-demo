export const CHARACTERS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/"
};

export const AMBIGUOUS_CHARACTERS = "0Oo1lI";

function randomInt(maximum) {
  if (!Number.isSafeInteger(maximum) || maximum < 1) {
    throw new RangeError("maximum must be a positive integer");
  }
  const limit = Math.floor(0x100000000 / maximum) * maximum;
  const values = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return values[0] % maximum;
}

function pick(characters) {
  return characters[randomInt(characters.length)];
}

export function generatePassword(options = {}) {
  const settings = {
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    excludeCharacters: "",
    ...options
  };

  if (!Number.isInteger(settings.length) || settings.length < 1) {
    throw new TypeError("length must be a positive integer");
  }
  if (typeof settings.excludeCharacters !== "string") {
    throw new TypeError("excludeCharacters must be a string");
  }

  const enabledTypes = ["lowercase", "uppercase", "numbers", "symbols"]
    .filter((type) => settings[type]);
  if (enabledTypes.length === 0) {
    throw new TypeError("at least one character type must be enabled");
  }
  if (settings.length < enabledTypes.length) {
    throw new RangeError("length must be at least the number of enabled character types");
  }

  const characterSets = enabledTypes.map((type) => [...CHARACTERS[type]]
    .filter((character) => !settings.excludeAmbiguous || !AMBIGUOUS_CHARACTERS.includes(character))
    .filter((character) => !settings.excludeCharacters.includes(character))
    .join(""));

  if (characterSets.some((characters) => characters.length === 0)) {
    throw new RangeError("excludeCharacters removes all characters from an enabled character type");
  }

  const passwordCharacters = characterSets.map(pick);
  const allCharacters = characterSets.join("");
  while (passwordCharacters.length < settings.length) {
    passwordCharacters.push(pick(allCharacters));
  }
  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [passwordCharacters[index], passwordCharacters[swapIndex]] =
      [passwordCharacters[swapIndex], passwordCharacters[index]];
  }
  return passwordCharacters.join("");
}
