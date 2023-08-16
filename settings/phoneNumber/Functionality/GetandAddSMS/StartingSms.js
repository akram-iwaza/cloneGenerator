const { getSMSClass } = require("./getSMS.js");
const { typingSMSCode } = require("./typeSMS.js");
const { savePhoneClass } = require("../../../../functionsFS/savePhone.js");
// const { startGettingNumSms } = require("../StartingFunctions.js");
const { getNumber } = require("../GetandAddNumber/getNumber.js");
const getNumbers = new getNumber();
const getSMS = new getSMSClass();
const typeSMS = new typingSMSCode();
const savePhone = new savePhoneClass();
// const { startingFuncPhoneSMS } = require("../../mainFuncUse.js");

// const startingFuncPhoneSMS = startGettingNumSms();
class StartingSMS {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // async returnclickAddButtons(
  //   page,
  //   email,
  //   taskNumber,
  //   emailAccount,
  //   passwordAccount,
  //   randomFirstName,
  //   randomLastName,
  //   profile_name
  // ) {
  //   if (page.isClosed()) {
  //     console.log("Page is closed, doing nothing and continuing...");
  //     return;
  //   }
  //   try {
  //     const addButtonSelector = 'button[aria-label="Add Mobile Number"]';
  //     await page.waitForSelector(addButtonSelector);
  //     await page.click(addButtonSelector);
  //     await this.delay(3000);
  //     const numberObject = await getNumbers.gettingPhoneNumber(
  //       page,
  //       taskNumber,
  //       emailAccount,
  //       passwordAccount,
  //       randomFirstName,
  //       randomLastName,
  //       profile_name
  //     );
  //     await this.delay(3000);
  //     this.gettingSMSCode(
  //       page,
  //       numberObject,
  //       email,
  //       taskNumber,
  //       emailAccount,
  //       passwordAccount,
  //       randomFirstName,
  //       randomLastName,
  //       profile_name
  //     );
  //   } catch (error) {
  //     console.log(`${taskNumber} Error clicking or adding button: ` + error);
  //     await page.evaluate(() => {
  //       location.reload();
  //     });
  //     // return this.returnclickAddButtons(
  //     //   page,
  //     //   taskNumber,
  //     //   emailAccount,
  //     //   passwordAccount,
  //     //   randomFirstName,
  //     //   randomLastName,
  //     //   profile_name
  //     // ); // Rethrow the error to be caught by the caller
  //   }
  // }
  async doneButtonAction(page, taskNumber) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const doneBtn = '[data-testid="done-button"]';
      await page.waitForSelector(doneBtn);
      await page.click(doneBtn);
    } catch (error) {
      console.log(`${taskNumber} error to click on doneBtn  ` + error);

      console.log("Retring...");
      return this.doneButtonAction(page, taskNumber);
    }
  }
  async closeDialogOnError(page, taskNumber) {
    try {
      const closeBtn = 'button[aria-label="Close Dialog"]';
      await page.waitForSelector(closeBtn);
      await page.click(closeBtn);
    } catch (error) {
      console.log(`${taskNumber} error to click on closeBtn  ` + error);
      console.log("Retring...");
      return this.closeDialogOnError(page, taskNumber);
    }
  }
  async gettingSMSCode(
    page,
    numberObject,
    email,
    taskNumber,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    profile_name
  ) {
    try {
      const smsCode = await getSMS.gettingSMS(numberObject, taskNumber);
      // const check = await numberObject.success();
      // console.log(`${taskNumber} Received SMS code: ` + smsCode);
      if (smsCode) {
        await typeSMS.enterSMSCode(page, smsCode, taskNumber);
        await this.delay(3000);
        await this.doneButtonAction(page, taskNumber);
        console.log(`${taskNumber} SMS verification successful`);
      } else {
        throw new Error("Retrting ....");
      }
    } catch (error) {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      console.log(`${taskNumber} Error while entering SMS code: ` + error);
      await this.closeDialogOnError(page, taskNumber);
      await this.delay(2000);
      await page.evaluate(() => {
        location.reload();
      });
      await page.waitForNavigation();
      throw new Error("check if it will retry.... ");
    }
  }
}
module.exports = {
  StartingSMS,
};
