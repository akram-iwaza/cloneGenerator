const {
  waitForAndClick,
} = require("../../../../../clickMoves/clickButtons.js");
const { humanType } = require("../../../../../clickMoves/humanType.js");
const {
  getRandomDate,
  formatDate,
} = require("../../../../../helpers/generateDate.js");
class addingProfileData {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async enteringProfileData(
    page,
    passwordValue,
    randomFirstName,
    randomLastName,
    taskNumber
  ) {
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      const inputSelectorfirstName = "#l7r-first-name-input";
      const textToTypeName = randomFirstName; // Replace with the text you want to type
      await humanType(page, inputSelectorfirstName, textToTypeName, taskNumber);
      await this.delay(3000);
      const inputSelectorlastName = "#l7r-last-name-input";
      const textToTypeLastName = randomLastName; // Replace with the text you want to type
      await humanType(
        page,
        inputSelectorlastName,
        textToTypeLastName,
        taskNumber
      );
      await this.delay(3000);
      const passwordInputSelector = "#l7r-password-input"; // Replace with the appropriate selector for the Password input field
      await humanType(page, passwordInputSelector, passwordValue, taskNumber);
      await this.delay(3200);
      const selectElementSelector = "#l7r-shopping-preference"; // Replace with the appropriate selector for the select element
      await page.waitForSelector(selectElementSelector);
      const optionValueToSelect = "MENS"; // Value of the "Men's" option
      await page.select(selectElementSelector, optionValueToSelect);
      await this.delay(3100);
      const dateOfBirthInputSelector = "#l7r-date-of-birth-input";
      const startDate = new Date("1985-01-01");
      const endDate = new Date("2003-01-01");
      const randomDate = getRandomDate(startDate, endDate);
      const formattedDate = await formatDate(randomDate);
      await humanType(
        page,
        dateOfBirthInputSelector,
        formattedDate,
        taskNumber
      );
      await this.delay(3100);
      const checkboxSelector = "#privacyTerms"; // Replace with the appropriate selector for the checkbox
      waitForAndClick(page, checkboxSelector, taskNumber);
      await this.delay(3000);
      return formattedDate;
    } catch (error) {
      console.log(`${taskNumber} inputs Regitser error : ` + error);
      await page.evaluate(() => {
        document.querySelector("#l7r-first-name-input").value = "";
        document.querySelector("#l7r-last-name-input").value = "";
        document.querySelector("#l7r-password-input").value = "";
        document.querySelector("#l7r-date-of-birth-input").value = "";
        document.querySelector("#privacyTerms").checked = false;
      });

      return this.enteringProfileData(
        page,
        passwordValue,
        randomFirstName,
        randomLastName,
        taskNumber
      );
    }
  }
}
module.exports = {
  addingProfileData,
};
