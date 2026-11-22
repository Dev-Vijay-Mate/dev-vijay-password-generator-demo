import test from "node:test";
import assert from "node:assert/strict";
import { generatePassword, CHARACTERS } from "../generator.js";

test("generates a password with the requested length", () => {
  const password = generatePassword({ length: 20 });
  assert.equal(password.length, 20);
});

test("includes each enabled character type", () => {
  const password = generatePassword({
    length: 12,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true
  });
  assert.match(password, /[a-z]/);
  assert.match(password, /[A-Z]/);
  assert.match(password, /[0-9]/);
  assert.match(password, /[!@#$%^&*()\-_=+\[\]{};:,.?/]/);
});

test("excludes ambiguous characters when requested", () => {
  const password = generatePassword({
    length: 32,
    excludeAmbiguous: true
  });
  assert.doesNotMatch(password, /[0Oo1lI]/);
});

test("rejects an options combination with no character types", () => {
  assert.throws(() => generatePassword({
    lowercase: false,
    uppercase: false,
    numbers: false,
    symbols: false
  }), /at least one character type/);
});
