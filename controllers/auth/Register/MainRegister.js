const {
  fillEmail,
} = require("./Functionality/fillingFormRegis.js/addingEmail.js");
const {
  Registration,
} = require("./Functionality/fillingFormRegis.js/pageRegisterForm.js");
const {
  addingNumberandCode,
} = require("../../../settings/phoneNumber/mainPhoneNumber.js");
const { LoginMain } = require("../Login/MainLogin.js");
const emailFill = new fillEmail();
const regis = new Registration();
const addNumberSMS = new addingNumberandCode();
const getLoggedIn = new LoginMain();
class FillFormRegister {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async fillRegistrationForm(
    page,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    taskNumber,
    profile_name
  ) {
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      await emailFill.enterEmailAuth(page, emailAccount, taskNumber);
      const verifCodeSelectorcheck = '[name="verificationCode"]';
      const element = await page.$(verifCodeSelectorcheck);

      if (element) {
        await regis.fillingFormRegis(
          page,
          emailAccount,
          passwordAccount,
          randomFirstName,
          randomLastName,
          taskNumber
        );
        await this.delay(5000);
        console.log(`${taskNumber}starting to add number`);
        await addNumberSMS.goingToSettings(
          page,
          taskNumber,
          emailAccount,
          passwordAccount,
          randomFirstName,
          randomLastName,
          profile_name
        );
      } else {
        await getLoggedIn.login(page, emailAccount, passwordAccount);
      }
    } catch (error) {
      console.error(`Error during form filling register main: ${error}`);
      return this.fillRegistrationForm(
        page,
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
module.exports = {
  FillFormRegister,
};
