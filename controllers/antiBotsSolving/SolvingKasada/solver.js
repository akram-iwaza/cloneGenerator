const chrome_launcher = require("chrome-launcher");
const axios = require("axios");
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const fp_body = fs.readFileSync("fp-body.html", "utf-8");
const fp_url =
  "https://unite.nike.com/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/fp";
const sessions = "sessions";
const evasion_1 = fs.readFileSync("evasion-1.js", "utf-8");
const evasion_2 = fs
  .readFileSync("evasion-2.js", "utf-8")
  .replace(`'replaceWidth'`, 1920)
  .replace(`'replaceHeigh'`, 1080);
if (!fs.existsSync(sessions)) {
  fs.mkdirSync(sessions);
}
class KasadaSolver {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async getWsUrl(debuggerPort) {
    try {
      console.log("get response");
      const get = await axios.get(
        "http://127.0.0.1:" + debuggerPort + "/json/version"
      );
      // console.log(get)
      return get.data.webSocketDebuggerUrl;
    } catch (e) {
      // console.log(e)
      return this.getWsUrl(debuggerPort);
    }
  }

  async solve_shared() {
    const flags = [
      "--allow-pre-commit-input",
      "--disable-background-networking",
      "--enable-features=NetworkServiceInProcess2",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-dev-shm-usage",
      "--disable-features=Translate,BackForwardCache,AvoidUnnecessaryBeforeUnloadCheckSync",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-popup-blocking",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-sync",
      "--force-color-profile=srgb",
      "--metrics-recording-only",
      "--no-first-run",
      "--password-store=basic",
      "--use-mock-keychain",
      "--enable-blink-features=IdleDetection",
      "--export-tagged-pdf",
      "--headless",
      "--hide-scrollbars",
      "--mute-audio",
      "--no-first-run",
      "--enable-features=ReduceUserAgent",
      "--disable-blink-features=AutomationControlled",
      "--disable-site-isolation-trials",
      "--test-type",
      "--window-size=1920,1080",
    ];

    let launched = await chrome_launcher.launch({
      chromeFlags: flags,
      ignoreDefaultFlags: true,
    });

    const browserURL = "http://127.0.0.1:" + launched.port;
    console.log({ browserURL });

    console.log("Solving shared", browserURL);
    let wsUrl = await this.getWsUrl(launched.port);
    console.log("wsUrl ===>" + wsUrl);
    await this.solve_kasada_shared(wsUrl);
    launched.kill();
  }
  async solve_kasada_shared(browserurl) {
    console.log("solve_kasada_shared");
    const browser = await puppeteer.connect({
      browserWSEndpoint: browserurl,
      defaultViewport: null,
    });

    // const page = await browser.newPage();
    let pages = await browser.pages();
    let page = pages[0];
    console.log("solve_kasada_shared get page x2 evaluations scripts");
    page.setRequestInterception(true);
    page.evaluateOnNewDocument(evasion_1);
    page.evaluateOnNewDocument(evasion_2);

    page.on("request", (request) => {
      const url = request.url();
      if (url.endsWith("/fp")) {
        request.respond({
          status: 200,
          contentType: "text/html; charset=UTF-8",
          body: fp_body,
        });
      } else {
        request.continue();
      }
    });
    console.log("goto: ", fp_url);

    await page.goto(fp_url);
    console.log("got response and browser closer");
    console.log("done");
  }
}
module.exports = { KasadaSolver };
