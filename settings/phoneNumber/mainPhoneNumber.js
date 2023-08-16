const fs = require("fs");
const { startGettingNumSms } = require("./Functionality/StartingFunctions.js");
const startingFuncPhoneSMS = new startGettingNumSms();

class addingNumberandCode {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async goingToSettings(
    page,
    taskNumber,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    profile_name
  ) {
    console.log(`${taskNumber} started  adding  number`);
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      await page.waitForSelector('span[data-qa="user-name"]');
      const value = await page.evaluate(() => {
        const spanElement = document.querySelector('span[data-qa="user-name"]');
        return spanElement.textContent.trim();
      });
      console.log(value);
      const profilesData = fs.readFileSync("profiles.json", "utf8");
      const profiles = JSON.parse(profilesData);
      let email = null;
      for (const profileId in profiles) {
        const profile = profiles[profileId];
        if (profile.name === value) {
          email = profile.email;
          break;
        }
      }
      if (email) {
        console.log(`${taskNumber}  Email for ${value}: ${email}`);
      } else {
        console.log(` ${taskNumber} No email found for ${value}`);
        await page.close();
        throw new Error(` ${taskNumber}  No email found for ${value}`);
      }

      const userNameButton = ".portrait-dropdown";
      // await waitForAndClickwithoutNav(page, userNameButton);
      await page.waitForSelector(userNameButton);
      await page.click(userNameButton);
      await this.delay(3000);
      const settingsBtn = 'a[data-qa="top-nav-settings-link"]';
      await page.waitForSelector(settingsBtn);
      await page.click(settingsBtn);
      // await waitForAndClick(page, settingsBtn);
      await startingFuncPhoneSMS.startingFunctions(
        page,
        email,
        taskNumber,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName,
        profile_name
      );
    } catch (error) {
      console.error(`${taskNumber}  Error during form filling: ${error}`);
      await this.goingToSettings(
        page,
        taskNumber,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName,
        profile_name
      );
    }
  }
}
module.exports = {
  addingNumberandCode,
};
