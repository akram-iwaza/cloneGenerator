const fs = require("fs");
const { Parser } = require("json2csv");

// Load JSON data from a file
const jsonData = require("./profiles.json"); // Replace with your JSON file's path

// Define the fields you want to include in the CSV
fs.readFile("profiles.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const jsonData = JSON.parse(data);

  // Convert the JSON object to an array of its values
  const dataArray = Object.values(jsonData);

  // Define the fields you want to include in the CSV
  const fields = Object.keys(dataArray[0]);

  // Create a CSV parser instance with the specified fields
  const json2csvParser = new Parser({ fields });
  const csvData = json2csvParser.parse(dataArray);
  // Convert the array to CSV format
  // Write the CSV data to a file
  fs.writeFileSync("output.csv", csvData);
});
