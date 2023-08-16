const randomTimeout = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;

function getRandomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime);
}

async function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
module.exports = {
  formatDate,
  getRandomDate,
};
