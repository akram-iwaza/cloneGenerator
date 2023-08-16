const { waitForAndClick } = require("../../../../clickMoves/clickButtons.js");
const { humanType } = require("../../../../clickMoves/humanType.js");

class typingNumberandAgree {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async typePhoneNumber(page, phoneNumber, taskNumber) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const phoneNumberSelector = "#phoneNumber";
      await page.waitForSelector(phoneNumberSelector);
      console.log("phoneNumber : " + phoneNumber);
      await humanType(page, phoneNumberSelector, phoneNumber, taskNumber);
    } catch (error) {
      console.log(`${taskNumber} error to click on phoneNumber  : ` + error);
      console.log("Retring...");
      return this.typePhoneNumber(page, phoneNumber);
    }
  }
  async agreeAndSubmit(page, taskNumber) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      const agreeSelector = "#agreeToTerms";
      const agreeSelectors =
        "#modal-root > div > div > div > div > div > section > div > div.css-we8bvk.e4rebre0 > form > div.d-sm-flx.flx-jc-sm-fe.mt6-sm > button";
      await page.waitForSelector(agreeSelector);
      await page.click(agreeSelector);
      await this.delay(3000);
      await page.waitForSelector(agreeSelectors);
      await page.click(agreeSelectors);
    } catch (error) {
      console.log(`${taskNumber} error to click on agree to terms  : ` + error);
      console.log("Retring...");
      return this.agreeAndSubmit(page, taskNumber);
    }
  }
}
module.exports = {
  typingNumberandAgree,
};
