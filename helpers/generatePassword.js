async function getPassword() {
  const password = generatePassword();
  console.log("Generated Password:", password);
  return password;
}
async function generatePassword() {
  const length = 8;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const allChars = uppercaseChars + lowercaseChars + numberChars;

  let password = "";

  // Add at least one uppercase letter
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];

  // Add at least one lowercase letter
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];

  // Add at least one number
  password += numberChars[Math.floor(Math.random() * numberChars.length)];

  // Fill the rest of the password length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password;
}

module.exports = {
  getPassword,
};
