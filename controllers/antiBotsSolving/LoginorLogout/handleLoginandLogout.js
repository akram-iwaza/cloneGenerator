const fs = require("fs");
const {
  waitForAndClick,
  waitForAndClickwithoutNav,
} = require("../../../clickMoves/clickButtons.js");
const { smoothScroll } = require("../../../clickMoves/scrolling.js");
const { FillFormRegister } = require("../../auth/Register/MainRegister.js");
const sessions = "sessions";
if (!fs.existsSync(sessions)) {
  fs.mkdirSync(sessions);
}
const fillForm = new FillFormRegister();
class handlingInOut {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async handleLogout(page) {
    try {
      console.log("Logging Out");

      await page.evaluate(() => {
        localStorage.clear();
      });
      await page.evaluate(() => {
        location.reload();
      });
      // Wait for navigation to complete after clicking logout
      await page.waitForNavigation();
      // await page.waitForNavigation();
      console.log("End Logging Out");
    } catch (error) {
      console.log("error in handle Logout : " + error);
      return this.handleLogout(page);
    }
  }
  async handleLoginRetry(
    page,
    url,
    maxRetries,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    taskNumber,
    profile_name
  ) {
    if (page.isClosed()) {
      return;
    }
    try {
      await page.goto(url);
      await this.delay(2000);
      const verifCodeSelector =
        'button[data-qa="top-nav-join-or-login-button"]';
      const element = await page.$(verifCodeSelector);
      if (element) {
        console.log("Join/Log In button exists");
        // await smoothScroll(page, 10);
        await this.delay(3500);
        await waitForAndClick(page, verifCodeSelector, taskNumber);
        await this.delay(3000);
        await fillForm.fillRegistrationForm(
          page,
          emailAccount,
          passwordAccount,
          randomFirstName,
          randomLastName,
          taskNumber,
          profile_name
        );
      } else {
        console.log("Join/Log In button does not exist");
        await this.handleLogout(page);
        await this.delay(3000);
        // await smoothScroll(page, 10);
        await waitForAndClick(page, verifCodeSelector, taskNumber);
        await this.delay(4000);
        await fillForm.fillRegistrationForm(
          page,
          emailAccount,
          passwordAccount,
          randomFirstName,
          randomLastName,
          taskNumber,
          profile_name
        );
      }

      await this.delay(10000);
      // console.log("Login process succeeded."); // Adding success log
    } catch (error) {
      console.log(`Attempt  failed:`, error);
      await page.evaluate(() => {
        location.reload();
      });
      return this.handleLoginRetry(
        page,
        url,
        maxRetries,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName,
        taskNumber,
        profile_name
      );
    }
  }
}
module.exports = { handlingInOut };
