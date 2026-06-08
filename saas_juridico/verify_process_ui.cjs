const path = require("node:path");
const { chromium } = require("playwright");

const root = __dirname;
const url = "http://127.0.0.1:8765";

async function main() {
  let browser;
  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch {
      browser = await chromium.launch({ channel: "msedge", headless: true });
    }

    const page = await browser.newPage({ viewport: { width: 1400, height: 920 } });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.getByLabel("E-mail").fill("admin@lexflow.local");
    await page.getByLabel("Senha").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForSelector("text=Painel executivo", { timeout: 10000 });

    await page.goto(`${url}/#/cases`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Processos e casos", { timeout: 10000 });
    const hasCaseTable = (await page.locator(".cases-table tbody tr").count()) > 0;
    const casesScreenshot = path.join(root, "lexflow-processos-casos.png");
    await page.screenshot({ path: casesScreenshot, fullPage: false });

    const firstCaseLink = page.locator(".case-number-link").first();
    if ((await firstCaseLink.count()) > 0) {
      await firstCaseLink.click();
      await page.waitForSelector("text=Dados do processo", { timeout: 10000 });
    }
    const caseDetailScreenshot = path.join(root, "lexflow-controle-processo.png");
    await page.screenshot({ path: caseDetailScreenshot, fullPage: false });

    await page.goto(`${url}/#/attendances`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("text=Adicionar atendimento", { timeout: 10000 });
    const hasAttendanceTabs = (await page.getByText("Nova tarefa").count()) > 0 && (await page.getByText("Novo evento").count()) > 0;
    const attendanceScreenshot = path.join(root, "lexflow-atendimentos.png");
    await page.screenshot({ path: attendanceScreenshot, fullPage: false });

    const result = {
      hasCaseTable,
      hasAttendanceTabs,
      casesScreenshot,
      caseDetailScreenshot,
      attendanceScreenshot,
    };
    console.log(JSON.stringify(result, null, 2));
  } finally {
    if (browser) await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
