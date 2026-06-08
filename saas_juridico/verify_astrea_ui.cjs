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

    const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.getByLabel("E-mail").fill("admin@lexflow.local");
    await page.getByLabel("Senha").fill("admin123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForSelector("text=Painel executivo", { timeout: 10000 });

    await page.getByRole("button", { name: "Clientes" }).click();
    await page.waitForSelector("text=Contatos cadastrados", { timeout: 10000 });
    const hasClientsForm = (await page.locator("#clientAstreaForm").count()) > 0;
    await page.screenshot({ path: path.join(root, "lexflow-clientes-astrea.png"), fullPage: false });

    await page.getByRole("button", { name: "Agenda" }).click();
    await page.waitForSelector("text=Tarefas", { timeout: 10000 });
    await page.screenshot({ path: path.join(root, "lexflow-agenda-astrea.png"), fullPage: false });

    await page.getByRole("button", { name: "Adicionar tarefa" }).click();
    await page.waitForSelector("#taskModalV2.open");
    await page.screenshot({ path: path.join(root, "lexflow-agenda-tarefa-modal.png"), fullPage: false });
    await page.locator("#taskModalV2 .modal-header [data-close-modal-v2=\"taskModalV2\"]").click();

    await page.getByRole("button", { name: "Adicionar evento" }).click();
    await page.waitForSelector("#eventModalV2.open");
    await page.screenshot({ path: path.join(root, "lexflow-agenda-evento-modal.png"), fullPage: false });

    const result = {
      hasClientsForm,
      hasTaskButton: (await page.getByRole("button", { name: "Adicionar tarefa" }).count()) > 0,
      hasEventButton: (await page.getByRole("button", { name: "Adicionar evento" }).count()) > 0,
      clientsScreenshot: path.join(root, "lexflow-clientes-astrea.png"),
      agendaScreenshot: path.join(root, "lexflow-agenda-astrea.png"),
      taskModalScreenshot: path.join(root, "lexflow-agenda-tarefa-modal.png"),
      eventModalScreenshot: path.join(root, "lexflow-agenda-evento-modal.png"),
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
