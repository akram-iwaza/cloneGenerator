class getSMSClass {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async gettingSMS(numberObject, taskNumber) {
    console.log(`${taskNumber} Getting SMS code from ${numberObject.number}`);
    const smsCodePromise = await numberObject.getCode(30);
    const check = await numberObject.success();
    console.log("checking what success nb gives us : " + check);
    if (smsCodePromise !== null) {
      return smsCodePromise;
    } else {
      console.log(`${taskNumber} Retrying: ${retries}`);
    }
  }
}
module.exports = {
  getSMSClass,
};
