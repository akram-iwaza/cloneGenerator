const { typingNumberandAgree } = require("./typeNumber.js");
const typeangAgree = new typingNumberandAgree();
const { SMSActivate, SMSNumber } = require("sms-activate-org");
const api = new SMSActivate("A4db5f58c708Ac1A9150c54ed9d96806");
class getNumber {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async gettingPhoneNumber(
    page,
    taskNumber,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    profile_name
  ) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    try {
      let phoneN;
      const number = await api.getNumber({ service: "Nike", country: "USA" });
      await number.ready();
      phoneN = number.phoneNumber.slice(1);
      await typeangAgree.typePhoneNumber(page, phoneN, taskNumber);
      await this.delay(3000);
      await typeangAgree.agreeAndSubmit(page, taskNumber);
      return number;
    } catch (error) {
      console.log(error);
      return this.gettingPhoneNumber(
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
  getNumber,
};
