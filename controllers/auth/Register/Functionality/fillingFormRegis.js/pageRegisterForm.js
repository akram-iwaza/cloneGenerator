const {
  VerifcationCodeEmail,
} = require("../EmailCode/enteringVerifEmailCode.js");
const {
  addingProfileData,
} = require("../fillingFormRegis.js/enterProfileData.js");
const {
  saveProfileData,
} = require("../../../../../functionsFS/SaveProfile.js");
const verfiCode = new VerifcationCodeEmail();
const addingData = new addingProfileData();
const saveData = new saveProfileData();
class Registration {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async fillingFormRegis(
    page,
    email,
    passwordValue,
    randomFirstName,
    randomLastName,
    taskNumber
  ) {
    const optionValueToSelect = "MENS"; // Value of the "Men's" option
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      await verfiCode.enterVerificationCode(page, email, taskNumber);
      await this.delay(3000);
      const formattedDate = await addingData.enteringProfileData(
        page,
        passwordValue,
        randomFirstName,
        randomLastName,
        taskNumber
      );
      await this.delay(3000);

      const buttonSelector = 'button[aria-label="Create Account"]'; // Replace with the appropriate selector for the button
      await page.waitForSelector(buttonSelector);

      await page.waitForSelector(buttonSelector);
      await this.delay(3000);
      await page.click(buttonSelector);
      console.log("clicked button");
      console.log("Registration successful"); // Log success
      await saveData.addinfAccountTOFileJson(
        email,
        passwordValue,
        randomFirstName,
        randomLastName,
        optionValueToSelect,
        formattedDate,
        taskNumber
      );
    } catch (error) {
      console.log("All register function error : " + error);
      console.log("Retrying registration...");
      await this.fillingFormRegis(
        page,
        email,
        passwordValue,
        randomFirstName,
        randomLastName,
        taskNumber
      );
    }
  }
}
module.exports = {
  Registration,
};
