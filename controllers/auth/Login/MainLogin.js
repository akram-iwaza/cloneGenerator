const {
  getCodeEmail,
} = require("../Register/Functionality/EmailCode/GetiingVerifCode.js");
const {
  addingNumberandCode,
} = require("../../../settings/phoneNumber/mainPhoneNumber.js");
const getVerifEmail = new getCodeEmail();
const addNumberSMS = new addingNumberandCode();

class LoginMain {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async login(page, email, passwordAccount) {
    try {
      const passCodeSelector = 'input[name="password"]';
      //   const element = await page.$(passCodeSelector);
      await page.waitForSelector(passCodeSelector);
      await this.delay(2000);
      await page.type(passCodeSelector, passwordAccount);
      await this.delay(3000);

      await page.waitForSelector('button[aria-label="Sign In"]');
      await page.click('button[aria-label="Sign In"]');
      await page.waitForNavigation();
      await this.delay(10000);
      await getVerifEmail.fetchVerificationCodeFromEmail(page, email);
      await this.delay(4000);
      const continueButtonSelector = 'button[aria-label="Continue"]';

      // Wait for the button to be visible and ready for interaction
      await page.waitForSelector(continueButtonSelector);

      // Click the "Continue" button
      await page.click(continueButtonSelector);
      await page.waitForNavigation();
      await this.delay(3000);

      await addNumberSMS.goingToSettings(page);
      await this.delay(3000);
    } catch (error) {
      console.error("Error handling profiles.json:", error);
    }
  }
}
module.exports = {
  LoginMain,
};
