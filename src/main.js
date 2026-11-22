import { generatePassword } from "dev-vijay-simple-password-generator";
import "./style.css";

const passwordOutput = document.querySelector("#password");
const lengthInput = document.querySelector("#length");
const lengthValue = document.querySelector("#length-value");
const message = document.querySelector("#message");

function createPassword() {
  try {
    const password = generatePassword({
      length: Number(lengthInput.value),
      lowercase: document.querySelector("#lowercase").checked,
      uppercase: document.querySelector("#uppercase").checked,
      numbers: document.querySelector("#numbers").checked,
      symbols: document.querySelector("#symbols").checked,
      excludeAmbiguous: document.querySelector("#exclude-ambiguous").checked
    });

    passwordOutput.value = password;
    passwordOutput.textContent = password;
    message.textContent = "Generated with the published npm package.";
  } catch (error) {
    message.textContent = error.message;
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

document.querySelector("#generate").addEventListener("click", createPassword);

document.querySelector("#copy").addEventListener("click", async () => {
  if (!passwordOutput.textContent || passwordOutput.textContent === "Click Generate") return;
  await navigator.clipboard.writeText(passwordOutput.textContent);
  message.textContent = "Password copied to clipboard.";
});

createPassword();
