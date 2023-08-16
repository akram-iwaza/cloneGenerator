const chrome_launcher = require("chrome-launcher");
const fs = require("fs");
const { KasadaSolver } = require("./SolvingKasada/solver.js");
const { solveKasadaTask } = require("./SolvingKasada/solve_kasada_task.js");

const sessions = "sessions";
if (!fs.existsSync(sessions)) {
  fs.mkdirSync(sessions);
}
const solver = new KasadaSolver();
const taskKasada = new solveKasadaTask();
const getProxies = () => {
  const proxies = fs
    .readFileSync("proxies.txt", "utf8")
    .split("\n")
    .map((proxy) => proxy.trim());
  return proxies.filter((proxy) => proxy !== ""); // filter out any empty lines
};

async function solve_task(
  profile_name,
  emailAccount,
  passwordAccount,
  j,
  randomFirstName,
  randomLastName,
  taskNumber
) {
  let proxyIndex = 0;
  const proxies = getProxies();
  // console.log(proxies);
  let proxy;
  for (let run = 0; run <= j; run++) {
    const proxys = proxies[proxyIndex % proxies.length];
    proxyIndex++;
    console.log(proxys);
    proxy = proxys;
    console.log(`Run ${run}: Proxy for kasada page - ${proxys}`);
  }
  console.log("proxy in kasada page", proxy);
  const [username, password] = proxy.split(":");

  const parts = proxy.split(":");
  if (parts.length === 4) {
    const ipAddress = parts[2];
    const port = parts[3];
    const newProxy = `http://${ipAddress}:${port}`;
    console.log(`solve_task headless ${sessions}/${profile_name}`);

    let width = 1920;
    let height = 1080;

    const flags = [
      `--user-data-dir=${__dirname}/${sessions}/${profile_name}`,
      "--no-first-run",
      "--disable-blink-features=AutomationControlled",
      "--test-type",
      `--window-size=${width},${height}`,
      "--enable-features=ReduceUserAgent",
      `--proxy-server=${newProxy}`,
    ];

    console.log({ flags });

    let launched = await chrome_launcher.launch({
      chromeFlags: flags,
      ignoreDefaultFlags: true,
      userDataDir: false,
      ignoreHTTPSErrors: true,
    });

    console.log("launched chrome", launched);

    const browserURL = "http://127.0.0.1:" + launched.port;
    console.log({ browserURL });

    let wsUrl = await solver.getWsUrl(launched.port);
    console.log("Solving for task", profile_name, { width, height });
    console.log("wsUrl ===>" + wsUrl);
    await taskKasada.solve_kasada_task(
      wsUrl,
      username,
      password,
      emailAccount,
      passwordAccount,
      randomFirstName,
      randomLastName,
      taskNumber,
      profile_name
    );
  }
}

module.exports = {
  solve_task,
};
