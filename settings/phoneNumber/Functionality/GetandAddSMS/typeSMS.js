const { humanType } = require("../../../../clickMoves/humanType.js");

class typingSMSCode {
  async enterSMSCode(page, smsCode, taskNumber) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      console.log("SMS Code : " + smsCode);
      const selectorCode =
        'input[type="number"][name="code"].nds-input-text-field.css-1vpt1v7.e1fiih290';
      await humanType(page, selectorCode, smsCode, taskNumber);
    } catch (error) {
      console.log(
        `${taskNumber} error to click on enterVerificationCode  ` + error
      );
      console.log("Retring...");
      return this.enterSMSCode(page, smsCode, taskNumber);
    }
  }
}
module.exports = {
  typingSMSCode,
};
