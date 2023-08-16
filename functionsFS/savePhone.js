const fs = require("fs");

class savePhoneClass {
  async updateProfileWithNumber(email, phoneNumber, taskNumber) {
    try {
      const profilesDataPhone = fs.readFileSync("profiles.json", "utf8");
      const profilesPhone = JSON.parse(profilesDataPhone);

      for (let id in profilesPhone) {
        if (profilesPhone[id].email === email) {
          profilesPhone[id].phoneNumber = "+" + phoneNumber;
          console.log(
            `${taskNumber} - ${phoneNumber} is added for email ${email}`
          );
        }
      }

      fs.writeFileSync(
        "profiles.json",
        JSON.stringify(profilesPhone, null, 2),
        "utf8"
      );
    } catch (error) {
      console.log(`${taskNumber} error in updateProfileWithNumber: ` + error);
      console.log("Retrying...");
      return this.updateProfileWithNumber(email, phoneNumber);
    }
  }
}
module.exports = {
  savePhoneClass,
};
// https://www.nike.com/member/settings/account
