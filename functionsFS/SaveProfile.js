const fs = require("fs");

class saveProfileData {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async addinfAccountTOFileJson(
    email,
    passwordValue,
    randomFirstName,
    randomLastName,
    optionValueToSelect,
    formattedDate,
    taskNumber
  ) {
    try {
      const profilesFile = "profiles.json";
      if (!fs.existsSync(profilesFile)) {
        fs.writeFileSync(profilesFile, JSON.stringify({}));
      }

      // Read the existing data from profiles.json
      const profilesData = JSON.parse(fs.readFileSync(profilesFile));
      const id = new Date().getTime();
      // Create a new profile object with the email and password
      const newProfile = {
        email: email,
        password: passwordValue,
        name: randomFirstName + " " + randomLastName,
        shoppingPreference: optionValueToSelect,
        dateOfBirth: formattedDate,
        privacyTermsAgreed: true,
        createdAt: new Date(),
      };

      // Add the new profile using email as the key
      profilesData[id] = newProfile;

      // Write the updated data back to profiles.json
      fs.writeFileSync(profilesFile, JSON.stringify(profilesData));
      console.log(`${taskNumber} Profile added to profiles.json`);

      await this.delay(3000);
    } catch (error) {
      console.error(`${taskNumber} Error handling profiles.json : ` + error);
      // If the maximum number of retries is reached, close the page
      await this.addinfAccountTOFileJson(
        email,
        passwordValue,
        randomFirstName,
        randomLastName,
        optionValueToSelect,
        formattedDate,
        taskNumber
      );
    }
  }
}
module.exports = {
  saveProfileData,
};
