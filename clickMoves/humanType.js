async function clearInput(page, element) {
  await page.evaluate((el) => (el.value = ""), element);
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to get a random integer between two values
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function humanMouseMove(page, element) {
  const box = await element.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y, { steps: getRandomInt(5, 10) });
  await delay(getRandomInt(100, 500));
}
async function humanType(page, selector, text, taskNumber) {
  if (page.isClosed()) {
    console.log("Page is closed, doing nothing and continuing...");
    return;
  }
  try {
    const element = await page.waitForSelector(selector, { timeout: 10000 }); // Set a reasonable timeout

    await page.evaluate((el) => el.scrollIntoView(), element);

    await element.focus();

    await humanMouseMove(page, element);

    for (let char of text) {
      await page.keyboard.type(char, { delay: getRandomInt(100, 200) });
    }
    console.log(`${taskNumber} Typing into ${selector} done`);
  } catch (error) {
    if (page.isClosed()) {
      console.log("Page is closed, doing nothing and continuing...");
      return;
    }
    console.log(
      `${taskNumber} Failed to type into ${selector}, clearing input and retrying:`,
      error
    );

    const element = await page.$(selector);
    if (element) {
      await clearInput(page, element);
    }

    return humanType(page, selector, text, taskNumber);
  }
}

module.exports = { humanType };
