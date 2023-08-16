const { handlingInOut } = require("../LoginorLogout/handleLoginandLogout.js");
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const handler = new handlingInOut();
const evasion_1 = fs.readFileSync("evasion-1.js", "utf-8");
const evasion_2 = fs
  .readFileSync("evasion-2.js", "utf-8")
  .replace(`'replaceWidth'`, 1920)
  .replace(`'replaceHeigh'`, 1080);
const sessions = "sessions";
if (!fs.existsSync(sessions)) {
  fs.mkdirSync(sessions);
}
class solveKasadaTask {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async solve_kasada_task(
    browserurl,
    username,
    password,
    emailAccount,
    passwordAccount,
    randomFirstName,
    randomLastName,
    taskNumber,
    profile_name
  ) {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: browserurl,
        defaultViewport: null,
      });

      const page = await browser.newPage();
      if (username != "" && password != "") {
        console.log("authenticating proxy user/pass");
        console.log("authenticationsss" + username + ":" + password);
        await page.authenticate({ username, password });
      }
      page.setDefaultTimeout(60000);
      page.setDefaultNavigationTimeout(60000);

      page.setRequestInterception(true);
      page.evaluateOnNewDocument(evasion_1);
      page.on("response", async (response) => {
        const url = response.url();
        if (url.endsWith("/fp")) {
          console.log("/fp request", response.status);
        }
      });
      page.on("request", (request) => {
        request.continue();
      });

      const loginUrl = "https://www.nike.com/launch";
      console.log(`${taskNumber}-logging`);

      await handler.handleLoginRetry(
        page,
        loginUrl,
        3,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName,
        taskNumber,
        profile_name
      );
      console.log(`Browser ${taskNumber} will be closed after a second...`);
      await this.delay(1000);
      await browser.close();
    } catch (error) {
      console.log(error, "kasadapage");
      return solve_kasada_task(
        browserurl,
        username,
        password,
        emailAccount,
        passwordAccount,
        randomFirstName,
        randomLastName,
        taskNumber
      );
    }
  }
}
module.exports = { solveKasadaTask };
