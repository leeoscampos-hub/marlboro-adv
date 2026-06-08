const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const root = __dirname;
const python = "C:\\Users\\Leonardo\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const port = process.env.LEXFLOW_TEST_PORT || "8765";
const url = `http://127.0.0.1:${port}`;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      await delay(500);
    }
  }
  throw new Error("Servidor não respondeu em tempo hábil.");
}

async function main() {
  const server = spawn(python, ["server.py", "--host", "127.0.0.1", "--port", port], {
    cwd: root,
    windowsHide: true,
    stdio: "pipe",
  });

  let serverLog = "";
  server.stdout.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverLog += chunk.toString();
  });

  let browser;
  try {
    await waitForServer();
    try {
      browser = await chromium.launch({ headless: true });
    } catch {
      browser = await chromium.launch({ channel: "msedge", headless: true });
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.getByLabel("E-mail").fill("admin@lexflow.local");
    await page.getByLabel("Senha").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForSelector("text=Painel executivo", { timeout: 10000 });
    await page.screenshot({ path: path.join(root, "lexflow-dashboard.png"), fullPage: false });
    const checks = {
      title: await page.title(),
      hasDashboard: await page.getByText("Painel executivo").count() > 0,
      hasMetrics: await page.getByText("Clientes ativos").count() > 0,
      hasAgentsNav: await page.getByText("Agentes IA").count() > 0,
      screenshot: path.join(root, "lexflow-dashboard.png"),
    };
    console.log(JSON.stringify(checks, null, 2));
  } finally {
    if (browser) await browser.close();
    if (!server.killed) server.kill();
    await fs.writeFile(path.join(root, "verify_ui_server.log"), serverLog, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
