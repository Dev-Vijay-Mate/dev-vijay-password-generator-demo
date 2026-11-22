import { generatePassword } from "./generator.js";

const passwordInput = document.querySelector("#password");
const lengthInput = document.querySelector("#length");
const lengthOutput = document.querySelector("#length-output");
const generateButton = document.querySelector("#generate-button");
const copyButton = document.querySelector("#copy-button");
const toast = document.querySelector("#toast");
const strengthFill = document.querySelector(".strength-fill");
const strengthLabel = document.querySelector("#strength-label");
const strengthCount = document.querySelector("#strength-count");

function options() {
  return {
    length: Number(lengthInput.value),
    lowercase: document.querySelector("#lowercase").checked,
    uppercase: document.querySelector("#uppercase").checked,
    numbers: document.querySelector("#numbers").checked,
    symbols: document.querySelector("#symbols").checked,
    excludeAmbiguous: document.querySelector("#exclude-ambiguous").checked
  };
}

function updateStrength(password) {
  const enabledCount = ["lowercase", "uppercase", "numbers", "symbols"]
    .filter((name) => document.querySelector(`#${name}`).checked).length;
  const score = Math.min(100, (password.length / 32) * 55 + enabledCount * 11);
  strengthFill.style.width = `${score}%`;
  strengthFill.style.background = score >= 75 ? "#7ee2a8" : score >= 50 ? "#f1c36b" : "#e77878";
  strengthLabel.textContent = score >= 75 ? "Strong password" : score >= 50 ? "Good password" : "Weak password";
  strengthLabel.style.color = score >= 75 ? "#7ee2a8" : score >= 50 ? "#f1c36b" : "#e77878";
  strengthCount.textContent = `${password.length} characters`;
}

function generate() {
  try {
    const password = generatePassword(options());
    passwordInput.value = password;
    lengthOutput.value = lengthInput.value;
    lengthOutput.textContent = lengthInput.value;
    updateStrength(password);
  } catch (error) {
    toast.textContent = error.message;
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
      toast.textContent = "Copied to clipboard";
    }, 1800);
  }
}

lengthInput.addEventListener("input", () => {
  lengthOutput.value = lengthInput.value;
  lengthOutput.textContent = lengthInput.value;
  generate();
});

document.querySelectorAll(".controls-card input[type='checkbox']").forEach((input) => {
  input.addEventListener("change", generate);
});

generateButton.addEventListener("click", generate);

copyButton.addEventListener("click", async () => {
  if (!passwordInput.value) return;
  try {
    await navigator.clipboard.writeText(passwordInput.value);
  } catch {
    passwordInput.select();
    document.execCommand("copy");
  }
  copyButton.classList.add("copied");
  toast.classList.add("visible");
  setTimeout(() => {
    copyButton.classList.remove("copied");
    toast.classList.remove("visible");
  }, 1400);
});

generate();
