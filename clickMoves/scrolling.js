function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function smoothScroll(page, percentage) {
  // Get the document height
  const documentHeight = await page.evaluate(() => document.body.scrollHeight);

  // Calculate the scrolling target (25% down)
  const targetHeight = (documentHeight * percentage) / 100;

  // Smoothly scroll to the target height
  for (let i = 0; i <= targetHeight; i += 10) {
    await page.evaluate((y) => {
      window.scrollTo(0, y);
    }, i);
    await delay(15); // Add a slight delay for smooth scrolling
  }

  // Add a delay at the target scroll position, for example, to mimic reading
  await delay(1000);

  // Smoothly scroll back to the top
  for (let i = targetHeight; i >= 0; i -= 10) {
    await page.evaluate((y) => {
      window.scrollTo(0, y);
    }, i);
    await delay(15); // Add a slight delay for smooth scrolling
  }

  console.log("Smooth scrolling done");
}
module.exports = { smoothScroll };

// Usage example:
// await smoothScroll(page, 25);
