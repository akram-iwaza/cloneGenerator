const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForAndClickwithoutNav(page, selector, taskNumber) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    console.log(selector);
    const element = await page.waitForSelector(selector);
    await delay(2000);
    await element.click();
    console.log(`${taskNumber} clicking ${selector} done`);
  } catch (error) {
    console.error(
      `${taskNumber} Failed to click on ${selector} retrying:`,
      error
    );
    return waitForAndClickwithoutNav(page, selector, taskNumber);
  }
}
async function waitForAndClick(page, selector, taskNumber) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    console.log(selector);
    const element = await page.waitForSelector(selector);
    await delay(2000);
    await element.click();
    await page.waitForNavigation();
    console.log(`${taskNumber} Navigation after clicking ${selector} done`);
  } catch (error) {
    console.error(`${taskNumber} Failed to click on ${selector}:`, error);
    return waitForAndClick(page, selector, taskNumber);
  }
}
module.exports = { waitForAndClick, waitForAndClickwithoutNav };
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// async function waitForAndClick(page, selector) {
//   if (page.isClosed()) {
//     console.log("Page is closed, doing nothing and continuing...");
//     return;
//   }

//   try {
//     console.log(selector);
//     const element = await page.waitForSelector(selector);
//     await delay(2000);
//     await element.click();
//     await page.waitForNavigation();
//     console.log(`Navigation after clicking ${selector} done`);
//   } catch (error) {
//     console.error(`Failed to click on ${selector}:`, error);
//     console.log(`Retrying to click on ${selector}.`);
//     await waitForAndClick(page, selector);
//   }
// }

// module.exports = { waitForAndClick };
