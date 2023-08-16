module.exports = function handleGlobalPageErrors(page) {
  page.on("error", (err) => {
    console.log("Global Page error:", err);
    // Handle the error as needed
  });

  page.on("close", async () => {
    throw new Error("page is terminated");
  });
};
