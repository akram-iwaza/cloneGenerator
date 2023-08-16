const Chance = require("chance");

const domain = "dsfclimatecool.com";

function generateRandomNumber() {
  return Math.floor(Math.random() * 1000); // Generates random number between 0 and 999
}

function generateRandomEmail() {
  const chance = new Chance();

  let randomFirstName, randomLastName;

  do {
    randomFirstName = chance.first();
    randomLastName = chance.last();
  } while (
    /[^a-zA-Z]/.test(randomFirstName) ||
    /[^a-zA-Z]/.test(randomLastName)
  );

  const sanitizedFirstName = randomFirstName.replace(/[\s']/g, "");
  const sanitizedLastName = randomLastName.replace(/[\s']/g, "");
  const randomNumbers = generateRandomNumber().toString().padStart(3, "0");
  const randomName = `${sanitizedFirstName}_${sanitizedLastName}_${randomNumbers}`;
  const email = `${randomName}@${domain}`;

  return { randomFirstName, randomLastName };
}

module.exports = generateRandomEmail;
