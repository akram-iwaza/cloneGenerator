const {
  waitForAndClick,
} = require("../../../../../clickMoves/clickButtons.js");
const { humanType } = require("../../../../../clickMoves/humanType.js");

class fillEmail {
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async enterEmailAuth(page, email, taskNumber) {
    try {
      await this.delay(3000);
      const buttonExistsAnotherAcc = await page.evaluate(() => {
        const button = document.querySelector("button.css-5iaamc");
        return !!button; // Returns true if the button element is found, false otherwise
      });
      if (buttonExistsAnotherAcc) {
        // Click the button
        await page.click("button.css-5iaamc");
        await page.waitForNavigation();
      }

      const usernameSelector = "#username";
      await page.waitForSelector(usernameSelector);
      const errorEncounteredProblemEmail = await page.$(".css-1y6e8q");
      await this.delay(3000);
      if (errorEncounteredProblemEmail) {
        await page.evaluate(() => {
          location.reload();
        });
        return enterEmailAuth(page, email, taskNumber);
      }
      // Type the email address
      await humanType(page, usernameSelector, email, taskNumber);
      await this.delay(5000);
      const errorMessageSelector =
        '.nds-input-support-text.css-vdw014.e1xmwk8m0[data-testid="support-text"]';
      const errorMessageExists = await page.evaluate((selector) => {
        return !!document.querySelector(selector);
      }, errorMessageSelector);

      if (errorMessageExists) {
        // Check for error message here
        console.log("Invalid email address");
        // Clear the input
        await page.focus(usernameSelector);
        await page.keyboard.down("Control");
        await page.keyboard.press("A");
        await page.keyboard.up("Control");
        await page.keyboard.press("Backspace");

        // Retry
        return this.enterEmailAuth(page, email);
      }
      // Click the continue button
      const continueBtn = '[aria-label="continue"]';
      await waitForAndClick(page, continueBtn, taskNumber);

      // Check if the error message exists

      await this.delay(2000);
    } catch (error) {
      console.log(`${taskNumber} error in entering email : " ` + error);
      return this.enterEmailAuth(page, email, taskNumber);
    }
  }

  // async enterEmailAuth(page, email) {
  //   try {
  //     // if (page.isClosed()) {
  //     //   console.log("Page is closed, doing nothing and continuing...");
  //     //   return;
  //     // }
  //     await this.delay(3000);
  //     const buttonExists = await page.evaluate(() => {
  //       const button = document.querySelector("button.css-5iaamc");
  //       return !!button; // Returns true if the button element is found, false otherwise
  //     });
  //     if (buttonExists) {
  //       // Click the button
  //       await page.click("button.css-5iaamc");
  //       await page.waitForNavigation();
  //     }
  //     const usernameSelector = "#username";
  //     await humanType(page, usernameSelector, email);
  //     await this.delay(2000);
  //     const continueBtn = '[aria-label="continue"]';
  //     await waitForAndClick(page, continueBtn);
  //   } catch (error) {
  //     console.log("error in entering email : " + error);
  //     return this.enterEmailAuth(page, email);
  //   }
  // }
}
module.exports = {
  fillEmail,
};
