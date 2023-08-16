const { humanType } = require("../../../../../clickMoves/humanType.js");
const { getCodeEmail } = require("./GetiingVerifCode.js");

const getCode = new getCodeEmail();

class VerifcationCodeEmail {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async enterVerificationCode(page, email, taskNumber) {
    try {
      if (page.isClosed()) {
        console.log("Page is closed, doing nothing and continuing...");
        return;
      }
      const verifCode = '[name="verificationCode"]';
      await page.waitForSelector(verifCode);
      await this.delay(4000);
      const verificationCode = await getCode.fetchVerificationCodeFromEmail(
        email
      );
      if (verificationCode !== null) {
        console.log(
          `${taskNumber} Email: ${email}, Verification Code: ${verificationCode}`
        );
        await humanType(page, verifCode, verificationCode, taskNumber);
        return;
      } else {
        console.log(`${taskNumber} Email: ${email}, No Verification Code sent`);
      }
    } catch (error) {
      console.log(`${taskNumber} error in fetching code of email : ` + error);
      const inputElementHandle = await page.$('[name="verificationCode"]');
      await inputElementHandle.click({ clickCount: 3 }); // Select all text
      await inputElementHandle.press("Backspace");
      return this.enterVerificationCode(page, email, taskNumber);
    }
  }
}
module.exports = {
  VerifcationCodeEmail,
};
