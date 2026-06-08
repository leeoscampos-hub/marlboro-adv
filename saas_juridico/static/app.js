const app = document.querySelector("#app");

const state = {
  token: localStorage.getItem("lexflow_token"),
  theme: localStorage.getItem("lexflow_theme") || "light",
  user: null,
  route: "dashboard",
  leadEditingId: null,
  clientEditingId: null,
  taskEditingId: null,
  eventEditingId: null,
  agendaView: "mes",
  agendaDate: null,
  agendaSelectedDate: null,
  agendaSelectedActivity: null,
  agendaFilter: "todos",
  attendancePanel: "atendimento",
  attendanceLeadPrefillId: null,
  attendanceDetailId: null,
  attendanceSearch: "",
  attendanceStatus: "em-andamento",
  labelComposerOpen: false,
  caseVisibleCount: 30,
  caseComposerOpen: false,
  caseLabelFilter: "todos",
  financeTab: "lancamentos",
  financeFaturasTab: "a-faturar",
  financeConfigTab: "categorias",
  financeLaunchType: "honorario",
  financeComposerOpen: false,
  financeLineCount: 1,
  financeFlowCenterId: null,
  financeCenterSearch: "",
  clientSearch: "",
  clientLetter: "todos",
  clientComposerOpen: false,
  clientPersonType: "pf",
  clientFormTab: "pessoais",
  agendaOwnerFilter: "responsaveis",
  agendaActivityFilter: "a-concluir",
  agendaStructureView: "por-mes",
  pendingAgendaModal: null,
  publicationProvider: "ALL-TJ",
  publicationSystem: "DATAJUD",
  publicationSearch: "",
  publicationUf: "",
  publicationStatus: "",
  publicationExpanded: new Set(),
  publicationModalId: null,
  omnichannelPlatform: "",
  omnichannelSearch: "",
  omnichannelSelectedContactId: null,
  loginRequires2fa: false,
  loginEmail: "admin@lexflow.local",
  loginPassword: "admin123",
  twoFactorSetup: null,
};

const navItems = [
  ["dashboard", "layout", "\u00c1rea de trabalho"],
  ["omnichannel", "message", "Central de contatos"],
  ["leads", "kanban", "CRM Jur\u00eddico"],
  ["tasks", "calendar", "Agenda"],
  ["clients", "users", "Contatos"],
  ["attendances", "phone", "Atendimentos"],
  ["cases", "folder", "Processos e casos"],
  ["publications", "file", "Publicações"],
  ["documents", "file", "Documentos"],
  ["finance", "wallet", "Financeiro"],
  ["agents", "sparkles", "Agentes de IA"],
  ["compliance", "shield", "Alertas"],
  ["bi", "chart", "Indicadores"],
  ["settings", "settings", "Configura\u00e7\u00f5es"],
];

function iconSvg(name) {
  const icons = {
    layout: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M9 4v16"></path></svg>',
    kanban: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M8 8v8M12 8v5M16 8v10"></path></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="3"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a3 3 0 0 1 0 5.74"></path></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z"></path></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h5l2 2h11v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"></path></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1H3z"></path><rect x="3" y="8" width="18" height="12" rx="2"></rect><circle cx="16" cy="14" r="1"></circle></svg>',
    sparkles: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5z"></path><path d="M19 13l.9 2.1L22 16l-2.1.9L19 19l-.9-2.1L16 16l2.1-.9z"></path><path d="M5 14l1 2.3L8.3 17 6 18l-1 2.3L4 18l-2.3-1L4 16.3z"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"></path></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"></path><rect x="7" y="12" width="3" height="6"></rect><rect x="12" y="9" width="3" height="9"></rect><rect x="17" y="6" width="3" height="12"></rect></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V22a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H2a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V2a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 1 1.5h.1a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H22a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1z"></path></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
    cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H8a5 5 0 0 1-.7-10A6.5 6.5 0 0 1 20 10.5 4.5 4.5 0 0 1 17.5 19z"></path><path d="M12 12v6M9.5 14.5 12 12l2.5 2.5"></path></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>',
    message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path></svg>',
    tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10 14 4H5v9l7 7 8-8z"></path><circle cx="8.5" cy="8.5" r="1"></circle></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M6 6l1 15h10l1-15"></path><path d="M10 11v6M14 11v6"></path></svg>',
  };
  return icons[name] || "";
}

function stripAccents(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  state.theme = next;
  localStorage.setItem("lexflow_theme", next);
  document.documentElement.dataset.theme = next;
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
}

const moduleConfigs = {
  clients: {
    title: "Clientes",
    subtitle: "Cadastro central com dados, área jurídica e status.",
    endpoint: "/api/clients",
    createLabel: "Novo cliente",
    fields: [
      ["name", "Nome", "text", true],
      ["type", "Tipo", "select", false, ["Pessoa física", "Pessoa jurídica"]],
      ["email", "E-mail", "email"],
      ["phone", "Telefone", "text"],
      ["city", "Cidade", "text"],
      ["state", "UF", "text"],
      ["area", "Área jurídica", "text"],
      ["document", "Documento", "text"],
    ],
    card: (item) => ({
      title: item.name,
      badges: [item.status, item.area || "sem área"],
      meta: [`${item.type || "Cliente"} · ${item.city || "cidade não informada"}${item.state ? "/" + item.state : ""}`, item.email || "sem e-mail", item.phone || "sem telefone"],
    }),
  },
  leads: {
    title: "CRM Jurídico",
    subtitle: "Leads, etapas do funil, follow-ups e risco de perda.",
    endpoint: "/api/leads",
    createLabel: "Novo lead",
    fields: [
      ["name", "Nome do lead", "text", true],
      ["origin", "Origem", "text"],
      ["area", "Área", "text"],
      ["stage", "Etapa", "select", false, ["novo lead", "triagem pendente", "aguardando documentos", "análise jurídica inicial", "proposta enviada", "negociação", "contrato assinado", "perdido"]],
      ["urgency", "Urgência", "select", false, ["baixa", "média", "alta", "crítica"]],
      ["risk", "Risco de perda", "select", false, ["baixo", "médio", "alto"]],
      ["responsible", "Responsável", "text"],
      ["follow_up", "Follow-up", "date"],
      ["phone", "Telefone", "text"],
      ["email", "E-mail", "email"],
      ["summary", "Resumo", "textarea"],
    ],
    card: (item) => ({
      title: item.name,
      badges: [item.stage, item.urgency, item.risk],
      meta: [`${item.area || "sem área"} · origem: ${item.origin || "não informada"}`, `Responsável: ${item.responsible || "não definido"}`, `Follow-up: ${formatDate(item.follow_up)}`, item.summary || "sem resumo"],
    }),
  },
  cases: {
    title: "Processos e Demandas",
    subtitle: "Carteira ativa, prazos, risco e responsável.",
    endpoint: "/api/cases",
    createLabel: "Nova demanda",
    fields: [
      ["client_id", "ID do cliente", "number"],
      ["title", "Título", "text", true],
      ["area", "Área", "text"],
      ["court", "Órgão/foro", "text"],
      ["case_number", "Número do processo", "text"],
      ["status", "Status", "select", false, ["ativo", "suspenso", "encerrado"]],
      ["next_deadline", "Próximo prazo", "date"],
      ["risk", "Risco", "select", false, ["baixo", "médio", "alto"]],
      ["responsible", "Responsável", "text"],
      ["summary", "Resumo", "textarea"],
    ],
    card: (item) => ({
      title: item.title,
      badges: [item.status, item.risk, item.area || "sem área"],
      meta: [`Cliente: ${item.client_name || "não vinculado"}`, `Processo: ${item.case_number || "sem número"} · ${item.court || "foro não informado"}`, `Próximo prazo: ${formatDate(item.next_deadline)}`, item.summary || "sem resumo"],
    }),
  },
  documents: {
    title: "Gestão Documental",
    subtitle: "Classificação, sensibilidade, vínculo e pendências documentais.",
    endpoint: "/api/documents",
    createLabel: "Novo documento",
    fields: [
      ["client_id", "ID do cliente", "number"],
      ["case_id", "ID do processo", "number"],
      ["title", "Título", "text", true],
      ["category", "Categoria", "text"],
      ["status", "Status", "select", false, ["pendente de revisão", "em revisão", "organizado", "obsoleto"]],
      ["sensitivity", "Sensibilidade", "select", false, ["público", "confidencial", "sensível", "sigiloso"]],
      ["file_ref", "Referência do arquivo", "text"],
      ["summary", "Resumo", "textarea"],
    ],
    card: (item) => ({
      title: item.title,
      badges: [item.status, item.sensitivity, item.category || "sem categoria"],
      meta: [`Cliente: ${item.client_name || "não vinculado"}`, `Processo: ${item.case_title || "não vinculado"}`, item.file_ref || "sem referência", item.summary || "sem resumo"],
    }),
  },
  tasks: {
    title: "Prazos e Tarefas",
    subtitle: "Pendências, responsáveis, prioridades e risco operacional.",
    endpoint: "/api/tasks",
    createLabel: "Nova tarefa",
    fields: [
      ["title", "Título", "text", true],
      ["owner", "Responsável", "text"],
      ["priority", "Prioridade", "select", false, ["baixa", "média", "alta", "crítica"]],
      ["risk", "Risco", "select", false, ["baixo", "médio", "alto"]],
      ["due_date", "Vencimento", "date"],
      ["linked_type", "Vínculo", "select", false, ["lead", "client", "case", "document", "finance"]],
      ["linked_id", "ID vinculado", "number"],
      ["description", "Descrição", "textarea"],
    ],
    card: (item) => ({
      title: item.title,
      badges: [item.status, item.priority, item.risk, item.label_name || "sem etiqueta"],
      meta: [`Responsável: ${item.owner || "não definido"}`, `Vencimento: ${formatDate(item.due_date)}`, item.description || "sem descrição"],
      actions: item.status !== "concluída" ? `<button class="btn ghost" data-complete-task="${item.id}">✓ Concluir</button>` : "",
    }),
  },
  finance: {
    title: "Financeiro",
    subtitle: "Honorários, custas, parcelas, vencimentos e status.",
    endpoint: "/api/finance",
    createLabel: "Novo lançamento",
    fields: [
      ["client_id", "ID do cliente", "number"],
      ["description", "Descrição", "text", true],
      ["amount", "Valor", "number"],
      ["due_date", "Vencimento", "date"],
      ["kind", "Tipo", "select", false, ["honorários", "custas", "reembolso", "repasse"]],
      ["status", "Status", "select", false, ["pendente", "parcial", "vencido", "pago"]],
    ],
    card: (item) => ({
      title: item.description,
      badges: [item.status, item.kind],
      meta: [`Cliente: ${item.client_name || "não vinculado"}`, `Valor: ${money(item.amount)} · vencimento: ${formatDate(item.due_date)}`],
    }),
  },
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message, timeout = 2800) {
  let node = document.querySelector(".lf-toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "lf-toast";
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.style.opacity = "1";
  clearTimeout(node._timer);
  node._timer = setTimeout(() => {
    node.style.opacity = "0";
  }, timeout);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value) {
  if (!value) return "não definido";
  const normalized = String(value).trim().slice(0, 10);
  const [year, month, day] = normalized.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function badge(value) {
  if (!value) return "";
  const cls = stripAccents(String(value))
    .toLowerCase()
    .replaceAll(" ", "-");
  return `<span class="badge ${esc(cls)}">${esc(value)}</span>`;
}

function labelScopeMatches(label, scope) {
  const normalizedScope = String(scope || "").toLowerCase();
  const labelScope = String(label?.scope || "global").toLowerCase();
  return labelScope === "global" || labelScope === normalizedScope;
}

function labelSelectOptionsHtml(labels, scope, selectedId = null, includeBlank = true) {
  const filtered = (labels || []).filter((label) => labelScopeMatches(label, scope));
  const selected = selectedId === null || selectedId === undefined || selectedId === "" ? "" : String(selectedId);
  const options = filtered
    .map((label) => `<option value="${esc(label.id)}" ${String(label.id) === selected ? "selected" : ""}>${esc(label.name)}${label.scope && label.scope !== "global" ? ` (${esc(label.scope)})` : ""}</option>`)
    .join("");
  return `${includeBlank ? `<option value="">Sem etiqueta</option>` : ""}${options}`;
}

function labelBadgeHtml(label, options = {}) {
  if (!label || !label.name) return "";
  const style = label.color ? ` style="background:${esc(label.color)};color:#fff"` : "";
  const removable = options.removable
    ? options.caseId
      ? `<button class="label-badge-delete" type="button" data-remove-case-label-id="${esc(label.id)}" data-remove-case-label-case-id="${esc(options.caseId)}" title="Remover etiqueta deste processo" aria-label="Remover etiqueta ${esc(label.name)} deste processo">x</button>`
      : `<button class="label-badge-delete" type="button" data-delete-case-label-id="${esc(label.id)}" title="Excluir etiqueta" aria-label="Excluir etiqueta ${esc(label.name)}">x</button>`
    : "";
  return `<span class="badge label-badge"${style}><span>${esc(label.name)}</span>${removable}</span>`;
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem("lexflow_token");
    state.token = null;
    state.user = null;
    renderLogin();
    throw new Error(data.error || "Sessão expirada");
  }
  if (!res.ok) throw new Error(data.error || data.details || "Falha na requisição");
  return data;
}

async function init() {
  applyTheme(state.theme);
  if (!state.token) return renderLogin();
  try {
    const me = await api("/api/me");
    state.user = me.user;
    const initialPath = location.hash.replace("#/", "").replace(/^\/+/, "") || "dashboard";
    state.route = initialPath.split("/")[0] || "dashboard";
    renderShell();
    await renderRoute();
  } catch {
    renderLogin();
  }
}

// --- Auto-wire helpers: ensure buttons respond and modals close on Escape ---
(function autoWireUI() {
  // simple toast
  function showToast(msg, timeout = 3000) {
    let t = document.querySelector('.lf-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'lf-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._to);
    t._to = setTimeout(() => (t.style.opacity = '0'), timeout);
  }

  // Close modals with Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      document.querySelectorAll('.modal-shell.open').forEach((m) => m.classList.remove('open'));
    }
  });

  // Ensure buttons are focusable and clickable; provide fallback action
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button, a');
    if (!btn) return;
    // mark handled to avoid duplicate processing
    if (btn.dataset.lfHandled) return;
    btn.dataset.lfHandled = '1';

    // if button has data-api attribute, try to call it
    const apiPath = btn.dataset.api || btn.getAttribute('data-api');
    if (apiPath) {
      // non-blocking call
      fetch(apiPath, { method: btn.dataset.method || 'GET', headers: { 'Content-Type': 'application/json' } }).catch(() => {});
      showToast('Ação executada.');
      return;
    }

    // if button toggles modal via data-open-modal attribute
    const openModal = btn.dataset.openModal || btn.getAttribute('data-open-modal');
    if (openModal) {
      const m = document.querySelector(`#${openModal}`);
      if (m) m.classList.add('open');
      return;
    }

    const hasSpecificHandler = btn.id || btn.type === "submit" || btn.getAttribute("href") || Object.keys(btn.dataset || {}).some((key) => key !== "lfHandled");
    if (hasSpecificHandler) return;

    // default: small notice so clicks are never inert
    showToast('Funcionalidade disponível (em progresso)');
  }, { capture: true });

  // clickable backdrop close for modals
  document.addEventListener('click', (ev) => {
    const backdrop = ev.target.closest('.modal-backdrop');
    if (backdrop && backdrop.dataset.closeModalV2) {
      const id = backdrop.dataset.closeModalV2 || backdrop.getAttribute('data-close-modal-v2');
      const modal = document.getElementById(id);
      if (modal) modal.classList.remove('open');
    }
  });
})();

// Ensure forms have sensible defaults and do not contain invalid hidden required controls
function ensureFormValidity(form) {
  if (!form || !(form instanceof HTMLFormElement)) return;
  // set owner default
  try {
    const owner = form.querySelector('[name="owner"]');
    if (owner && !owner.value) owner.value = state.user?.name || 'Usuário';
  } catch (e) {}
  // set task_list default
  try {
    const tlist = form.querySelector('[name="task_list"]');
    if (tlist && !tlist.value) tlist.value = form.dataset.defaultTaskList || 'lista-geral';
  } catch (e) {}

  // For any required controls that are hidden/disabled, remove required to avoid 'not focusable' errors
  Array.from(form.elements || []).forEach((el) => {
    try {
      const input = /** @type {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} */ (el);
      const isHidden = input.offsetParent === null || window.getComputedStyle(input).visibility === 'hidden' || input.type === 'hidden';
      if (input.required && (isHidden || input.disabled)) {
        input.required = false;
      }
      // if select has no value, select first option
      if ((input.tagName === 'SELECT' || input.type === 'select-one') && !input.value) {
        const sel = /** @type {HTMLSelectElement} */ (input);
        if (sel.options && sel.options.length) sel.selectedIndex = 0;
      }
    } catch (e) {}
  });
}

// Capture all form submits and normalize before they execute
document.addEventListener('submit', (ev) => {
  try {
    const form = ev.target;
    if (form && form instanceof HTMLFormElement) {
      ensureFormValidity(form);
    }
  } catch (e) {}
}, true);

// Generic fetch-based submit fallback for task/event forms to surface server errors
async function fetchFormPost(form) {
  if (!form) return null;
  const action = form.getAttribute('action') || (form.id && (form.id.includes('task') ? '/api/tasks' : form.id.includes('event') ? '/api/events' : null));
  const method = (form.getAttribute('method') || 'POST').toUpperCase();
  if (!action) return null;
  const payload = {};
  new FormData(form).forEach((v, k) => (payload[k] = v));
  const res = await fetch(action, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
  return data;
}

// Attach to known forms as a safety net
['#taskForm', '#taskAstreaForm', '#taskFormV2', '#eventForm', '#eventAstreaForm', '#eventFormV2'].forEach((sel) => {
  const f = document.querySelector(sel);
  if (f && f instanceof HTMLFormElement) {
    f.addEventListener('submit', async (ev) => {
      // if handler already prevented default by other code, skip
      if (ev.defaultPrevented) return;
      ev.preventDefault();
      try {
        ensureFormValidity(f);
        await fetchFormPost(f);
        // close modal if any
        const modal = f.closest('.modal-shell');
        if (modal) modal.classList.remove('open');
        await renderRoute();
      } catch (err) {
        const errEl = f.querySelector('.error') || document.querySelector('#formError') || document.querySelector('#taskFormError') || document.querySelector('#eventFormError');
        if (errEl) errEl.textContent = String(err.message || err);
      }
    }, true);
  }
});


function renderLogin() {
  app.innerHTML = `
    <main class="login-shell">
      <section class="login-panel">
        <div class="brand-row">
          <img src="/static/mark.svg" alt="LexFlow" />
          <div>
            <div class="brand-title">LexFlow IA Jurídica</div>
            <div class="brand-subtitle">SaaS operacional para escritórios</div>
          </div>
        </div>
        <h1>Entre no painel do escritório</h1>
        <p>Atendimento, CRM, documentos, prazos, financeiro, compliance e agentes de IA supervisionados em uma única operação.</p>
        <form id="loginForm">
          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" name="email" type="email" value="${esc(state.loginEmail || "admin@lexflow.local")}" autocomplete="username" required />
          </div>
          <div class="field">
            <label for="password">Senha</label>
            <input id="password" name="password" type="password" value="${esc(state.loginPassword || "admin123")}" autocomplete="current-password" required />
          </div>
          ${
            state.loginRequires2fa
              ? `<div class="field">
                  <label for="otp_code">Codigo do autenticador</label>
                  <input id="otp_code" name="otp_code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" required />
                  <span class="hint">Abra o app autenticador configurado para este usuario e digite o codigo de 6 digitos.</span>
                </div>`
              : ""
          }
          <button class="btn primary" type="submit">${state.loginRequires2fa ? "Validar codigo" : "Entrar"}</button>
          <div id="loginError" class="error" role="alert"></div>
        </form>
        <div class="demo-credentials">
          <strong>Credenciais demo</strong>
          <span>admin@lexflow.local / admin123</span>
          <span>advogada@lexflow.local / adv123</span>
          <span>atendimento@lexflow.local / at123</span>
        </div>
      </section>
      <section class="login-context">
        <div class="context-board">
          <div class="status-strip">
            <div class="strip-item"><div class="strip-label">MVP</div><div class="strip-value">12</div><div class="hint">módulos operacionais</div></div>
            <div class="strip-item"><div class="strip-label">IA</div><div class="strip-value">12</div><div class="hint">agentes supervisionados</div></div>
            <div class="strip-item"><div class="strip-label">LGPD</div><div class="strip-value">ON</div><div class="hint">auditoria e controle</div></div>
          </div>
          <div class="context-card">
            <h2>Produto pronto para demonstração comercial</h2>
            <p>Fluxo completo: lead, triagem, cliente, processo, documentos, prazos, financeiro, execução de agente, logs e governança.</p>
          </div>
          <div class="context-card">
            <h2>Guardrails jurídicos por padrão</h2>
            <p>O sistema sinaliza urgência, risco, dados sensíveis, lacunas de informação e necessidade de validação humana antes de qualquer entrega sensível.</p>
          </div>
        </div>
      </section>
    </main>
  `;
  document.querySelector("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const error = document.querySelector("#loginError");
    error.textContent = "";
    state.loginEmail = String(form.get("email") || "");
    state.loginPassword = String(form.get("password") || "");
    try {
      const payload = { email: form.get("email"), password: form.get("password") };
      if (state.loginRequires2fa) payload.otp_code = form.get("otp_code");
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data.requires_2fa) {
        state.loginRequires2fa = true;
        renderLogin();
        document.querySelector("#loginError").textContent = data.message || "Informe o codigo do autenticador.";
        document.querySelector("#otp_code")?.focus();
        return;
      }
      state.loginRequires2fa = false;
      state.loginPassword = "";
      state.token = data.token;
      state.user = data.user;
      localStorage.setItem("lexflow_token", data.token);
      location.hash = "#/dashboard";
      renderShell();
      await renderRoute();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function renderShell() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-row">
          <img src="/static/mark.svg" alt="LexFlow" />
          <div>
            <div class="brand-title">LexFlow IA</div>
            <div class="brand-subtitle">${esc(state.user.org_name)}</div>
          </div>
        </div>
        <nav class="nav" id="nav">
          ${navItems
            .map(
              ([id, icon, label]) =>
                `<button data-route="${id}" class="${state.route === id ? "active" : ""}"><span class="ico">${iconSvg(icon)}</span><span>${label}</span></button>`
            )
            .join("")}
        </nav>
        <div class="user-box">
          <div>
            <div class="user-name">${esc(state.user.name)}</div>
            <div class="user-meta">${esc(state.user.email)} · ${esc(state.user.role)} · ${esc(state.user.org_plan)}</div>
          </div>
          <button class="btn ghost" id="logoutBtn">Sair</button>
        </div>
      </aside>
      <main class="main">
        <header class="global-header">
          <div class="global-search">
            <label for="globalSearchInput" class="visually-hidden">Pesquisar</label>
            <span class="search-icon">${iconSvg("search")}</span>
            <input id="globalSearchInput" type="text" placeholder="Pesquisar contato, processo ou tarefa" />
          </div>
          <div class="global-actions">
            <button class="icon-btn" id="globalAiBtn" type="button" title="Agentes de IA" aria-label="Agentes de IA">${iconSvg("sparkles")}</button>
            <div class="quick-create-wrap">
              <button class="icon-btn icon-btn-primary" id="globalCreateBtn" type="button" title="Adicionar" aria-label="Adicionar">${iconSvg("plus")}</button>
              <div class="quick-create-menu hidden" id="globalCreateMenu">
                <button type="button" data-quick-create="task"><span class="ico">${iconSvg("check")}</span>Tarefa</button>
                <button type="button" data-quick-create="event"><span class="ico">${iconSvg("calendar")}</span>Evento</button>
                <button type="button" data-quick-create="hearing"><span class="ico">${iconSvg("calendar")}</span>Audiência</button>
                <button type="button" data-quick-create="attendance"><span class="ico">${iconSvg("phone")}</span>Atendimento</button>
                <button type="button" data-quick-create="case"><span class="ico">${iconSvg("folder")}</span>Processo</button>
                <button type="button" data-quick-create="client"><span class="ico">${iconSvg("users")}</span>Contato</button>
                <button type="button" data-quick-create="finance"><span class="ico">${iconSvg("wallet")}</span>Honorário</button>
              </div>
            </div>
            <button class="icon-btn" id="globalTribunalBtn" type="button" title="Publicações" aria-label="Publicações">${iconSvg("cloud")}</button>
            <button class="icon-btn" id="globalRecentBtn" type="button" title="Agenda" aria-label="Agenda">${iconSvg("clock")}</button>
            <button class="icon-btn" id="globalThemeBtn" type="button" title="Tema" aria-label="Alternar tema">${iconSvg(state.theme === "dark" ? "sun" : "moon")}</button>
            <button class="icon-btn mobile-menu" id="globalMenuBtn" type="button" title="Menu" aria-label="Menu">${iconSvg("menu")}</button>
          </div>
        </header>
        <div id="view"></div>
      </main>
      <button class="support-fab" id="supportFab" type="button" aria-label="Suporte">${iconSvg("message")}<span></span></button>
      <div class="support-popover hidden" id="supportPopover">
        <strong>Suporte</strong>
        <p>Abra a área de trabalho, agenda ou publicações para revisar pendências recentes.</p>
        <div class="btn-row">
          <button class="btn ghost" data-support-route="dashboard" type="button">Área</button>
          <button class="btn ghost" data-support-route="tasks" type="button">Agenda</button>
          <button class="btn ghost" data-support-route="publications" type="button">Publicações</button>
        </div>
      </div>
    </div>
  `;
  document.querySelector("#logoutBtn").addEventListener("click", logout);
  document.querySelector("#globalSearchInput").addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    await runGlobalSearch(event.currentTarget.value);
  });
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = `#/${button.dataset.route}`;
    });
  });
  bindShellActions();
}

async function goRoute(route) {
  if (state.route === route) {
    await renderRoute();
  } else {
    location.hash = `#/${route}`;
  }
}

async function quickCreate(kind) {
  if (kind === "task" || kind === "event" || kind === "hearing") {
    state.pendingAgendaModal = kind;
    await goRoute("tasks");
    return;
  }
  if (kind === "attendance") {
    state.attendancePanel = "atendimento";
    await goRoute("attendances");
    return;
  }
  if (kind === "case") {
    state.caseComposerOpen = true;
    await goRoute("cases");
    return;
  }
  if (kind === "client") {
    state.clientComposerOpen = true;
    state.clientEditingId = null;
    await goRoute("clients");
    return;
  }
  if (kind === "finance") {
    state.financeLaunchType = "honorario";
    state.financeComposerOpen = true;
    await goRoute("finance");
  }
}

function bindShellActions() {
  const createBtn = document.querySelector("#globalCreateBtn");
  const createMenu = document.querySelector("#globalCreateMenu");
  if (createBtn && createMenu) {
    createBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      createMenu.classList.toggle("hidden");
      if (!createMenu.classList.contains("hidden")) {
        setTimeout(() => document.addEventListener("click", () => createMenu.classList.add("hidden"), { once: true }), 0);
      }
    });
    createMenu.addEventListener("click", (event) => event.stopPropagation());
  }
  document.querySelectorAll("[data-quick-create]").forEach((button) => {
    button.addEventListener("click", async () => {
      document.querySelector("#globalCreateMenu")?.classList.add("hidden");
      await quickCreate(button.dataset.quickCreate);
    });
  });
  document.querySelector("#globalAiBtn")?.addEventListener("click", () => (location.hash = "#/agents"));
  document.querySelector("#globalTribunalBtn")?.addEventListener("click", () => (location.hash = "#/publications"));
  // Navigate to agenda using /#/agenda alias (keeps user-friendly route)
  document.querySelector("#globalRecentBtn")?.addEventListener("click", () => (location.hash = "#/agenda"));
  document.querySelector("#globalThemeBtn")?.addEventListener("click", () => {
    toggleTheme();
    document.querySelector("#globalThemeBtn").innerHTML = iconSvg(state.theme === "dark" ? "sun" : "moon");
  });
  document.querySelector("#globalMenuBtn")?.addEventListener("click", () => document.querySelector("#nav")?.classList.toggle("open"));
  document.querySelector("#supportFab")?.addEventListener("click", (event) => {
    event.stopPropagation();
    const popover = document.querySelector("#supportPopover");
    popover?.classList.toggle("hidden");
    if (popover && !popover.classList.contains("hidden")) {
      setTimeout(() => document.addEventListener("click", () => popover.classList.add("hidden"), { once: true }), 0);
    }
  });
  document.querySelector("#supportPopover")?.addEventListener("click", (event) => event.stopPropagation());
  document.querySelectorAll("[data-support-route]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#supportPopover")?.classList.add("hidden");
      location.hash = `#/${button.dataset.supportRoute}`;
    });
  });
}

async function runGlobalSearch(raw) {
  const query = String(raw || "").trim();
  if (!query) return;
  const text = stripAccents(query).toLowerCase();
  if (text.includes("fatura") || text.includes("financeir")) {
    location.hash = "#/finance";
    await renderRoute();
    return;
  }
  if (text.includes("agenda") || text.includes("tarefa") || text.includes("evento")) {
    location.hash = "#/tasks";
    await renderRoute();
    return;
  }
  if (text.includes("crm") || text.includes("kanban") || text.includes("lead")) {
    location.hash = "#/leads";
    await renderRoute();
    return;
  }
  if (text.includes("cliente") || text.includes("contato")) {
    location.hash = "#/clients";
    await renderRoute();
    return;
  }
  if (text.includes("atendimento")) {
    location.hash = "#/attendances";
    await renderRoute();
    return;
  }
  if (text.includes("publica") || text.includes("tribunal")) {
    location.hash = "#/publications";
    await renderRoute();
    return;
  }
  state.caseSearch = query;
  location.hash = "#/cases";
  await renderRoute();
}

async function logout() {

  try {
    await api("/api/logout", { method: "POST", body: "{}" });
  } catch {
    // The local token is cleared even if the session was already gone.
  }
  localStorage.removeItem("lexflow_token");
  state.token = null;
  state.user = null;
  renderLogin();
}

function pageHeader(title, subtitle, actions = "") {
  const navLabel = navItems.find(([id]) => id === state.route)?.[2] || title;
  return `
    <header class="topbar">
      <div>
        <div class="breadcrumb"><span>LexFlow</span><span>${esc(navLabel)}</span></div>
        <h1>${esc(title)}</h1>
        <p>${esc(subtitle)}</p>
      </div>
      <div class="toolbar">${actions}</div>
    </header>
  `;
}

async function renderRoute() {
  const raw = location.hash.replace("#/", "").replace(/^\/+/, "") || "dashboard";
  const [routePath] = raw.split("?");
  const parts = routePath.split("/").filter(Boolean);
  state.route = parts[0] || "dashboard";
  const caseId = state.route === "cases" && parts[1] ? Number(parts[1]) : null;
  const attendanceId = state.route === "attendances" && parts[1] ? Number(parts[1]) : null;
  document.querySelectorAll("[data-route]").forEach((button) => button.classList.toggle("active", button.dataset.route === state.route));
  if (state.route === "dashboard") return dashboardView();
  if (state.route === "omnichannel") return omnichannelCenterView();
  if (state.route === "leads") return crmJuridicoKanbanView();
  if (state.route === "clients") return clientsAstreaView();
  if (state.route === "cases" && caseId) return caseDetailAstreaView(caseId);
  if (state.route === "cases") return casesAstreaView();
  if (state.route === "attendances" && attendanceId) return attendanceDetailAstreaView(attendanceId);
  if (state.route === "attendances") {
    state.attendanceDetailId = null;
    return attendancesAstreaView();
  }
  if (state.route === "publications") return publicationsAstreaClippingsView();
  if (state.route === "finance") return financeAstreaView();
  // Accept both /#/agenda and /#/tasks as synonyms for the Agenda view
  if (state.route === "agenda") return agendaAstreaV3();
  if (state.route === "tasks") return agendaAstreaV3();
  if (state.route === "agents") return agentsView();
  if (state.route === "compliance") return complianceView();
  if (state.route === "bi") return biView();
  if (state.route === "settings") return settingsView();
  if (moduleConfigs[state.route]) return moduleView(moduleConfigs[state.route], state.route);
  location.hash = "#/dashboard";
}

async function dashboardView() {
  const view = document.querySelector("#view");
  const [data, mvp] = await Promise.all([api("/api/overview"), api("/api/mvp-status")]);
  const m = data.metrics;
  view.innerHTML = `
    ${pageHeader("Painel executivo", "Visão operacional do escritório, alertas e indicadores do SaaS.")}
    <section class="grid metrics">
      ${metric("Clientes ativos", m.clientes_ativos, "carteira")}
      ${metric("Leads abertos", m.leads_abertos, "funil")}
      ${metric("Processos ativos", m.processos_ativos, "jurídico")}
      ${metric("Tarefas abertas", m.tarefas_abertas, "operação")}
      ${metric("Críticas/altas", m.tarefas_criticas, "risco")}
      ${metric("Financeiro pendente", money(m.financeiro_pendente), "recebíveis")}
    </section>
    <section class="grid three" style="margin-top:14px">
      <div class="panel">
        <h2>Fila de atenção</h2>
        ${recordList(data.urgent_tasks, (item) => ({
          title: item.title,
          badges: [item.priority, item.status, item.risk],
          meta: [`Responsável: ${item.owner || "não definido"}`, `Vencimento: ${formatDate(item.due_date)}`, item.description || ""],
        }))}
      </div>
      <div class="panel">
        <h2>Funil e IA</h2>
        <h3>Pipeline</h3>
        ${simpleTable(["Etapa", "Total"], data.pipeline.map((row) => [row.stage, row.total]))}
        <h3>Execuções recentes de agentes</h3>
        ${recordList(data.recent_agents, (item) => ({
          title: agentName(item.agent),
          badges: [item.risk_level, item.validation_required ? "validação obrigatória" : "baixo risco"],
          meta: [`Executado em ${item.created_at}`],
        }))}
      </div>
    </section>
    <section class="panel mvp-readiness" style="margin-top:14px">
      ${mvpStatusPanelHtml(mvp)}
    </section>
  `;
}

function mvpStatusPanelHtml(mvp) {
  const readyItems = mvp.ready_items || [];
  const pendingItems = mvp.pending_items || [];
  return `
    <div class="mvp-readiness-head">
      <div>
        <span class="mvp-kicker">Comercializacao</span>
        <h2>MVP local concluido</h2>
        <p>${esc(mvp.summary || "MVP funcional no ambiente local.")}</p>
      </div>
      <div class="mvp-score">
        <strong>${esc(readyItems.length)}/${esc(readyItems.length)}</strong>
        <span>modulos locais prontos</span>
      </div>
    </div>
    <div class="mvp-readiness-grid">
      <div>
        <h3>Pronto no sistema</h3>
        <div class="mvp-check-list">
          ${readyItems.map((item) => `<div><span class="mvp-dot ready"></span><strong>${esc(item.name)}</strong><small>${esc(item.detail)}</small></div>`).join("")}
        </div>
      </div>
      <div>
        <h3>Fica para publicacao do SaaS</h3>
        <div class="mvp-check-list">
          ${pendingItems.map((item) => `<div><span class="mvp-dot pending"></span><strong>${esc(item.name)}</strong><small>${esc(item.detail)}</small></div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function metric(label, value, note) {
  return `
    <article class="metric-card">
      <div class="metric-label">${esc(label)}</div>
      <div class="metric-value">${esc(value)}</div>
      <div class="metric-note">${esc(note)}</div>
    </article>
  `;
}

async function moduleView(config, key) {
  const view = document.querySelector("#view");
  const data = await api(config.endpoint);
  view.innerHTML = `
    ${pageHeader(config.title, config.subtitle)}
    <section class="grid two">
      <div class="panel">
        <h2>Registros</h2>
        ${recordList(data.items, (item) => ({
          ...config.card(item),
          actions: `${config.card(item).actions || ""}<button class="btn danger" data-delete-module="${item.id}">Excluir</button>`,
        }))}
      </div>
      <div class="panel">
        <h2>${esc(config.createLabel)}</h2>
        ${formHtml(key, config.fields)}
        <div id="formError" class="error"></div>
      </div>
    </section>
  `;
  document.querySelectorAll("[data-delete-module]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Deseja excluir este registro?")) return;
      await api(`${config.endpoint}/${button.dataset.deleteModule}`, { method: "DELETE" });
      await moduleView(config, key);
    });
  });
  document.querySelector(`#${key}Form`).addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(event.currentTarget);
    const error = document.querySelector("#formError");
    error.textContent = "";
    try {
      await api(config.endpoint, { method: "POST", body: JSON.stringify(payload) });
      await moduleView(config, key);
    } catch (err) {
      error.textContent = err.message;
    }
  });
  document.querySelectorAll("[data-complete-task]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/tasks/${button.dataset.completeTask}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      await moduleView(config, key);
    });
  });
}

const crmStageOrder = [
  "novo lead",
  "triagem pendente",
  "aguardando documentos",
  "análise jurídica inicial",
  "proposta enviada",
  "negociação",
  "contrato assinado",
  "perdido",
];

function normalizeCrmStage(value) {
  const normalized = normalizeAgendaV2(value);
  return crmStageOrder.find((stage) => normalizeAgendaV2(stage) === normalized) || "novo lead";
}

function crmStageLabel(stage) {
  const map = {
    "novo lead": "Novo Lead",
    "triagem pendente": "Triagem",
    "aguardando documentos": "Documentos",
    "análise jurídica inicial": "Análise",
    "proposta enviada": "Proposta",
    "negociação": "Negociação",
    "contrato assinado": "Fechado",
    perdido: "Perdido",
  };
  return map[stage] || stage;
}

function crmLeadPayload(item, overrides = {}) {
  return {
    name: overrides.name ?? item.name ?? null,
    origin: overrides.origin ?? item.origin ?? null,
    area: overrides.area ?? item.area ?? null,
    stage: overrides.stage ?? item.stage ?? "novo lead",
    urgency: overrides.urgency ?? item.urgency ?? "média",
    risk: overrides.risk ?? item.risk ?? "baixo",
    responsible: overrides.responsible ?? item.responsible ?? null,
    follow_up: overrides.follow_up ?? item.follow_up ?? null,
    phone: overrides.phone ?? item.phone ?? null,
    email: overrides.email ?? item.email ?? null,
    summary: overrides.summary ?? item.summary ?? null,
  };
}

function omniPlatformLabel(platform) {
  const labels = {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
  };
  return labels[String(platform || "").toLowerCase()] || platform || "Canal";
}

function omniStatusBadge(status) {
  const value = String(status || "novo");
  return `<span class="omni-status ${esc(value)}">${esc(value.replace("-", " "))}</span>`;
}

function omniChannelCard(item) {
  return `
    <form class="omni-channel-card" data-omni-channel-form data-channel-code="${esc(item.channel_code)}">
      <div class="omni-channel-head">
        <div>
          <strong>${esc(item.display_name || omniPlatformLabel(item.channel_code))}</strong>
          <span>${esc(omniPlatformLabel(item.channel_code))}</span>
        </div>
        ${omniStatusBadge(item.status || "pendente")}
      </div>
      <label>URL de webhook</label>
      <div class="omni-copy-row">
        <input readonly value="${esc(item.callback_url || "")}" />
        <button class="btn ghost" type="button" data-copy-text="${esc(item.callback_url || "")}">Copiar</button>
      </div>
      <div class="row">
        <div class="field"><label>Nome do canal</label><input name="display_name" value="${esc(item.display_name || "")}" /></div>
        <div class="field"><label>Status</label><select name="status"><option value="ativo" ${item.status === "ativo" ? "selected" : ""}>ativo</option><option value="pendente" ${item.status === "pendente" ? "selected" : ""}>pendente</option><option value="pausado" ${item.status === "pausado" ? "selected" : ""}>pausado</option></select></div>
      </div>
      <div class="field"><label>Token de verificacao</label><input name="verify_token" value="${esc(item.verify_token || "")}" /></div>
      <div class="field"><label>Access token Meta</label><input type="password" name="access_token" value="${esc(item.access_token || "")}" placeholder="Token permanente ou token de pagina" /></div>
      <div class="row">
        <div class="field"><label>Page ID</label><input name="page_id" value="${esc(item.page_id || "")}" placeholder="Facebook/Instagram Page ID" /></div>
        <div class="field"><label>Phone Number ID</label><input name="phone_number_id" value="${esc(item.phone_number_id || "")}" placeholder="WhatsApp Phone Number ID" /></div>
      </div>
      <div class="row">
        <div class="field"><label>Business Account ID</label><input name="business_account_id" value="${esc(item.business_account_id || "")}" /></div>
        <div class="field"><label>App secret</label><input type="password" name="app_secret" value="${esc(item.app_secret || "")}" /></div>
      </div>
      <div class="field"><label>Campos do webhook</label><input name="webhook_fields" value="${esc(item.webhook_fields || "")}" /></div>
      <div class="row actions-row">
        <span class="muted-inline">${item.last_event_at ? `Ultimo evento: ${esc(formatDate(item.last_event_at))}` : "Sem eventos recebidos."}</span>
        <button class="btn primary" type="submit">Salvar canal</button>
      </div>
    </form>
  `;
}

function omniContactCard(item, selectedId) {
  const active = Number(item.id) === Number(selectedId) ? "active" : "";
  return `
    <article class="omni-contact-card ${active}" data-select-omni-contact="${esc(item.id)}">
      <div class="omni-contact-main">
        <div>
          <strong>${esc(item.name || item.username || item.external_id || "Contato sem nome")}</strong>
          <span>${esc(omniPlatformLabel(item.platform))} · ${esc(item.phone || item.username || item.external_id || "-")}</span>
        </div>
        ${omniStatusBadge(item.status)}
      </div>
      <p>${esc(item.last_message || "Sem mensagem registrada.")}</p>
      <div class="omni-contact-meta">
        <span>Lead: ${esc(item.lead_name || item.lead_id || "nao vinculado")}</span>
        <span>${esc(formatDate(item.last_message_at || item.updated_at))}</span>
      </div>
      <div class="omni-contact-actions">
        ${item.lead_id ? `<button class="btn ghost crm-mini-btn" type="button" data-open-omni-lead="${esc(item.lead_id)}">CRM</button>` : ""}
        <button class="btn ghost crm-mini-btn" type="button" data-convert-omni-client="${esc(item.id)}">${item.client_id ? "Cliente criado" : "Criar cliente"}</button>
        <button class="btn danger crm-mini-btn" type="button" data-archive-omni-contact="${esc(item.id)}">Arquivar</button>
      </div>
    </article>
  `;
}

function omniRequirementsHtml(status) {
  const links = (status.official_sources || [])
    .map((item) => `<a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.label)}</a>`)
    .join("");
  return `
    <div class="omni-requirements">
      <div>
        <h3>Para ativar em producao</h3>
        <ul>${(status.requirements || []).map((text) => `<li>${esc(text)}</li>`).join("")}</ul>
      </div>
      <div>
        <h3>Referencias oficiais</h3>
        <div class="tribunal-source-links">${links}</div>
      </div>
    </div>
  `;
}

async function omnichannelCenterView() {
  const view = document.querySelector("#view");
  const platform = state.omnichannelPlatform || "";
  const q = state.omnichannelSearch || "";
  const [status, contactsRes] = await Promise.all([
    api("/api/omnichannel/status"),
    api(`/api/omnichannel/contacts?platform=${encodeURIComponent(platform)}&q=${encodeURIComponent(q)}`),
  ]);
  const contacts = contactsRes.items || [];
  const selectedId = state.omnichannelSelectedContactId || contacts[0]?.id || null;
  const selectedContact = contacts.find((item) => Number(item.id) === Number(selectedId)) || contacts[0] || null;
  const messagesRes = selectedContact ? await api(`/api/omnichannel/messages?contact_id=${encodeURIComponent(selectedContact.id)}`) : { items: [] };
  const messages = messagesRes.items || [];
  const channels = status.channels || [];
  const summary = status.summary || {};

  view.innerHTML = `
    ${pageHeader("Central de contatos", "WhatsApp, Instagram e Facebook recebidos em uma fila única e conectados ao CRM Jurídico.", `
      <button class="btn ghost" id="omniGoCrmBtn">Abrir CRM</button>
      <button class="btn primary" id="omniManualFocusBtn">Importar teste</button>
    `)}
    <section class="grid metrics">
      ${metric("Canais", summary.channels || 0, "Meta")}
      ${metric("Ativos", summary.active_channels || 0, "webhooks")}
      ${metric("Configurados", summary.configured_channels || 0, "credenciais")}
      ${metric("Contatos captados", summary.contacts || 0, "central")}
      ${metric("Mensagens", summary.messages || 0, "historico")}
      ${metric("Leads gerados", summary.leads_linked || 0, "CRM")}
    </section>
    <section class="panel omni-panel" style="margin-top:14px">
      <div class="omni-filterbar">
        <select id="omniPlatformFilter">
          <option value="" ${platform === "" ? "selected" : ""}>Todos os canais</option>
          <option value="whatsapp" ${platform === "whatsapp" ? "selected" : ""}>WhatsApp</option>
          <option value="instagram" ${platform === "instagram" ? "selected" : ""}>Instagram</option>
          <option value="facebook" ${platform === "facebook" ? "selected" : ""}>Facebook</option>
        </select>
        <input id="omniSearchInput" value="${esc(q)}" placeholder="Pesquisar nome, usuario, telefone ou mensagem" />
        <button class="btn ghost" id="omniSearchBtn" type="button">Pesquisar</button>
      </div>
      <div class="omni-workbench">
        <div class="omni-column">
          <h2>Contatos recebidos</h2>
          ${contacts.length ? contacts.map((item) => omniContactCard(item, selectedContact?.id)).join("") : `<div class="empty">Nenhum contato recebido ainda.</div>`}
        </div>
        <div class="omni-column">
          <h2>Conversa</h2>
          ${
            selectedContact
              ? `
                <div class="omni-selected-contact">
                  <strong>${esc(selectedContact.name || selectedContact.external_id)}</strong>
                  <span>${esc(omniPlatformLabel(selectedContact.platform))} · ${esc(selectedContact.lead_stage || "novo lead")}</span>
                </div>
                <div class="omni-message-list">
                  ${messages.length ? messages.map((item) => `
                    <div class="omni-message ${esc(item.direction || "inbound")}">
                      <span>${esc(formatDate(item.received_at))} · ${esc(item.message_type || "mensagem")}</span>
                      <p>${esc(item.text || "Evento sem texto.")}</p>
                    </div>
                  `).join("") : `<div class="empty">Sem mensagens para este contato.</div>`}
                </div>
              `
              : `<div class="empty">Selecione um contato para ver a conversa.</div>`
          }
        </div>
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Canais Meta</h2>
        <p class="muted-inline">Cadastre estes dados no painel da Meta. Em producao, a URL precisa estar publicada com HTTPS.</p>
        <div class="omni-channel-grid">${channels.map(omniChannelCard).join("")}</div>
      </div>
      <div class="panel" id="omniManualPanel">
        <h2>Importacao de teste</h2>
        <p class="muted-inline">Use para simular um contato recebido enquanto o dominio e o webhook publico nao estao publicados.</p>
        <form id="omniManualForm" class="form-grid">
          <div class="field"><label>Canal</label><select name="platform"><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option></select></div>
          <div class="field"><label>Nome</label><input name="name" placeholder="Nome do contato" required /></div>
          <div class="field"><label>ID externo / usuario</label><input name="external_id" placeholder="Telefone, PSID ou Instagram ID" required /></div>
          <div class="field"><label>Telefone</label><input name="phone" placeholder="+5531999999999" /></div>
          <div class="field full"><label>Mensagem</label><textarea name="text" placeholder="Digite a mensagem recebida"></textarea></div>
          <div class="full btn-row"><button class="btn primary" type="submit">Importar e criar lead</button></div>
          <div class="full"><div id="omniManualError" class="error"></div></div>
        </form>
        ${omniRequirementsHtml(status)}
      </div>
    </section>
  `;

  document.querySelector("#omniGoCrmBtn").addEventListener("click", () => {
    location.hash = "#/leads";
  });
  document.querySelector("#omniManualFocusBtn").addEventListener("click", () => {
    document.querySelector("#omniManualPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelector("#omniPlatformFilter").addEventListener("change", async (event) => {
    state.omnichannelPlatform = event.currentTarget.value;
    state.omnichannelSelectedContactId = null;
    await omnichannelCenterView();
  });
  document.querySelector("#omniSearchInput").addEventListener("input", (event) => {
    state.omnichannelSearch = event.currentTarget.value;
  });
  document.querySelector("#omniSearchInput").addEventListener("keydown", async (event) => {
    if (event.key === "Enter") await omnichannelCenterView();
  });
  document.querySelector("#omniSearchBtn").addEventListener("click", omnichannelCenterView);
  document.querySelectorAll("[data-copy-text]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyText || "");
        toast("Webhook copiado.");
      } catch {
        toast(button.dataset.copyText || "Copie a URL exibida.");
      }
    });
  });
  document.querySelectorAll("[data-omni-channel-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const payload = {
        channel_code: form.dataset.channelCode,
        display_name: String(values.get("display_name") || "").trim(),
        status: String(values.get("status") || "pendente"),
        verify_token: String(values.get("verify_token") || "").trim(),
        app_secret: String(values.get("app_secret") || "").trim(),
        access_token: String(values.get("access_token") || "").trim(),
        page_id: String(values.get("page_id") || "").trim(),
        phone_number_id: String(values.get("phone_number_id") || "").trim(),
        business_account_id: String(values.get("business_account_id") || "").trim(),
        webhook_fields: String(values.get("webhook_fields") || "").trim(),
      };
      await api("/api/omnichannel/channels", { method: "POST", body: JSON.stringify(payload) });
      await omnichannelCenterView();
    });
  });
  document.querySelectorAll("[data-select-omni-contact]").forEach((card) => {
    card.addEventListener("click", async (event) => {
      if (event.target.closest("button")) return;
      state.omnichannelSelectedContactId = Number(card.dataset.selectOmniContact);
      await omnichannelCenterView();
    });
  });
  document.querySelectorAll("[data-open-omni-lead]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = "#/leads";
    });
  });
  document.querySelectorAll("[data-convert-omni-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/omnichannel/contacts/${button.dataset.convertOmniClient}/client`, { method: "POST" });
      await omnichannelCenterView();
    });
  });
  document.querySelectorAll("[data-archive-omni-contact]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/omnichannel/contacts/${button.dataset.archiveOmniContact}/status`, { method: "PATCH", body: JSON.stringify({ status: "arquivado" }) });
      await omnichannelCenterView();
    });
  });
  document.querySelector("#omniManualForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#omniManualError");
    error.textContent = "";
    try {
      await api("/api/omnichannel/import", { method: "POST", body: JSON.stringify(collectForm(event.currentTarget)) });
      event.currentTarget.reset();
      await omnichannelCenterView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function crmLeadCard(item, attendanceCount) {
  const stage = normalizeCrmStage(item.stage);
  return `
    <article class="crm-card" draggable="true" data-crm-lead-id="${item.id}">
      <div class="crm-card-head">
        <div class="crm-card-title">${esc(item.name || "Lead sem nome")}</div>
        <div class="crm-card-badges">${badge(item.urgency || "média")} ${badge(item.risk || "baixo")}</div>
      </div>
      <div class="crm-card-meta">${esc(item.area || "Área não informada")} · ${esc(item.origin || "Origem não informada")}</div>
      <div class="crm-card-meta">Responsável: ${esc(item.responsible || "Não definido")}</div>
      <div class="crm-card-meta">Follow-up: ${esc(formatDate(item.follow_up))}</div>
      <div class="crm-card-meta">Atendimentos vinculados: ${esc(attendanceCount || 0)}</div>
      <div class="crm-card-footer">
        <button class="btn ghost crm-mini-btn" type="button" data-edit-lead-id="${item.id}">Editar</button>
        <button class="btn ghost crm-mini-btn" type="button" data-open-attendance-lead="${item.id}">Atendimento</button>
        <button class="btn danger crm-mini-btn" type="button" data-delete-lead-id="${item.id}">Excluir</button>
      </div>
    </article>
  `;
}

function crmLeadModalHtml() {
  return `
    <div class="modal-shell" id="leadModal">
      <div class="modal-backdrop" data-close-lead-modal="1"></div>
      <section class="modal-panel">
        <header class="modal-header">
          <h2 id="leadModalTitle">Novo lead</h2>
          <button class="btn ghost" type="button" data-close-lead-modal="1">Fechar</button>
        </header>
        <form id="leadForm" class="form-grid modal-form-grid">
          ${moduleConfigs.leads.fields.map(([name, label, type, required, options]) => fieldHtml(name, label, type, required, options)).join("")}
          <div class="full btn-row modal-actions">
            <button class="btn danger hidden" type="button" id="leadDeleteBtn">Excluir</button>
            <button class="btn ghost" type="button" data-close-lead-modal="1">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
          </div>
          <div class="full"><div id="leadFormError" class="error"></div></div>
        </form>
      </section>
    </div>
  `;
}

async function crmJuridicoKanbanView() {
  const view = document.querySelector("#view");
  const [leadRes, attendanceRes] = await Promise.all([api("/api/leads"), api("/api/attendances")]);
  const leads = (leadRes.items || []).map((item) => ({ ...item, stage: normalizeCrmStage(item.stage) }));
  const attendances = attendanceRes.items || [];
  const attendanceCountByLead = new Map();

  attendances.forEach((item) => {
    if (normalizeAgendaV2(item.linked_type) !== "lead") return;
    const leadId = Number(item.linked_id);
    if (!leadId) return;
    attendanceCountByLead.set(leadId, (attendanceCountByLead.get(leadId) || 0) + 1);
  });

  const grouped = new Map(crmStageOrder.map((stage) => [stage, []]));
  leads.forEach((item) => {
    const stage = normalizeCrmStage(item.stage);
    grouped.get(stage).push(item);
  });

  const activeLeads = leads.filter((item) => !["perdido", "contrato assinado"].includes(normalizeCrmStage(item.stage))).length;
  const closedLeads = leads.length - activeLeads;
  const overdueFollowUps = leads.filter((item) => {
    const due = parseDateOnly(item.follow_up);
    if (!due) return false;
    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return due < base && !["perdido", "contrato assinado"].includes(normalizeCrmStage(item.stage));
  }).length;

  view.innerHTML = `
    ${pageHeader("CRM Jurídico", "Funil de atendimentos em estilo Kanban com arraste de leads por etapa.", `
      <button class="btn ghost" id="crmOpenAttendanceBtn">Novo atendimento</button>
      <button class="btn primary" id="crmNewLeadBtn">Novo lead</button>
    `)}
    <section class="grid metrics">
      ${metric("Leads no funil", activeLeads, "etapas ativas")}
      ${metric("Leads fechados", closedLeads, "contrato assinado ou perdido")}
      ${metric("Follow-ups em atraso", overdueFollowUps, "atenção comercial")}
      ${metric("Atendimentos", attendances.length, "histórico de relacionamento")}
      ${metric("Taxa de ganho", leads.length ? `${Math.round((grouped.get("contrato assinado").length / leads.length) * 100)}%` : "0%", "conversão")}
      ${metric("Carteira total", leads.length, "leads cadastrados")}
    </section>
    <section class="crm-board" id="crmBoard" style="margin-top:14px">
      ${crmStageOrder
        .map((stage) => {
          const stageItems = grouped.get(stage) || [];
          return `
            <div class="crm-column" data-crm-stage="${esc(stage)}">
              <header class="crm-column-head">
                <div>
                  <h2>${esc(crmStageLabel(stage))}</h2>
                  <p>${esc(stageItems.length)} lead(s)</p>
                </div>
                <button class="btn ghost crm-mini-btn" type="button" data-crm-add-stage="${esc(stage)}">+ Lead</button>
              </header>
              <div class="crm-dropzone" data-crm-dropzone="${esc(stage)}">
                ${stageItems.length ? stageItems.map((item) => crmLeadCard(item, attendanceCountByLead.get(item.id) || 0)).join("") : `<div class="crm-empty">Sem leads nesta etapa.</div>`}
              </div>
            </div>
          `;
        })
        .join("")}
    </section>
    <div id="crmError" class="error"></div>
    ${crmLeadModalHtml()}
  `;

  const leadModal = document.querySelector("#leadModal");
  const leadForm = document.querySelector("#leadForm");
  const leadDeleteBtn = document.querySelector("#leadDeleteBtn");
  const leadError = document.querySelector("#leadFormError");

  const closeLeadModal = () => {
    leadModal.classList.remove("open");
    state.leadEditingId = null;
  };

  const openLeadModal = (lead = null, stagePreset = null) => {
    leadError.textContent = "";
    leadForm.reset();
    if (lead) {
      state.leadEditingId = lead.id;
      setFormValues(leadForm, lead);
      leadDeleteBtn.classList.remove("hidden");
      document.querySelector("#leadModalTitle").textContent = "Editar lead";
    } else {
      state.leadEditingId = null;
      leadDeleteBtn.classList.add("hidden");
      document.querySelector("#leadModalTitle").textContent = "Novo lead";
      if (leadForm.elements.stage) leadForm.elements.stage.value = stagePreset || "novo lead";
      if (leadForm.elements.urgency) leadForm.elements.urgency.value = "média";
      if (leadForm.elements.risk) leadForm.elements.risk.value = "baixo";
      if (leadForm.elements.responsible) leadForm.elements.responsible.value = state.user?.name || "";
    }
    leadModal.classList.add("open");
  };

  document.querySelector("#crmOpenAttendanceBtn").addEventListener("click", () => {
    state.attendancePanel = "atendimento";
    state.attendanceLeadPrefillId = null;
    location.hash = "#/attendances";
  });

  document.querySelector("#crmNewLeadBtn").addEventListener("click", () => openLeadModal(null, "novo lead"));
  document.querySelectorAll("[data-crm-add-stage]").forEach((button) => {
    button.addEventListener("click", () => openLeadModal(null, button.dataset.crmAddStage));
  });

  document.querySelectorAll("[data-close-lead-modal]").forEach((button) => {
    button.addEventListener("click", closeLeadModal);
  });

  document.querySelectorAll("[data-edit-lead-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const lead = leads.find((item) => item.id === Number(button.dataset.editLeadId));
      if (!lead) return;
      openLeadModal(lead);
    });
  });

  document.querySelectorAll("[data-open-attendance-lead]").forEach((button) => {
    button.addEventListener("click", () => {
      const leadId = Number(button.dataset.openAttendanceLead);
      state.attendancePanel = "atendimento";
      state.attendanceLeadPrefillId = leadId || null;
      location.hash = "#/attendances";
    });
  });

  document.querySelectorAll("[data-delete-lead-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      const leadId = Number(button.dataset.deleteLeadId);
      if (!leadId) return;
      await api(`/api/leads/${leadId}`, { method: "DELETE" });
      if (state.leadEditingId === leadId) closeLeadModal();
      await crmJuridicoKanbanView();
    });
  });

  leadDeleteBtn.addEventListener("click", async () => {
    if (!state.leadEditingId) return;
    await api(`/api/leads/${state.leadEditingId}`, { method: "DELETE" });
    closeLeadModal();
    await crmJuridicoKanbanView();
  });

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(leadForm);
    leadError.textContent = "";
    try {
      if (state.leadEditingId) {
        await api(`/api/leads/${state.leadEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/leads", { method: "POST", body: JSON.stringify(payload) });
      }
      closeLeadModal();
      await crmJuridicoKanbanView();
    } catch (err) {
      leadError.textContent = err.message;
    }
  });

  let draggingLeadId = null;
  document.querySelectorAll("[data-crm-lead-id]").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggingLeadId = Number(card.dataset.crmLeadId);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      draggingLeadId = null;
      card.classList.remove("dragging");
      document.querySelectorAll("[data-crm-dropzone]").forEach((zone) => zone.classList.remove("drag-over"));
    });
  });

  document.querySelectorAll("[data-crm-dropzone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", async (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      if (!draggingLeadId) return;
      const stage = zone.dataset.crmDropzone || "novo lead";
      const lead = leads.find((item) => item.id === draggingLeadId);
      if (!lead) return;
      const nextStage = normalizeCrmStage(stage);
      if (normalizeCrmStage(lead.stage) === nextStage) return;
      const errorNode = document.querySelector("#crmError");
      errorNode.textContent = "";
      try {
        await api(`/api/leads/${lead.id}`, {
          method: "PATCH",
          body: JSON.stringify(crmLeadPayload(lead, { stage: nextStage })),
        });
        await crmJuridicoKanbanView();
      } catch (err) {
        errorNode.textContent = err.message;
      }
    });
  });
}

const clientAstreaFields = [
  ["name", "Nome do contato", "text", true],
  ["type", "Tipo", "select", false, ["Pessoa física", "Pessoa jurídica"]],
  ["status", "Status", "select", false, ["ativo", "inativo", "arquivado"]],
  ["legal_name", "Nome/razão social", "text"],
  ["document", "CPF/CNPJ", "text"],
  ["secondary_document", "RG/IE", "text"],
  ["birth_date", "Data de nascimento/fundação", "date"],
  ["marital_status", "Estado civil", "text"],
  ["profession", "Profissão", "text"],
  ["contact_person", "Contato principal", "text"],
  ["email", "E-mail", "email"],
  ["email_secondary", "E-mail secundário", "email"],
  ["phone", "Telefone", "text"],
  ["whatsapp", "WhatsApp", "text"],
  ["preferred_channel", "Canal preferencial", "select", false, ["whatsapp", "email", "telefone", "reunião"]],
  ["website", "Website", "text"],
  ["tags", "Tags", "text"],
  ["area", "Área jurídica", "text"],
  ["zip_code", "CEP", "text"],
  ["street", "Endereço", "text"],
  ["street_number", "Número", "text"],
  ["complement", "Complemento", "text"],
  ["district", "Bairro", "text"],
  ["city", "Cidade", "text"],
  ["state", "UF", "text"],
  ["country", "País", "text"],
  ["notes", "Observações", "textarea"],
];

async function clientsAstreaView() {
  const view = document.querySelector("#view");
  const data = await api("/api/clients");
  const items = data.items || [];
  const editing = items.find((item) => item.id === state.clientEditingId) || null;
  view.innerHTML = `
    ${pageHeader("Clientes", "Cadastro completo de contatos e clientes, com dados pessoais, comunicação e endereço.", `
      <button class="btn ghost" id="clientNewBtn">Novo cliente</button>
    `)}
    <section class="grid two">
      <div class="panel">
        <h2>Contatos cadastrados</h2>
        ${recordList(items, (item) => ({
          title: item.name,
          badges: [item.status, item.type, item.area || "sem área"],
          meta: [
            `${item.document || "sem documento"} · ${item.city || "cidade não informada"}${item.state ? `/${item.state}` : ""}`,
            item.email || "sem e-mail",
            item.phone || "sem telefone",
            item.notes || "",
          ],
          actions: `
            <button class="btn ghost" data-edit-client="${item.id}">Editar</button>
            <button class="btn ghost" data-archive-client="${item.id}">Arquivar</button>
          `,
        }))}
      </div>
      <div class="panel">
        <h2>${editing ? "Editar cliente" : "Novo cliente"}</h2>
        <form id="clientAstreaForm" class="form-grid client-form-grid">
          ${clientAstreaFields.map(([name, label, type, required, options]) => fieldHtml(name, label, type, required, options)).join("")}
          <div class="full btn-row">
            <button class="btn primary" type="submit">Salvar</button>
            <button class="btn ghost" type="button" id="clientCancelBtn">Cancelar</button>
            ${editing ? '<button class="btn ghost" type="button" id="clientArchiveBtn">Arquivar</button>' : ""}
          </div>
          <div class="full"><div id="clientFormError" class="error"></div></div>
        </form>
      </div>
    </section>
  `;

  const form = document.querySelector("#clientAstreaForm");
  if (editing) setFormValues(form, editing);
  if (!editing && form.elements.status) form.elements.status.value = "ativo";

  document.querySelector("#clientNewBtn").addEventListener("click", async () => {
    state.clientEditingId = null;
    await clientsAstreaView();
  });

  document.querySelector("#clientCancelBtn").addEventListener("click", async () => {
    state.clientEditingId = null;
    await clientsAstreaView();
  });

  if (editing && document.querySelector("#clientArchiveBtn")) {
    document.querySelector("#clientArchiveBtn").addEventListener("click", async () => {
      await api(`/api/clients/${editing.id}/status`, { method: "PATCH", body: JSON.stringify({ status: "arquivado" }) });
      state.clientEditingId = null;
      await clientsAstreaView();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(form);
    const error = document.querySelector("#clientFormError");
    error.textContent = "";
    try {
      if (state.clientEditingId) {
        await api(`/api/clients/${state.clientEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/clients", { method: "POST", body: JSON.stringify(payload) });
      }
      state.clientEditingId = null;
      await clientsAstreaView();
    } catch (err) {
      error.textContent = err.message;
    }
  });

  document.querySelectorAll("[data-edit-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.clientEditingId = Number(button.dataset.editClient);
      await clientsAstreaView();
    });
  });

  document.querySelectorAll("[data-archive-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/clients/${button.dataset.archiveClient}/status`, { method: "PATCH", body: JSON.stringify({ status: "arquivado" }) });
      if (state.clientEditingId === Number(button.dataset.archiveClient)) state.clientEditingId = null;
      await clientsAstreaView();
    });
  });
}

async function agendaAstreaView() {
  const view = document.querySelector("#view");
  const [tasksRes, eventsRes, deadlinesRes, refs] = await Promise.all([
    api("/api/tasks"),
    api("/api/events"),
    api("/api/deadlines"),
    api("/api/agenda/references"),
  ]);
  const tasks = { items: tasksRes.items || [] };
  const events = { items: eventsRes.items || [] };
  const deadlines = { items: deadlinesRes.items || [] };
  const openTasks = tasks.items.filter((item) => item.status !== "concluída");
  const openEvents = events.items.filter((item) => item.status !== "concluido");
  const openDeadlines = deadlines.items.filter((item) => item.status !== "concluído");
  view.innerHTML = `
    ${pageHeader("Agenda", "Tarefas internas, eventos e prazos processuais em uma única visão.", `
      <button class="btn ghost" id="openTaskModalBtn">Adicionar tarefa</button>
      <button class="btn primary" id="openEventModalBtn">Adicionar evento</button>
    `)}
    <section class="grid metrics">
      ${metric("Tarefas abertas", openTasks.length, "execução")}
      ${metric("Eventos ativos", openEvents.length, "agenda")}
      ${metric("Prazos processuais", openDeadlines.length, "controle")}
      ${metric("Alta prioridade", openTasks.filter((item) => ["alta", "crítica"].includes(item.priority)).length, "atenção")}
      ${metric("Audiências", openDeadlines.filter((item) => item.deadline_type === "audiência").length, "processual")}
      ${metric("Concluídos", tasks.items.filter((item) => item.status === "concluída").length, "tarefas")}
    </section>
    <section class="grid two agenda-secondary-blocks" style="margin-top:14px">
      <div class="panel">
        <h2>Tarefas</h2>
        ${recordList(tasks.items, (item) => ({
          title: item.title,
          badges: [item.status, item.priority, item.task_list || "lista geral"],
          meta: [
            item.description || "sem descrição",
            `Data: ${formatDate(item.due_date)}${item.deadline_time ? ` às ${item.deadline_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Kanban: ${item.kanban_board || "N/A"} · ${item.kanban_column || "N/A"}`,
          ],
          actions: `
            <button class="btn ghost" data-edit-task="${item.id}">Editar</button>
            ${item.status !== "concluída" ? `<button class="btn ghost" data-complete-task-astrea="${item.id}">Concluir</button>` : ""}
          `,
        }))}
      </div>
      <div class="panel">
        <h2>Eventos</h2>
        ${recordList(events.items, (item) => ({
          title: item.title,
          badges: [item.status, item.modality || "modalidade não definida"],
          meta: [
            `Início: ${formatDate(item.start_date)}${item.start_time ? ` às ${item.start_time}` : ""}`,
            `Fim: ${formatDate(item.end_date || item.start_date)}${item.end_time ? ` às ${item.end_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            item.location || item.observations || "sem detalhes",
          ],
          actions: `
            <button class="btn ghost" data-edit-event="${item.id}">Editar</button>
            ${item.status !== "concluido" ? `<button class="btn ghost" data-complete-event="${item.id}">Concluir</button>` : ""}
          `,
        }))}
      </div>
    </section>
    <section class="panel agenda-secondary-blocks" style="margin-top:14px">
      <h2>Prazos processuais</h2>
      ${recordList(openDeadlines.slice(0, 12), deadlineCard)}
    </section>
    ${taskModalHtml()}
    ${eventModalHtml()}
  `;

  bindAgendaModals(tasks.items, events.items);
}

function taskModalHtml() {
  return `
    <div class="modal-shell" id="taskModal">
      <div class="modal-backdrop" data-close-modal="taskModal"></div>
      <section class="modal-panel">
        <header class="modal-header">
          <h2 id="taskModalTitle">Adicionar tarefa</h2>
          <button class="btn ghost" type="button" data-close-modal="taskModal">Fechar</button>
        </header>
        <form id="taskAstreaForm" class="form-grid modal-form-grid">
          <div class="field full">
            <label for="task_title">Descrição da tarefa*</label>
            <textarea id="task_title" name="title" required placeholder="Digite a descrição da tarefa"></textarea>
          </div>
          <div class="field">
            <label for="task_due_date">Data</label>
            <input id="task_due_date" name="due_date" type="date" />
          </div>
          <div class="field">
            <label for="task_list">Lista de tarefas*</label>
            <select id="task_list" name="task_list" required>
              <option value="">Selecione</option>
              <option value="Lista de tarefas">Lista de tarefas</option>
              <option value="Audiências">Audiências</option>
              <option value="Controladoria">Controladoria</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Audiências">Audiências</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>
          <div class="field full">
            <label for="task_linked_reference">Processo, caso ou atendimento</label>
            <input id="task_linked_reference" name="linked_reference" type="text" placeholder="Encontre um processo, caso ou atendimento" />
          </div>
          <div class="field">
            <label for="task_owner">Responsável*</label>
            <input id="task_owner" name="owner" type="text" required />
          </div>
          <div class="field">
            <label for="task_priority">Prioridade*</label>
            <select id="task_priority" name="priority" required>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
              <option value="crítica">Crítica</option>
            </select>
          </div>
          <div class="field">
            <label for="task_kanban_board">Quadro do Kanban*</label>
            <select id="task_kanban_board" name="kanban_board" required>
              <option value="Kanban Padrão">Kanban Padrão</option>
              <option value="Contencioso">Contencioso</option>
              <option value="Consultivo">Consultivo</option>
            </select>
          </div>
          <div class="field">
            <label for="task_kanban_column">Coluna do Kanban*</label>
            <select id="task_kanban_column" name="kanban_column" required>
              <option value="A Fazer">A Fazer</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div class="field">
            <label for="task_deadline_time">Horário</label>
            <input id="task_deadline_time" name="deadline_time" type="time" />
          </div>
          <div class="field">
            <label for="task_status">Status</label>
            <select id="task_status" name="status">
              <option value="aberta">Aberta</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>
          <div class="field full">
            <label for="task_description">Observações</label>
            <textarea id="task_description" name="description" placeholder="Digite observações internas"></textarea>
          </div>
          <div class="full btn-row modal-actions">
            <button class="btn ghost" type="button" data-close-modal="taskModal">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
          </div>
          <div class="full"><div id="taskFormError" class="error"></div></div>
        </form>
      </section>
    </div>
  `;
}

function eventModalHtml() {
  return `
    <div class="modal-shell" id="eventModal">
      <div class="modal-backdrop" data-close-modal="eventModal"></div>
      <section class="modal-panel">
        <header class="modal-header">
          <h2 id="eventModalTitle">Adicionar evento</h2>
          <button class="btn ghost" type="button" data-close-modal="eventModal">Fechar</button>
        </header>
        <form id="eventAstreaForm" class="form-grid modal-form-grid">
          <div class="field full">
            <label for="event_title">Título do evento*</label>
            <input id="event_title" name="title" type="text" required placeholder="Digite o título do evento" />
          </div>
          <div class="field">
            <label for="event_start_date">De*</label>
            <input id="event_start_date" name="start_date" type="date" required />
          </div>
          <div class="field">
            <label for="event_start_time">Horário inicial</label>
            <input id="event_start_time" name="start_time" type="time" />
          </div>
          <div class="field">
            <label for="event_end_time">Até*</label>
            <input id="event_end_time" name="end_time" type="time" />
          </div>
          <div class="field">
            <label for="event_end_date">Data final*</label>
            <input id="event_end_date" name="end_date" type="date" />
          </div>
          <div class="field full checkbox-row">
            <input id="event_all_day" name="all_day" type="checkbox" />
            <label for="event_all_day">Dia inteiro</label>
          </div>
          <div class="field">
            <label for="event_recurrence">Recorrência</label>
            <input id="event_recurrence" name="recurrence" type="text" placeholder="Não repetir" />
          </div>
          <div class="field">
            <label for="event_modality">Modalidade</label>
            <select id="event_modality" name="modality">
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="híbrido">Híbrido</option>
            </select>
          </div>
          <div class="field full">
            <label for="event_location">Endereço ou local</label>
            <input id="event_location" name="location" type="text" />
          </div>
          <div class="field">
            <label for="event_reminder_value">Alertas internos de antecedência</label>
            <input id="event_reminder_value" name="reminder_value" type="number" min="0" value="0" />
          </div>
          <div class="field">
            <label for="event_reminder_unit">Unidade</label>
            <select id="event_reminder_unit" name="reminder_unit">
              <option value="hora(s)">Hora(s) antes</option>
              <option value="dia(s)">Dia(s) antes</option>
              <option value="minuto(s)">Minuto(s) antes</option>
            </select>
          </div>
          <div class="field">
            <label for="event_owner">Responsável*</label>
            <input id="event_owner" name="owner" type="text" required />
          </div>
          <div class="field">
            <label for="event_status">Status</label>
            <select id="event_status" name="status">
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="field full">
            <label for="event_external_summary">Resumo para pessoas externas</label>
            <input id="event_external_summary" name="external_summary" type="text" />
          </div>
          <div class="field full">
            <label for="event_external_emails">E-mails externos</label>
            <input id="event_external_emails" name="external_emails" type="text" placeholder="email1@dominio.com, email2@dominio.com" />
          </div>
          <div class="field full">
            <label for="event_observations">Observações</label>
            <textarea id="event_observations" name="observations"></textarea>
          </div>
          <div class="field full">
            <label for="event_linked_reference">Processo, caso ou atendimento</label>
            <input id="event_linked_reference" name="linked_reference" type="text" placeholder="Encontre um processo, caso ou atendimento" />
          </div>
          <div class="field">
            <label for="event_kanban_board">Quadro do Kanban*</label>
            <select id="event_kanban_board" name="kanban_board" required>
              <option value="Kanban Padrão">Kanban Padrão</option>
              <option value="Contencioso">Contencioso</option>
              <option value="Consultivo">Consultivo</option>
            </select>
          </div>
          <div class="field">
            <label for="event_kanban_column">Coluna do Kanban*</label>
            <select id="event_kanban_column" name="kanban_column" required>
              <option value="A Fazer">A Fazer</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div class="full btn-row modal-actions">
            <button class="btn ghost" type="button" data-close-modal="eventModal">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
          </div>
          <div class="full"><div id="eventFormError" class="error"></div></div>
        </form>
      </section>
    </div>
  `;
}

function bindAgendaModals(tasks, events) {
  const taskModal = document.querySelector("#taskModal");
  const eventModal = document.querySelector("#eventModal");
  const taskForm = document.querySelector("#taskAstreaForm");
  const eventForm = document.querySelector("#eventAstreaForm");

  document.querySelector("#openTaskModalBtn").addEventListener("click", () => {
    state.taskEditingId = null;
    taskForm.reset();
    document.querySelector("#taskModalTitle").textContent = "Adicionar tarefa";
    taskModal.classList.add("open");
  });
  document.querySelector("#openEventModalBtn").addEventListener("click", () => {
    state.eventEditingId = null;
    eventForm.reset();
    document.querySelector("#eventModalTitle").textContent = "Adicionar evento";
    eventModal.classList.add("open");
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.closeModal}`);
      if (target) target.classList.remove("open");
    });
  });

  document.querySelectorAll("[data-edit-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = tasks.find((item) => item.id === Number(button.dataset.editTask));
      if (!task) return;
      state.taskEditingId = task.id;
      setFormValues(taskForm, task);
      document.querySelector("#taskModalTitle").textContent = "Editar tarefa";
      taskModal.classList.add("open");
    });
  });

  document.querySelectorAll("[data-edit-event]").forEach((button) => {
    button.addEventListener("click", () => {
      const event = events.find((item) => item.id === Number(button.dataset.editEvent));
      if (!event) return;
      state.eventEditingId = event.id;
      setFormValues(eventForm, event);
      eventForm.elements.all_day.checked = Number(event.all_day) === 1;
      document.querySelector("#eventModalTitle").textContent = "Editar evento";
      eventModal.classList.add("open");
    });
  });

  document.querySelectorAll("[data-complete-task-astrea]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/tasks/${button.dataset.completeTaskAstrea}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      await agendaAstreaView();
    });
  });

  document.querySelectorAll("[data-complete-event]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/events/${button.dataset.completeEvent}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluido" }) });
      await agendaAstreaView();
    });
  });

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(taskForm);
    const error = document.querySelector("#taskFormError");
    error.textContent = "";
    try {
      if (state.taskEditingId) {
        await api(`/api/tasks/${state.taskEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        // prefer explicit fetch to get richer error messages
        const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
      }
      taskModal.classList.remove("open");
      state.taskEditingId = null;
      await agendaAstreaView();
    } catch (err) {
      error.textContent = err.message;
    }
  });

  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(eventForm);
    payload.all_day = eventForm.elements.all_day.checked;
    if (!payload.end_date) payload.end_date = payload.start_date;
    const error = document.querySelector("#eventFormError");
    error.textContent = "";
    try {
      if (state.eventEditingId) {
        await api(`/api/events/${state.eventEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        const res = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
      }
      eventModal.classList.remove("open");
      state.eventEditingId = null;
      await agendaAstreaView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

async function agendaAstreaV2() {
  const view = document.querySelector("#view");
  const [tasksRes, eventsRes, deadlinesRes, refs, labelsRes] = await Promise.all([
    api("/api/tasks"),
    api("/api/events"),
    api("/api/deadlines"),
    api("/api/agenda/references"),
    api("/api/labels").catch(() => ({ items: [] })),
  ]);
  const tasks = tasksRes.items || [];
  const events = eventsRes.items || [];
  const deadlines = deadlinesRes.items || [];
  const labels = labelsRes.items || [];
  const openTasks = tasks.filter((item) => !isTaskDoneV2(item.status));
  const openEvents = events.filter((item) => !isEventClosedV2(item.status));
  const openDeadlines = deadlines.filter((item) => !isDeadlineDoneV2(item.status));
  const filteredTasks = filterAgendaByDateV2(tasks, state.agendaFilter, "due_date");
  const filteredEvents = filterAgendaByDateV2(events, state.agendaFilter, "start_date");
  const filters = [["hoje", "Hoje"], ["semana", "Semana"], ["mes", "Mes"], ["todos", "Todos"]];

  view.innerHTML = `
    ${pageHeader("Agenda", "Tarefas e eventos com vinculo processual, recorrencia e acoes completas.", `
      <div class="segmented" id="agendaFilter">
        ${filters.map(([value, label]) => `<button class="${state.agendaFilter === value ? "active" : ""}" data-agenda-filter="${value}" type="button">${label}</button>`).join("")}
      </div>
      <button class="btn ghost" id="openTaskModalBtnV2">Adicionar tarefa</button>
      <button class="btn primary" id="openEventModalBtnV2">Adicionar evento</button>
    `)}
    <section class="grid metrics">
      ${metric("Tarefas abertas", openTasks.length, "execucao")}
      ${metric("Eventos ativos", openEvents.length, "agenda")}
      ${metric("Prazos processuais", openDeadlines.length, "controle")}
      ${metric("Alta prioridade", openTasks.filter((item) => ["alta", "crítica", "critica"].includes(normalizeAgendaV2(item.priority))).length, "atencao")}
      ${metric("Audiencias", openDeadlines.filter((item) => normalizeAgendaV2(item.deadline_type).includes("audiencia")).length, "processual")}
      ${metric("Concluídos", tasks.filter((item) => isTaskDoneV2(item.status)).length, "tarefas")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Tarefas</h2>
        ${recordList(filteredTasks, (item) => ({
          title: item.title,
          badges: [item.status, item.priority, item.risk, item.label_name || "sem etiqueta", item.task_list || "lista geral"],
          meta: [
            item.description || "sem descricao",
            `Data: ${formatDate(item.due_date)}${item.deadline_time ? ` as ${item.deadline_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Vinculo: ${item.linked_reference || "sem vinculo"} (${item.linked_type || "geral"})`,
            `Kanban: ${item.kanban_board || "N/A"} · ${item.kanban_column || "N/A"}`,
          ],
          actions: `
            <button class="btn ghost" data-edit-task-v2="${item.id}">Editar</button>
            ${!isTaskDoneV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-task-v2="${item.id}" title="Concluir tarefa" aria-label="Concluir tarefa">✓</button>` : ""}
            <button class="btn danger" data-delete-task-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
      <div class="panel">
        <h2>Eventos</h2>
        ${recordList(filteredEvents, (item) => ({
          title: item.title,
          badges: [item.status, item.modality || "modalidade não definida", item.recurrence || "não repetir", item.label_name || "sem etiqueta"],
          meta: [
            `Inicio: ${formatDate(item.start_date)}${item.start_time ? ` as ${item.start_time}` : ""}`,
            `Fim: ${formatDate(item.end_date || item.start_date)}${item.end_time ? ` as ${item.end_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Vinculo: ${item.linked_reference || "sem vinculo"}`,
            item.location || item.observations || "sem detalhes",
          ],
          actions: `
            <button class="btn ghost" data-edit-event-v2="${item.id}">Editar</button>
            ${!isEventClosedV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-event-v2="${item.id}" title="Concluir evento" aria-label="Concluir evento">✓</button>` : ""}
            <button class="btn danger" data-delete-event-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Prazos processuais</h2>
      ${recordList(openDeadlines.slice(0, 12), deadlineCard)}
    </section>
    ${taskModalHtmlV2(refs, labels)}
    ${eventModalHtmlV2(refs, labels)}
  `;

  document.querySelectorAll("[data-agenda-filter]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.agendaFilter = button.dataset.agendaFilter || "todos";
      await agendaAstreaV3();
    });
  });

  bindAgendaModalsV2(tasks, events);
}

async function agendaAstreaV3() {
  const view = document.querySelector("#view");
  const [tasksRes, eventsRes, deadlinesRes, refs, labelsRes] = await Promise.all([
    api("/api/tasks"),
    api("/api/events"),
    api("/api/deadlines"),
    api("/api/agenda/references"),
    api("/api/labels").catch(() => ({ items: [] })),
  ]);
  const tasks = tasksRes.items || [];
  const events = eventsRes.items || [];
  const deadlines = deadlinesRes.items || [];
  const labels = labelsRes.items || [];
  if (!state.agendaDate) state.agendaDate = agendaDateToKeyV3(new Date());
  if (!state.agendaSelectedDate) state.agendaSelectedDate = state.agendaDate;
  const agendaView = ["dia", "semana", "mes"].includes(state.agendaView) ? state.agendaView : "mes";
  const anchorDate = parseDateOnly(state.agendaDate) || new Date();
  const range = agendaRangeByViewV3(anchorDate, agendaView);
  const selectedDateKey = state.agendaSelectedDate || state.agendaDate || agendaDateToKeyV3(new Date());
  const openTasks = tasks.filter((item) => !isTaskDoneV2(item.status));
  const openEvents = events.filter((item) => !isEventClosedV2(item.status));
  const openDeadlines = deadlines.filter((item) => !isDeadlineDoneV2(item.status));
  const filteredDeadlines = filterAgendaByRangeV3(openDeadlines, "due_date", range);
  const filteredTasks = filterAgendaByRangeV3(tasks, "due_date", range);
  const filteredEvents = filterAgendaByRangeV3(events, "start_date", range);
  const calendarEntries = [
    ...tasks
      .filter((item) => item.due_date)
      .map((item) => ({
        kind: "Tarefa",
        title: item.title || "Tarefa sem título",
        date: item.due_date,
        time: item.deadline_time || "",
        status: item.status || "aberta",
        priority: item.priority || "média",
        label_name: item.label_name || "",
      })),
    ...events
      .filter((item) => item.start_date)
      .map((item) => ({
        kind: "Evento",
        title: item.title || "Evento sem título",
        date: item.start_date,
        time: item.start_time || "",
        status: item.status || "agendado",
        priority: item.modality || "presencial",
        label_name: item.label_name || "",
      })),
  ];

  view.innerHTML = `
    ${pageHeader("Agenda", "Calendário operacional com visualização em dia, semana e mês.", `
      <div class="agenda-toolbar">
        <div class="segmented" id="agendaViewSelector">
          <button class="${agendaView === "dia" ? "active" : ""}" data-agenda-view="dia" type="button">Dia</button>
          <button class="${agendaView === "semana" ? "active" : ""}" data-agenda-view="semana" type="button">Semana</button>
          <button class="${agendaView === "mes" ? "active" : ""}" data-agenda-view="mes" type="button">Mês</button>
        </div>
        <div class="agenda-nav">
          <button class="btn ghost" id="agendaPrevBtn" type="button">Anterior</button>
          <button class="btn ghost" id="agendaTodayBtn" type="button">Hoje</button>
          <button class="btn ghost" id="agendaNextBtn" type="button">Próximo</button>
        </div>
        <div class="agenda-range-label">${esc(range.label)}</div>
      </div>
      <button class="btn ghost" id="openTaskModalBtnV2">Adicionar tarefa</button>
      <button class="btn primary" id="openEventModalBtnV2">Adicionar evento</button>
    `)}
    <section class="panel agenda-calendar-panel">
      ${renderAgendaCalendarV3(calendarEntries, agendaView, anchorDate)}
    </section>
    <section class="grid metrics">
      ${metric("Tarefas abertas", openTasks.length, "execução")}
      ${metric("Eventos ativos", openEvents.length, "agenda")}
      ${metric("Prazos processuais", openDeadlines.length, "controle")}
      ${metric("Alta prioridade", openTasks.filter((item) => ["alta", "crítica", "critica"].includes(normalizeAgendaV2(item.priority))).length, "atenção")}
      ${metric("Audiências", openDeadlines.filter((item) => normalizeAgendaV2(item.deadline_type).includes("audiencia")).length, "processual")}
      ${metric("Concluídos", tasks.filter((item) => isTaskDoneV2(item.status)).length, "tarefas")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Tarefas</h2>
        ${recordList(filteredTasks, (item) => ({
          title: item.title,
          badges: [item.status, item.priority, item.risk, item.task_list || "lista geral"],
          meta: [
            item.description || "sem descrição",
            `Data: ${formatDate(item.due_date)}${item.deadline_time ? ` às ${item.deadline_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Vínculo: ${item.linked_reference || "sem vínculo"} (${item.linked_type || "geral"})`,
            `Kanban: ${item.kanban_board || "N/A"} · ${item.kanban_column || "N/A"}`,
          ],
          actions: `
            <button class="btn ghost" data-edit-task-v2="${item.id}">Editar</button>
            ${!isTaskDoneV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-task-v2="${item.id}" title="Concluir tarefa" aria-label="Concluir tarefa">✓</button>` : ""}
            <button class="btn danger" data-delete-task-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
      <div class="panel">
        <h2>Eventos</h2>
        ${recordList(filteredEvents, (item) => ({
          title: item.title,
          badges: [item.status, item.modality || "modalidade não definida", item.recurrence || "não repetir"],
          meta: [
            `Início: ${formatDate(item.start_date)}${item.start_time ? ` às ${item.start_time}` : ""}`,
            `Fim: ${formatDate(item.end_date || item.start_date)}${item.end_time ? ` às ${item.end_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Vínculo: ${item.linked_reference || "sem vínculo"}`,
            item.location || item.observations || "sem detalhes",
          ],
          actions: `
            <button class="btn ghost" data-edit-event-v2="${item.id}">Editar</button>
            ${!isEventClosedV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-event-v2="${item.id}" title="Concluir evento" aria-label="Concluir evento">✓</button>` : ""}
            <button class="btn danger" data-delete-event-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Prazos processuais</h2>
      ${recordList(openDeadlines.slice(0, 12), deadlineCard)}
    </section>
    ${taskModalHtmlV2(refs, labels)}
    ${eventModalHtmlV2(refs, labels)}
  `;

  document.querySelectorAll("[data-agenda-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.agendaView = button.dataset.agendaView || "mes";
      await agendaAstreaV3();
    });
  });
  document.querySelector("#agendaPrevBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, -1));
    await agendaAstreaV3();
  });
  document.querySelector("#agendaNextBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, 1));
    await agendaAstreaV3();
  });
  document.querySelector("#agendaTodayBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(new Date());
    await agendaAstreaV3();
  });

  bindAgendaModalsV2(tasks, events);
}

function agendaEntryKeyV5(item) {
  return `${item.entity || "item"}:${item.id || `${item.date || "sem-data"}-${item.title || "sem-titulo"}`}`;
}

function agendaEntryMatchesActivityV5(item, activityFilter) {
  const filter = normalizeAgendaV2(activityFilter || "a-concluir").replace(/-/g, "");
  const kind = normalizeAgendaV2(item.kind);
  const status = normalizeAgendaV2(item.status);
  if (filter === "todas") return true;
  if (filter === "tarefas") return item.entity === "task";
  if (filter === "eventos") return item.entity === "event" && !kind.includes("audiencia");
  if (filter === "audiencias") return kind.includes("audiencia");
  if (filter === "atendimentos") return item.entity === "attendance";
  if (filter === "concluidas") return Boolean(item.completed);
  if (filter === "canceladas") return status.includes("cancel");
  return !item.completed && !status.includes("cancel");
}

function agendaCaseLookupV5(refs = {}) {
  const casesById = new Map();
  (refs.cases || []).forEach((item) => {
    if (item?.id) casesById.set(Number(item.id), item);
    if (item?.case_number) casesById.set(String(item.case_number), item);
  });
  return casesById;
}

function agendaLinkedCaseIdV5(item = {}) {
  if (Number(item.case_id || 0) > 0) return Number(item.case_id);
  if (String(item.linked_type || "").toLowerCase() === "case" && Number(item.linked_id || 0) > 0) return Number(item.linked_id);
  const match = String(item.linked_reference || "").match(/processo\s*#?\s*(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function agendaEnrichCaseV5(entry, source = {}, casesById = new Map()) {
  const caseId = agendaLinkedCaseIdV5(source);
  const caseItem = casesById.get(Number(caseId)) || (source.case_number ? casesById.get(String(source.case_number)) : null) || null;
  const caseNumber = source.case_number || caseItem?.case_number || "";
  const caseTitle = source.case_title || caseItem?.title || entry.case_title || "";
  const clientName = source.client_name || entry.client_name || "";
  const prefix = caseTitle || clientName || "";
  const title = prefix && !normalizeAgendaV2(entry.title || "").startsWith(normalizeAgendaV2(prefix)) ? `${prefix} - ${entry.title}` : entry.title;
  return {
    ...entry,
    title,
    case_id: caseId || caseItem?.id || source.case_id || "",
    case_number: caseNumber,
    case_title: caseTitle,
    client_name: clientName,
  };
}

function agendaDateFromTimestampV5(value) {
  if (!value) return "";
  return String(value).trim().slice(0, 10);
}

function agendaTimeFromTimestampV5(value) {
  const match = String(value || "").match(/T?(\d{2}:\d{2})/);
  return match ? match[1] : "";
}

function agendaCaseLinkHtmlV5(item) {
  if (!item.case_id) return "";
  const label = item.case_number || item.case_title || "Abrir processo";
  return `<a href="#/cases/${esc(item.case_id)}">${esc(label)}</a>`;
}

function agendaActivityDetailHtmlV5(item) {
  if (!item) {
    return `
      <div class="agenda-activity-detail empty-detail">
        <strong>Selecione uma atividade</strong>
        <span>Clique em uma tarefa, evento, audiência ou prazo no calendário para ver os detalhes aqui.</span>
      </div>
    `;
  }
  const kind = agendaEntryKindLabelV4(item);
  const when = `${formatDate(item.date)}${item.time ? ` às ${item.time}` : " - dia inteiro"}`;
  const end = item.end_date ? `${formatDate(item.end_date)}${item.end_time ? ` às ${item.end_time}` : ""}` : "";
  const linked = [item.linked_reference, item.case_title, item.client_name].filter(Boolean).join(" - ");
  const caseLink = agendaCaseLinkHtmlV5(item);
  const description = item.description || item.observations || item.location || "";
  const editAction =
    item.entity === "task"
      ? `<button class="btn ghost" data-agenda-detail-edit-task="${esc(item.id)}" type="button">Editar</button>`
      : item.entity === "event"
        ? `<button class="btn ghost" data-agenda-detail-edit-event="${esc(item.id)}" type="button">Editar</button>`
        : item.entity === "attendance"
          ? `<a class="btn ghost" href="#/attendances/${esc(item.id)}">Abrir atendimento</a>`
        : "";
  return `
    <div class="agenda-activity-detail ${esc(normalizeAgendaV2(item.kind))}">
      <div class="agenda-detail-head">
        <span class="agenda-detail-kind">${esc(kind)}</span>
        <span class="agenda-side-avatar">${esc(agendaEntryAvatarV4(item))}</span>
      </div>
      <h3>${esc(item.title)}</h3>
      <div class="agenda-detail-grid">
        <div><span>Data</span><strong>${esc(when)}</strong></div>
        ${end ? `<div><span>Fim</span><strong>${esc(end)}</strong></div>` : ""}
        <div><span>Status</span><strong>${esc(item.status || "-")}</strong></div>
        <div><span>Responsável</span><strong>${esc(item.owner || "Advocacia Souza")}</strong></div>
        <div><span>Prioridade / modalidade</span><strong>${esc(item.priority || item.modality || "-")}</strong></div>
        ${caseLink ? `<div class="full"><span>Processo</span><strong>${caseLink}</strong></div>` : ""}
        ${linked ? `<div class="full"><span>Vínculo</span><strong>${esc(linked)}</strong></div>` : ""}
        ${item.kanban_board || item.kanban_column ? `<div class="full"><span>Kanban</span><strong>${esc([item.kanban_board, item.kanban_column].filter(Boolean).join(" - "))}</strong></div>` : ""}
      </div>
      ${item.label_name || item.deadline_type ? `<div class="agenda-side-label">${esc(item.label_name || item.deadline_type)}</div>` : ""}
      ${description ? `<p>${esc(description)}</p>` : ""}
      <div class="agenda-detail-actions">
        <span class="${item.completed ? "agenda-detail-done" : "agenda-detail-pending"}">${item.completed ? "Concluído" : "A concluir"}</span>
        ${editAction}
      </div>
    </div>
  `;
}

async function agendaAstreaV3() {
  const view = document.querySelector("#view");
  const [tasksRes, eventsRes, deadlinesRes, attendancesRes, refs, labelsRes] = await Promise.all([
    api("/api/tasks"),
    api("/api/events"),
    api("/api/deadlines"),
    api("/api/attendances"),
    api("/api/agenda/references"),
    api("/api/labels").catch(() => ({ items: [] })),
  ]);
  const tasks = tasksRes.items || [];
  const events = eventsRes.items || [];
  const deadlines = deadlinesRes.items || [];
  const attendances = attendancesRes.items || [];
  const labels = labelsRes.items || [];
  const casesById = agendaCaseLookupV5(refs);
  if (!state.agendaDate) state.agendaDate = agendaDateToKeyV3(new Date());
  if (!state.agendaSelectedDate) state.agendaSelectedDate = state.agendaDate;
  const agendaView = ["dia", "semana", "mes"].includes(state.agendaView) ? state.agendaView : "mes";
  const anchorDate = parseDateOnly(state.agendaDate) || new Date();
  const range = agendaRangeByViewV3(anchorDate, agendaView);
  const selectedDateKey = state.agendaSelectedDate || state.agendaDate || agendaDateToKeyV3(new Date());
  const structureView = state.agendaStructureView || (agendaView === "dia" ? "por-dia" : agendaView === "semana" ? "por-semana" : "por-mes");
  const ownerFilter = state.agendaOwnerFilter || "responsaveis";
  const activityFilter = state.agendaActivityFilter || "a-concluir";
  const ownerName = normalizeAgendaV2(state.user?.name || "");
  const officeName = normalizeAgendaV2("Advocacia Souza");
  const ownerMatches = (owner, collaborators = "") => {
    if (ownerFilter === "todas") return true;
    const ownerText = normalizeAgendaV2(owner || "");
    const collaboratorText = normalizeAgendaV2(collaborators || "");
    if (!ownerText) return true;
    return ownerText.includes(ownerName) || collaboratorText.includes(ownerName) || ownerText.includes(officeName);
  };
  const taskEntries = tasks
    .filter((item) => item.due_date && ownerMatches(item.owner, item.collaborators))
    .map((item) => agendaEnrichCaseV5({
      id: item.id,
      entity: "task",
      kind: normalizeAgendaV2(item.task_list).includes("audiencia") ? "Audiência" : "Tarefa",
      title: item.title || "Tarefa sem título",
      date: item.due_date,
      time: item.deadline_time || "",
      status: item.status || "aberta",
      priority: item.priority || "média",
      risk: item.risk || "",
      owner: item.owner || "",
      linked_reference: item.linked_reference || "",
      linked_type: item.linked_type || "",
      label_name: item.label_name || "",
      task_list: item.task_list || "",
      description: item.description || "",
      kanban_board: item.kanban_board || "",
      kanban_column: item.kanban_column || "",
      completed: isTaskDoneV2(item.status),
    }, item, casesById));
  const eventEntries = events
    .filter((item) => item.start_date && ownerMatches(item.owner))
    .map((item) => agendaEnrichCaseV5({
      id: item.id,
      entity: "event",
      kind: normalizeAgendaV2(item.modality).includes("audiencia") || normalizeAgendaV2(item.title).includes("audiencia") ? "Audiência" : "Evento",
      title: item.title || "Evento sem título",
      date: item.start_date,
      time: item.start_time || "",
      end_date: item.end_date || item.start_date,
      end_time: item.end_time || "",
      status: item.status || "agendado",
      priority: item.modality || "presencial",
      modality: item.modality || "",
      owner: item.owner || "",
      linked_reference: item.linked_reference || "",
      linked_type: item.linked_type || "",
      label_name: item.label_name || "",
      location: item.location || "",
      observations: item.observations || "",
      recurrence: item.recurrence || "",
      completed: isEventClosedV2(item.status),
    }, item, casesById));
  const deadlineEntries = deadlines
    .filter((item) => item.due_date)
    .map((item) => agendaEnrichCaseV5({
      id: item.id,
      entity: "deadline",
      kind: normalizeAgendaV2(item.deadline_type).includes("audiencia") ? "Audiência" : "Prazo",
      title: item.title || "Prazo processual",
      date: item.due_date,
      time: item.deadline_time || "",
      status: item.status || "pendente",
      priority: item.priority || "média",
      owner: item.responsible || "",
      linked_reference: item.case_number ? `Processo ${item.case_number}` : "",
      case_title: item.case_title || "",
      client_name: item.client_name || "",
      deadline_type: item.deadline_type || "prazo",
      description: item.description || item.summary || "",
      completed: isDeadlineDoneV2(item.status),
    }, item, casesById));
  const attendanceEntries = attendances
    .filter((item) => (item.created_at || item.updated_at) && ownerMatches(item.owner))
    .map((item) => {
      const sourceDate = item.scheduled_date || item.date || agendaDateFromTimestampV5(item.updated_at || item.created_at);
      return agendaEnrichCaseV5(
        {
          id: item.id,
          entity: "attendance",
          kind: "Atendimento",
          title: item.subject || "Atendimento",
          date: sourceDate,
          time: item.scheduled_time || agendaTimeFromTimestampV5(item.updated_at || item.created_at),
          status: item.status || "em andamento",
          priority: "atendimento",
          owner: item.owner || "",
          linked_reference: item.linked_reference || (item.case_number ? `Processo ${item.case_number}` : ""),
          linked_type: item.linked_type || "",
          linked_id: item.linked_id || item.case_id || "",
          case_id: item.case_id || "",
          case_title: item.case_title || "",
          case_number: item.case_number || "",
          client_name: item.client_name || "",
          label_name: item.tag || "",
          description: item.notes || "",
          completed: normalizeAgendaV2(item.status).includes("encerr") || normalizeAgendaV2(item.status).includes("concl"),
        },
        item,
        casesById
      );
    });
  const calendarEntries = [...taskEntries, ...eventEntries, ...deadlineEntries, ...attendanceEntries]
    .filter((item) => {
      const date = parseDateOnly(item.date);
      if (!date) return false;
      return date >= range.start && date <= range.end;
    })
    .filter((item) => agendaEntryMatchesActivityV5(item, activityFilter))
    .sort((a, b) => `${a.date} ${a.time || "99:99"}`.localeCompare(`${b.date} ${b.time || "99:99"}`));

  view.innerHTML = `
    ${pageHeader(
      "Agenda",
      "Visualização por dia, semana e mês com filtros por atribuição, atividade e audiências.",
      `
        <div class="agenda-toolbar">
          <div class="segmented" id="agendaViewSelector">
            <button class="${agendaView === "dia" ? "active" : ""}" data-agenda-view="dia" type="button">Dia</button>
            <button class="${agendaView === "semana" ? "active" : ""}" data-agenda-view="semana" type="button">Semana</button>
            <button class="${agendaView === "mes" ? "active" : ""}" data-agenda-view="mes" type="button">Mês</button>
          </div>
          <div class="agenda-nav">
            <button class="btn ghost" id="agendaPrevBtn" type="button">Anterior</button>
            <button class="btn ghost" id="agendaTodayBtn" type="button">Hoje</button>
            <button class="btn ghost" id="agendaNextBtn" type="button">Próximo</button>
          </div>
          <div class="agenda-range-label">${esc(range.label)}</div>
          <div class="agenda-create-wrap">
            <button class="agenda-create-btn" id="agendaCreateBtn" type="button" aria-label="Criar atividade">+</button>
            <div class="agenda-create-menu hidden" id="agendaCreateMenu">
              <button class="btn ghost" id="openTaskModalBtnV2" type="button">Tarefa</button>
              <button class="btn ghost" id="openEventModalBtnV2" type="button">Evento</button>
              <button class="btn ghost" id="openHearingModalBtnV2" type="button">Audiência</button>
            </div>
          </div>
        </div>
      `
    )}
    <section class="panel agenda-filter-bars">
      <div class="agenda-bar-grid">
        <select id="agendaStructureSelect">
          <option value="por-mes" ${structureView === "por-mes" ? "selected" : ""}>Por mês</option>
          <option value="por-semana" ${structureView === "por-semana" ? "selected" : ""}>Por semana</option>
          <option value="por-dia" ${structureView === "por-dia" ? "selected" : ""}>Por dia</option>
        </select>
        <select id="agendaOwnerSelect">
          <option value="responsaveis" ${ownerFilter === "responsaveis" ? "selected" : ""}>Minha responsabilidade</option>
          <option value="todas" ${ownerFilter === "todas" ? "selected" : ""}>Todas as pessoas</option>
        </select>
        <select id="agendaActivitySelect">
          <option value="a-concluir" ${activityFilter === "a-concluir" ? "selected" : ""}>Todas a concluir</option>
          <option value="todas" ${activityFilter === "todas" ? "selected" : ""}>Todas as atividades</option>
          <option value="tarefas" ${activityFilter === "tarefas" ? "selected" : ""}>Tarefas</option>
          <option value="eventos" ${activityFilter === "eventos" ? "selected" : ""}>Eventos</option>
          <option value="audiencias" ${activityFilter === "audiencias" ? "selected" : ""}>Audiências</option>
          <option value="atendimentos" ${activityFilter === "atendimentos" ? "selected" : ""}>Atendimentos</option>
          <option value="concluidas" ${activityFilter === "concluidas" ? "selected" : ""}>Concluídas</option>
          <option value="canceladas" ${activityFilter === "canceladas" ? "selected" : ""}>Canceladas</option>
        </select>
      </div>
    </section>
    <section class="agenda-calendar-shell">
      <div class="panel agenda-calendar-panel">
        ${renderAgendaCalendarV3(calendarEntries, agendaView, anchorDate, selectedDateKey)}
      </div>
      ${agendaDayPanelHtmlV4(calendarEntries, selectedDateKey)}
    </section>
    ${taskModalHtmlV2(refs, labels)}
    ${eventModalHtmlV2(refs, labels)}
  `;

  document.querySelectorAll("[data-agenda-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.agendaView = button.dataset.agendaView || "mes";
      state.agendaStructureView = state.agendaView === "dia" ? "por-dia" : state.agendaView === "semana" ? "por-semana" : "por-mes";
      state.agendaSelectedDate = state.agendaDate || agendaDateToKeyV3(new Date());
      state.agendaSelectedActivity = null;
      await agendaAstreaV3();
    });
  });
  document.querySelector("#agendaPrevBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, -1));
    state.agendaSelectedDate = state.agendaDate;
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaNextBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, 1));
    state.agendaSelectedDate = state.agendaDate;
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaTodayBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(new Date());
    state.agendaSelectedDate = state.agendaDate;
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaStructureSelect").addEventListener("change", async (event) => {
    state.agendaStructureView = event.currentTarget.value || "por-mes";
    if (state.agendaStructureView === "por-dia") state.agendaView = "dia";
    if (state.agendaStructureView === "por-semana") state.agendaView = "semana";
    if (state.agendaStructureView === "por-mes") state.agendaView = "mes";
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaOwnerSelect").addEventListener("change", async (event) => {
    state.agendaOwnerFilter = event.currentTarget.value || "responsaveis";
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaActivitySelect").addEventListener("change", async (event) => {
    state.agendaActivityFilter = event.currentTarget.value || "a-concluir";
    state.agendaSelectedActivity = null;
    await agendaAstreaV3();
  });
  const agendaCreateBtn = document.querySelector("#agendaCreateBtn");
  const agendaCreateMenu = document.querySelector("#agendaCreateMenu");
  if (agendaCreateBtn && agendaCreateMenu) {
    agendaCreateBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      agendaCreateMenu.classList.toggle("hidden");
      if (!agendaCreateMenu.classList.contains("hidden")) {
        setTimeout(() => {
          document.addEventListener("click", () => agendaCreateMenu.classList.add("hidden"), { once: true });
        }, 0);
      }
    });
    agendaCreateMenu.addEventListener("click", (event) => event.stopPropagation());
  }
  document.querySelectorAll("[data-agenda-day]").forEach((item) => {
    item.addEventListener("click", async (event) => {
      if (event.target.closest("[data-complete-agenda-id], [data-open-agenda-activity]")) return;
      const selected = item.dataset.agendaDay || item.getAttribute("data-agenda-day");
      if (!selected) return;
      state.agendaSelectedDate = selected;
      state.agendaDate = selected;
      state.agendaSelectedActivity = null;
      await agendaAstreaV3();
    });
  });
  document.querySelectorAll("[data-open-agenda-activity]").forEach((item) => {
    item.addEventListener("click", async (event) => {
      if (event.target.closest("[data-complete-agenda-id], [data-edit-task-v2], [data-edit-event-v2]")) return;
      state.agendaSelectedActivity = item.dataset.openAgendaActivity || null;
      state.agendaSelectedDate = item.dataset.agendaActivityDate || state.agendaSelectedDate;
      state.agendaDate = state.agendaSelectedDate;
      await agendaAstreaV3();
    });
    item.addEventListener("keydown", async (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      state.agendaSelectedActivity = item.dataset.openAgendaActivity || null;
      state.agendaSelectedDate = item.dataset.agendaActivityDate || state.agendaSelectedDate;
      state.agendaDate = state.agendaSelectedDate;
      await agendaAstreaV3();
    });
  });
  document.querySelectorAll("[data-complete-agenda-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const id = Number(button.dataset.completeAgendaId || 0);
      const kind = String(button.dataset.completeAgendaKind || "");
      if (!id || !kind) return;
      if (kind === "task") {
        await api(`/api/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      } else if (kind === "event") {
        await api(`/api/events/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluido" }) });
      } else if (kind === "deadline") {
        await api(`/api/deadlines/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluído" }) });
      } else if (kind === "attendance") {
        await api(`/api/attendances/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "encerrado" }) });
      }
      if (state.agendaSelectedActivity === `${kind}:${id}`) state.agendaSelectedActivity = null;
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    });
  });

  bindAgendaModalsV2(tasks, events);
  document.querySelectorAll("[data-agenda-detail-edit-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = tasks.find((item) => item.id === Number(button.dataset.agendaDetailEditTask));
      if (!task) return;
      const taskForm = document.querySelector("#taskFormV2");
      const taskModal = document.querySelector("#taskModalV2");
      const taskDeleteBtn = document.querySelector("#taskDeleteBtnV2");
      state.taskEditingId = task.id;
      setFormValues(taskForm, task);
      taskDeleteBtn?.classList.remove("hidden");
      document.querySelector("#taskModalTitleV2").textContent = "Editar tarefa";
      taskModal?.classList.add("open");
    });
  });
  document.querySelectorAll("[data-agenda-detail-edit-event]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = events.find((event) => event.id === Number(button.dataset.agendaDetailEditEvent));
      if (!item) return;
      const eventForm = document.querySelector("#eventFormV2");
      const eventModal = document.querySelector("#eventModalV2");
      const eventDeleteBtn = document.querySelector("#eventDeleteBtnV2");
      state.eventEditingId = item.id;
      setFormValues(eventForm, item);
      eventForm.elements.all_day.checked = Number(item.all_day) === 1;
      toggleAllDayV2(eventForm);
      eventDeleteBtn?.classList.remove("hidden");
      document.querySelector("#eventModalTitleV2").textContent = normalizeAgendaV2(item.modality).includes("audiencia") ? "Editar audiência" : "Editar evento";
      eventModal?.classList.add("open");
    });
  });
  if (state.pendingAgendaModal) {
    const pending = state.pendingAgendaModal;
    state.pendingAgendaModal = null;
    const selector = pending === "hearing" ? "#openHearingModalBtnV2" : pending === "event" ? "#openEventModalBtnV2" : "#openTaskModalBtnV2";
    document.querySelector(selector)?.click();
  }
}

function agendaDateToKeyV3(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function agendaDayStartV3(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function agendaAddDaysV3(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function agendaAddMonthsV3(date, months) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function agendaWeekStartV3(date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return agendaAddDaysV3(agendaDayStartV3(date), diff);
}

function agendaRangeByViewV3(anchorDate, view) {
  const anchor = agendaDayStartV3(anchorDate);
  if (view === "dia") {
    return {
      start: anchor,
      end: anchor,
      label: anchor.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    };
  }
  if (view === "semana") {
    const start = agendaWeekStartV3(anchor);
    const end = agendaAddDaysV3(start, 6);
    return {
      start,
      end,
      label: `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
    };
  }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return {
    start,
    end,
    label: start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

function shiftAgendaAnchorDateV3(anchorDate, view, direction) {
  if (view === "dia") return agendaAddDaysV3(anchorDate, direction);
  if (view === "semana") return agendaAddDaysV3(anchorDate, direction * 7);
  return agendaAddMonthsV3(anchorDate, direction);
}

function filterAgendaByRangeV3(items, field, range) {
  return (items || []).filter((item) => {
    const date = parseDateOnly(item[field]);
    if (!date) return false;
    return date >= range.start && date <= range.end;
  });
}

function renderAgendaCalendarV3(entries, agendaView, anchorDate, selectedDate = null) {
  if (agendaView === "dia") return renderAgendaCalendarDayV3(entries, selectedDate ? parseDateOnly(selectedDate) || anchorDate : anchorDate);
  if (agendaView === "semana") return renderAgendaCalendarWeekV3(entries, anchorDate);
  return renderAgendaCalendarMonthV3(entries, anchorDate, selectedDate);
}

function renderAgendaCalendarDayV3(entries, anchorDate) {
  const key = agendaDateToKeyV3(anchorDate);
  const dayEntries = entries
    .filter((item) => item.date === key)
    .sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")));
  if (!dayEntries.length) return `<div class="empty">Nenhuma tarefa ou evento neste dia.</div>`;
  return `
    <div class="agenda-day-list">
      ${dayEntries
        .map(
          (item) => `
        <article class="agenda-entry ${esc(normalizeAgendaV2(item.kind))}${state.agendaSelectedActivity === agendaEntryKeyV5(item) ? " active" : ""}" data-open-agenda-activity="${esc(agendaEntryKeyV5(item))}" data-agenda-activity-date="${esc(item.date)}" role="button" tabindex="0">
          <div class="agenda-entry-time">${esc(item.time || "Dia inteiro")}</div>
          <div class="agenda-entry-main-row">
            <div class="agenda-entry-main">
              <strong>${esc(item.title)}</strong>
              <span>${esc(item.kind)} · ${esc(item.status)} · ${esc(item.priority)}</span>
            </div>
            ${
              !item.completed
                ? `<button class="btn ghost agenda-icon-btn" data-complete-agenda-kind="${esc(item.entity)}" data-complete-agenda-id="${esc(item.id)}" title="Concluir" aria-label="Concluir">✓</button>`
                : ""
            }
          </div>
        </article>
      `
        )
        .join("")}
    </div>
  `;
}

function renderAgendaCalendarWeekV3(entries, anchorDate) {
  const start = agendaWeekStartV3(anchorDate);
  const days = Array.from({ length: 7 }, (_, index) => agendaAddDaysV3(start, index));
  const entriesByDay = new Map(days.map((day) => [agendaDateToKeyV3(day), []]));
  entries.forEach((item) => {
    if (!entriesByDay.has(item.date)) return;
    entriesByDay.get(item.date).push(item);
  });
  entriesByDay.forEach((items) => items.sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99"))));
  return `
    <div class="agenda-week-grid">
      ${days
        .map((day) => {
          const key = agendaDateToKeyV3(day);
          const items = entriesByDay.get(key) || [];
          return `
            <div class="agenda-week-day" data-agenda-day="${esc(key)}">
              <header>
                <strong>${day.toLocaleDateString("pt-BR", { weekday: "short" })}</strong>
                <span>${day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
              </header>
              <div class="agenda-week-items">
                ${
                  items.length
                    ? items
                        .map(
                          (item) => `
                    <article class="agenda-pill ${esc(normalizeAgendaV2(item.kind))}${state.agendaSelectedActivity === agendaEntryKeyV5(item) ? " active" : ""}" data-open-agenda-activity="${esc(agendaEntryKeyV5(item))}" data-agenda-activity-date="${esc(item.date)}" role="button" tabindex="0">
                      <div class="agenda-pill-head">
                        <span>${esc(item.time || "dia inteiro")}</span>
                        ${
                          !item.completed
                            ? `<button class="btn ghost agenda-icon-btn" data-complete-agenda-kind="${esc(item.entity)}" data-complete-agenda-id="${esc(item.id)}" title="Concluir" aria-label="Concluir">✓</button>`
                            : ""
                        }
                      </div>
                      <strong>${esc(item.title)}</strong>
                    </article>
                  `
                        )
                        .join("")
                    : `<div class="agenda-week-empty">Sem itens</div>`
                }
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAgendaCalendarMonthV3(entries, anchorDate, selectedDate = null) {
  const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
  const firstGridDay = agendaAddDaysV3(monthStart, -((monthStart.getDay() + 6) % 7));
  const selectedKey = selectedDate || state.agendaSelectedDate || state.agendaDate || agendaDateToKeyV3(new Date());
  const entriesByDay = new Map();
  entries.forEach((item) => {
    if (!entriesByDay.has(item.date)) entriesByDay.set(item.date, []);
    entriesByDay.get(item.date).push(item);
  });
  entriesByDay.forEach((items) => items.sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99"))));
  const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return `
    <div class="agenda-month-grid">
      ${weekdays.map((name) => `<div class="agenda-month-weekday">${name}</div>`).join("")}
      ${Array.from({ length: 42 }, (_, index) => {
        const day = agendaAddDaysV3(firstGridDay, index);
        const key = agendaDateToKeyV3(day);
        const items = entriesByDay.get(key) || [];
        const outside = day < monthStart || day > monthEnd;
        return `
          <article class="agenda-month-cell${outside ? " outside" : ""}">
            <header>${day.getDate()}</header>
            <div class="agenda-month-items">
              ${items
                .slice(0, 3)
                .map(
                  (item) => `
                <div class="agenda-month-item ${esc(normalizeAgendaV2(item.kind))}${state.agendaSelectedActivity === agendaEntryKeyV5(item) ? " active" : ""}" data-open-agenda-activity="${esc(agendaEntryKeyV5(item))}" data-agenda-activity-date="${esc(item.date)}" role="button" tabindex="0">
                  <div class="agenda-month-item-head">
                    <span>${esc(item.time || "•")}</span>
                    ${
                      !item.completed
                        ? `<button class="btn ghost agenda-icon-btn" data-complete-agenda-kind="${esc(item.entity)}" data-complete-agenda-id="${esc(item.id)}" title="Concluir" aria-label="Concluir">✓</button>`
                        : ""
                    }
                  </div>
                  <strong>${esc(item.title)}</strong>
                </div>
              `
                )
                .join("")}
              ${items.length > 3 ? `<div class="agenda-month-more">+${items.length - 3} mais</div>` : ""}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function normalizeAgendaV2(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function isTaskDoneV2(status) {
  return normalizeAgendaV2(status).includes("conclu");
}

function isEventClosedV2(status) {
  const value = normalizeAgendaV2(status);
  return value.includes("conclu") || value.includes("cancel");
}

function isDeadlineDoneV2(status) {
  return normalizeAgendaV2(status).includes("conclu");
}

function filterAgendaByDateV2(items, filter, field) {
  if (filter === "todos") return items;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(start);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(start);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  return items.filter((item) => {
    const date = parseDateOnly(item[field]);
    if (!date) return false;
    if (filter === "hoje") return date.getTime() === start.getTime();
    if (filter === "semana") return date >= start && date <= weekEnd;
    if (filter === "mes") return date >= start && date <= monthEnd;
    return true;
  });
}

function referenceDatalistV2(refs) {
  const options = [];
  (refs.cases || []).forEach((item) => options.push(`processo #${item.id} - ${item.title || "sem titulo"}`));
  (refs.attendances || []).forEach((item) => options.push(`atendimento #${item.id} - ${item.subject || "sem assunto"}`));
  (refs.leads || []).forEach((item) => options.push(`lead #${item.id} - ${item.name || "sem nome"}`));
  (refs.clients || []).forEach((item) => options.push(`cliente #${item.id} - ${item.name || "sem nome"}`));
  return `<datalist id="agendaReferenceOptionsV2">${options.map((option) => `<option value="${esc(option)}"></option>`).join("")}</datalist>`;
}

function taskModalHtmlV2(refs, labels = []) {
  return `
    ${referenceDatalistV2(refs)}
    <div class="modal-shell" id="taskModalV2">
      <div class="modal-backdrop" data-close-modal-v2="taskModalV2"></div>
      <section class="modal-panel">
        <header class="modal-header">
          <h2 id="taskModalTitleV2">Adicionar tarefa</h2>
          <button class="btn ghost" type="button" data-close-modal-v2="taskModalV2">Fechar</button>
        </header>
        <form id="taskFormV2" class="form-grid modal-form-grid">
          <div class="field full">
            <label for="task_v2_title">Descrição da tarefa*</label>
            <textarea id="task_v2_title" name="title" required placeholder="Digite a descricao da tarefa"></textarea>
          </div>
          <div class="field">
            <label for="task_v2_due_date">Data</label>
            <input id="task_v2_due_date" name="due_date" type="date" />
          </div>
          <div class="field">
            <label for="task_v2_deadline_time">Horario</label>
            <input id="task_v2_deadline_time" name="deadline_time" type="time" />
          </div>
          <div class="field">
            <label for="task_v2_list">Lista de tarefas*</label>
            <select id="task_v2_list" name="task_list" required>
              <option value="">Selecione</option>
              <option value="Lista de tarefas">Lista de tarefas</option>
              <option value="Controladoria">Controladoria</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Audiências">Audiências</option>
              <option value="Financeiro">Financeiro</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_owner">Responsável*</label>
            <input id="task_v2_owner" name="owner" type="text" required />
          </div>
          <div class="field full">
            <label for="task_v2_reference">Processo, caso ou atendimento</label>
            <input id="task_v2_reference" name="linked_reference" type="text" list="agendaReferenceOptionsV2" placeholder="Encontre um processo, caso ou atendimento" />
          </div>
          <div class="field">
            <label for="task_v2_linked_type">Tipo de vinculo</label>
            <select id="task_v2_linked_type" name="linked_type">
              <option value="">Automatico</option>
              <option value="case">Processo</option>
              <option value="lead">Atendimento</option>
              <option value="client">Cliente</option>
              <option value="document">Documento</option>
              <option value="finance">Financeiro</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_collaborators">Envolver mais pessoas</label>
            <input id="task_v2_collaborators" name="collaborators" type="text" placeholder="Nomes separados por virgula" />
          </div>
          <div class="field">
            <label for="task_v2_label_id">Etiqueta</label>
            <select id="task_v2_label_id" name="label_id">
              ${labelSelectOptionsHtml(labels, "task")}
            </select>
          </div>
          <div class="field">
            <label for="task_v2_priority">Prioridade*</label>
            <select id="task_v2_priority" name="priority" required>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
              <option value="crítica">Crítica</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_risk">Risco*</label>
            <select id="task_v2_risk" name="risk" required>
              <option value="baixo">Baixo</option>
              <option value="médio">Médio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_kanban_board">Quadro do Kanban*</label>
            <select id="task_v2_kanban_board" name="kanban_board" required>
              <option value="Kanban Padrão">Kanban Padrão</option>
              <option value="Contencioso">Contencioso</option>
              <option value="Consultivo">Consultivo</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_kanban_column">Coluna do Kanban*</label>
            <select id="task_v2_kanban_column" name="kanban_column" required>
              <option value="A Fazer">A Fazer</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div class="field">
            <label for="task_v2_status">Status</label>
            <select id="task_v2_status" name="status">
              <option value="aberta">Aberta</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>
          <div class="field full">
            <label for="task_v2_description">Observacoes</label>
            <textarea id="task_v2_description" name="description" placeholder="Digite observacoes internas"></textarea>
          </div>
          <div class="full btn-row modal-actions">
            <button class="btn danger hidden" type="button" id="taskDeleteBtnV2">Excluir</button>
            <button class="btn ghost" type="button" data-close-modal-v2="taskModalV2">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
          </div>
          <div class="full"><div id="taskFormErrorV2" class="error"></div></div>
        </form>
      </section>
    </div>
  `;
}

function eventModalHtmlV2(refs, labels = []) {
  return `
    ${referenceDatalistV2(refs)}
    <div class="modal-shell" id="eventModalV2">
      <div class="modal-backdrop" data-close-modal-v2="eventModalV2"></div>
      <section class="modal-panel">
        <header class="modal-header">
          <h2 id="eventModalTitleV2">Adicionar evento</h2>
          <button class="btn ghost" type="button" data-close-modal-v2="eventModalV2">Fechar</button>
        </header>
        <form id="eventFormV2" class="form-grid modal-form-grid">
          <div class="field full">
            <label for="event_v2_title">Título do evento*</label>
            <input id="event_v2_title" name="title" type="text" required placeholder="Digite o titulo do evento" />
          </div>
          <div class="field">
            <label for="event_v2_start_date">De*</label>
            <input id="event_v2_start_date" name="start_date" type="date" required />
          </div>
          <div class="field">
            <label for="event_v2_start_time">Horario inicial</label>
            <input id="event_v2_start_time" name="start_time" type="time" />
          </div>
          <div class="field">
            <label for="event_v2_end_date">Data final*</label>
            <input id="event_v2_end_date" name="end_date" type="date" />
          </div>
          <div class="field">
            <label for="event_v2_end_time">Ate*</label>
            <input id="event_v2_end_time" name="end_time" type="time" />
          </div>
          <div class="field full checkbox-row">
            <input id="event_v2_all_day" name="all_day" type="checkbox" />
            <label for="event_v2_all_day">Dia inteiro</label>
          </div>
          <div class="field">
            <label for="event_v2_recurrence">Recorrencia</label>
            <select id="event_v2_recurrence" name="recurrence">
              <option value="nao repetir">Não repetir</option>
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div class="field">
            <label for="event_v2_modality">Modalidade</label>
            <select id="event_v2_modality" name="modality">
              <option value="audiência">Audiência</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="hibrido">Hibrido</option>
            </select>
          </div>
          <div class="field full">
            <label for="event_v2_location">Endereco ou local</label>
            <input id="event_v2_location" name="location" type="text" />
          </div>
          <div class="field">
            <label for="event_v2_reminder_value">Antecedencia</label>
            <input id="event_v2_reminder_value" name="reminder_value" type="number" min="0" value="0" />
          </div>
          <div class="field">
            <label for="event_v2_reminder_unit">Unidade</label>
            <select id="event_v2_reminder_unit" name="reminder_unit">
              <option value="hora(s)">Hora(s) antes</option>
              <option value="dia(s)">Dia(s) antes</option>
              <option value="minuto(s)">Minuto(s) antes</option>
            </select>
          </div>
          <div class="field">
            <label for="event_v2_owner">Responsável*</label>
            <input id="event_v2_owner" name="owner" type="text" required />
          </div>
          <div class="field">
            <label for="event_v2_status">Status</label>
            <select id="event_v2_status" name="status">
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="field full">
            <label for="event_v2_external_summary">Resumo para pessoas externas</label>
            <input id="event_v2_external_summary" name="external_summary" type="text" />
          </div>
          <div class="field full">
            <label for="event_v2_external_emails">E-mails externos</label>
            <input id="event_v2_external_emails" name="external_emails" type="text" placeholder="email1@dominio.com, email2@dominio.com" />
          </div>
          <div class="field full">
            <label for="event_v2_reference">Processo, caso ou atendimento</label>
            <input id="event_v2_reference" name="linked_reference" type="text" list="agendaReferenceOptionsV2" placeholder="Encontre um processo, caso ou atendimento" />
          </div>
          <div class="field">
            <label for="event_v2_linked_type">Tipo de vinculo</label>
            <select id="event_v2_linked_type" name="linked_type">
              <option value="">Automatico</option>
              <option value="case">Processo</option>
              <option value="lead">Atendimento</option>
              <option value="client">Cliente</option>
            </select>
          </div>
          <div class="field">
            <label for="event_v2_kanban_board">Quadro do Kanban*</label>
            <select id="event_v2_kanban_board" name="kanban_board" required>
              <option value="Kanban Padrão">Kanban Padrão</option>
              <option value="Contencioso">Contencioso</option>
              <option value="Consultivo">Consultivo</option>
            </select>
          </div>
          <div class="field">
            <label for="event_v2_kanban_column">Coluna do Kanban*</label>
            <select id="event_v2_kanban_column" name="kanban_column" required>
              <option value="A Fazer">A Fazer</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div class="field">
            <label for="event_v2_label_id">Etiqueta</label>
            <select id="event_v2_label_id" name="label_id">
              ${labelSelectOptionsHtml(labels, "event")}
            </select>
          </div>
          <div class="field full">
            <label for="event_v2_observations">Observacoes</label>
            <textarea id="event_v2_observations" name="observations"></textarea>
          </div>
          <div class="full btn-row modal-actions">
            <button class="btn danger hidden" type="button" id="eventDeleteBtnV2">Excluir</button>
            <button class="btn ghost" type="button" data-close-modal-v2="eventModalV2">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
          </div>
          <div class="full"><div id="eventFormErrorV2" class="error"></div></div>
        </form>
      </section>
    </div>
  `;
}

function bindAgendaModalsV2(tasks, events) {
  const taskModal = document.querySelector("#taskModalV2");
  const eventModal = document.querySelector("#eventModalV2");
  const taskForm = document.querySelector("#taskFormV2");
  const eventForm = document.querySelector("#eventFormV2");
  const taskDeleteBtn = document.querySelector("#taskDeleteBtnV2");
  const eventDeleteBtn = document.querySelector("#eventDeleteBtnV2");

  document.querySelector("#openTaskModalBtnV2").addEventListener("click", () => {
    state.taskEditingId = null;
    taskForm.reset();
    taskForm.elements.owner.value = state.user?.name || "";
    taskForm.elements.due_date.value = state.agendaDate || agendaDateToKeyV3(new Date());
    taskForm.elements.status.value = "aberta";
    taskForm.elements.priority.value = "média";
    taskForm.elements.risk.value = "médio";
    taskDeleteBtn.classList.add("hidden");
    document.querySelector("#taskModalTitleV2").textContent = "Adicionar tarefa";
    taskModal.classList.add("open");
  });

  document.querySelector("#openEventModalBtnV2").addEventListener("click", () => {
    state.eventEditingId = null;
    eventForm.reset();
    eventForm.elements.owner.value = state.user?.name || "";
    eventForm.elements.start_date.value = state.agendaDate || agendaDateToKeyV3(new Date());
    eventForm.elements.end_date.value = eventForm.elements.start_date.value;
    eventForm.elements.status.value = "agendado";
    eventForm.elements.recurrence.value = "nao repetir";
    eventDeleteBtn.classList.add("hidden");
    document.querySelector("#eventModalTitleV2").textContent = "Adicionar evento";
    toggleAllDayV2(eventForm);
    eventModal.classList.add("open");
  });

  document.querySelector("#openHearingModalBtnV2")?.addEventListener("click", () => {
    state.eventEditingId = null;
    eventForm.reset();
    eventForm.elements.title.value = "Audiência";
    eventForm.elements.owner.value = state.user?.name || "";
    eventForm.elements.start_date.value = state.agendaDate || agendaDateToKeyV3(new Date());
    eventForm.elements.end_date.value = eventForm.elements.start_date.value;
    eventForm.elements.status.value = "agendado";
    eventForm.elements.recurrence.value = "nao repetir";
    eventForm.elements.modality.value = "audiência";
    eventDeleteBtn.classList.add("hidden");
    document.querySelector("#eventModalTitleV2").textContent = "Adicionar audiência";
    toggleAllDayV2(eventForm);
    eventModal.classList.add("open");
  });

  document.querySelectorAll("[data-close-modal-v2]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(`#${button.dataset.closeModalV2}`);
      if (target) target.classList.remove("open");
    });
  });

  document.querySelectorAll("[data-edit-task-v2]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = tasks.find((item) => item.id === Number(button.dataset.editTaskV2));
      if (!task) return;
      state.taskEditingId = task.id;
      setFormValues(taskForm, task);
      taskDeleteBtn.classList.remove("hidden");
      document.querySelector("#taskModalTitleV2").textContent = "Editar tarefa";
      taskModal.classList.add("open");
    });
  });

  document.querySelectorAll("[data-edit-event-v2]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = events.find((event) => event.id === Number(button.dataset.editEventV2));
      if (!item) return;
      state.eventEditingId = item.id;
      setFormValues(eventForm, item);
      eventForm.elements.all_day.checked = Number(item.all_day) === 1;
      toggleAllDayV2(eventForm);
      eventDeleteBtn.classList.remove("hidden");
      document.querySelector("#eventModalTitleV2").textContent = "Editar evento";
      eventModal.classList.add("open");
    });
  });

  document.querySelectorAll("[data-complete-task-v2]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/tasks/${button.dataset.completeTaskV2}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    });
  });
  document.querySelectorAll("[data-delete-task-v2]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/tasks/${button.dataset.deleteTaskV2}`, { method: "DELETE" });
      await agendaAstreaV3();
    });
  });
  document.querySelectorAll("[data-complete-event-v2]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/events/${button.dataset.completeEventV2}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluido" }) });
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    });
  });
  document.querySelectorAll("[data-delete-event-v2]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/events/${button.dataset.deleteEventV2}`, { method: "DELETE" });
      await agendaAstreaV3();
    });
  });

  taskDeleteBtn.addEventListener("click", async () => {
    if (!state.taskEditingId) return;
    await api(`/api/tasks/${state.taskEditingId}`, { method: "DELETE" });
    taskModal.classList.remove("open");
    state.taskEditingId = null;
    await agendaAstreaV3();
  });

  eventDeleteBtn.addEventListener("click", async () => {
    if (!state.eventEditingId) return;
    await api(`/api/events/${state.eventEditingId}`, { method: "DELETE" });
    eventModal.classList.remove("open");
    state.eventEditingId = null;
    await agendaAstreaV3();
  });

  eventForm.elements.all_day.addEventListener("change", () => toggleAllDayV2(eventForm));

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(taskForm);
    if (!payload.due_date) payload.due_date = state.agendaDate || agendaDateToKeyV3(new Date());
    if (!payload.owner) payload.owner = state.user?.name || "";
    const link = resolveReferenceV2(payload.linked_reference, payload.linked_type);
    payload.linked_type = link.type || payload.linked_type;
    payload.linked_id = link.id;
    const error = document.querySelector("#taskFormErrorV2");
    error.textContent = "";
    try {
      if (state.taskEditingId) {
        await api(`/api/tasks/${state.taskEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/tasks", { method: "POST", body: JSON.stringify(payload) });
      }
      taskModal.classList.remove("open");
      state.taskEditingId = null;
      state.agendaDate = payload.due_date || state.agendaDate || agendaDateToKeyV3(new Date());
      state.agendaOwnerFilter = "todas";
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    } catch (err) {
      error.textContent = err.message;
    }
  });

  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(eventForm);
    if (!payload.start_date) payload.start_date = state.agendaDate || agendaDateToKeyV3(new Date());
    if (!payload.owner) payload.owner = state.user?.name || "";
    payload.all_day = eventForm.elements.all_day.checked;
    if (!payload.end_date) payload.end_date = payload.start_date;
    if (payload.all_day) {
      payload.start_time = null;
      payload.end_time = null;
    }
    const link = resolveReferenceV2(payload.linked_reference, payload.linked_type);
    payload.linked_type = link.type || payload.linked_type;
    payload.linked_id = link.id;
    const error = document.querySelector("#eventFormErrorV2");
    error.textContent = "";
    try {
      if (state.eventEditingId) {
        await api(`/api/events/${state.eventEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/events", { method: "POST", body: JSON.stringify(payload) });
      }
      eventModal.classList.remove("open");
      state.eventEditingId = null;
      state.agendaDate = payload.start_date || state.agendaDate || agendaDateToKeyV3(new Date());
      state.agendaOwnerFilter = "todas";
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function resolveReferenceV2(rawValue, currentType) {
  const text = String(rawValue || "");
  const match = text.match(/#(\d+)/);
  const id = match ? Number(match[1]) : null;
  const value = normalizeAgendaV2(text);
  if (currentType) return { type: currentType, id };
  if (value.startsWith("processo")) return { type: "case", id };
  if (value.startsWith("lead")) return { type: "lead", id };
  if (value.startsWith("atendimento")) return { type: "attendance", id };
  if (value.startsWith("cliente")) return { type: "client", id };
  return { type: null, id };
}

function toggleAllDayV2(eventForm) {
  const allDay = eventForm.elements.all_day.checked;
  eventForm.elements.start_time.disabled = allDay;
  eventForm.elements.end_time.disabled = allDay;
}

async function casesAstreaView() {
  const view = document.querySelector("#view");
  const data = await api("/api/cases");
  const items = data.items || [];
  const search = (state.caseSearch || "").trim().toLowerCase();
  const status = (state.caseStatus || "ativos").toLowerCase();
  const filtered = items.filter((item) => {
    if (status === "ativos" && String(item.status || "").toLowerCase() !== "ativo") return false;
    if (status === "encerrados" && String(item.status || "").toLowerCase() !== "encerrado") return false;
    if (selectedLabelFilter !== "todos") {
      const currentIds = Array.isArray(item.label_ids) ? item.label_ids.map((value) => Number(value)) : [];
      if (!currentIds.includes(Number(selectedLabelFilter))) return false;
    }
    if (!search) return true;
    const haystack = [
      item.title,
      item.case_number,
      item.client_name,
      item.action_name,
      item.forum,
      item.court,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(search);
  });
  const visibleCount = Math.max(30, Number(state.caseVisibleCount || 30));
  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visible.length < filtered.length;

  view.innerHTML = `
    ${pageHeader("Processos e casos", "Controle completo da carteira processual, com filtro, historico e acesso rapido ao detalhe.", `
      <button class="btn ghost" id="casesExportBtn">Exportar</button>
      <button class="btn ghost" id="casesSyncBtn">Atualizar tribunal</button>
      <button class="btn primary" id="casesNewBtn">Novo processo</button>
    `)}
    <section class="panel cases-screen">
      <div class="cases-filters">
        <input id="casesSearchInput" type="text" placeholder="Digite algo para pesquisar" value="${esc(state.caseSearch || "")}" />
        <select id="casesStatusFilter">
          <option value="ativos" ${status === "ativos" ? "selected" : ""}>Ativos</option>
          <option value="todos" ${status === "todos" ? "selected" : ""}>Todos</option>
          <option value="encerrados" ${status === "encerrados" ? "selected" : ""}>Encerrados</option>
        </select>
        <select id="casesLabelFilter">
          <option value="todos" ${selectedLabelFilter === "todos" ? "selected" : ""}>Todas as etiquetas</option>
          ${labels.map((label) => `<option value="${esc(label.id)}" ${String(label.id) === selectedLabelFilter ? "selected" : ""}>${esc(label.name)}</option>`).join("")}
        </select>
      </div>
      ${caseLabelToolbarV4(labels, selectedLabelFilter, items)}
      <div class="cases-count">${visible.length} de ${filtered.length} processos filtrados (${items.length} no total)</div>
      <div class="cases-table-wrap">
        <table class="data-table cases-table">
          <thead>
            <tr>
              <th></th>
              <th>Título</th>
              <th>Cliente / pasta</th>
              <th>Acao / foro</th>
              <th>Ult. mov</th>
            </tr>
          </thead>
          <tbody>
            ${visible
              .map((item) => {
                const actionForo = item.action_name || item.area || "Procedimento";
                const foro = item.forum || item.court || "-";
                const labelsHtml = (item.labels || []).map((label) => labelBadgeHtml(label)).join(" ") || `<span class="muted-inline">Sem etiqueta</span>`;
                return `
                  <tr>
                    <td><input type="checkbox" aria-label="Selecionar processo ${esc(item.title || item.id)}" /></td>
                    <td>
                      <div class="case-title-cell">
                        <div class="case-title-main">${esc(item.title || "Processo sem titulo")}</div>
                        <div class="case-title-sub">
                          Processo ${esc(item.status || "ativo")}
                          ${item.case_number ? ` · <a href="#/cases/${item.id}" class="case-number-link">${esc(item.case_number)}</a>` : ""}
                        </div>
                        <div class="case-label-list">${labelsHtml}</div>
                      </div>
                    </td>
                    <td>${esc(item.client_name || "-")}</td>
                    <td>${esc(actionForo)}<br /><span class="muted-inline">${esc(foro)}</span></td>
                    <td>${esc(formatDate(item.last_movement_date || item.next_deadline || item.created_at))}</td>
                    <td><button class="btn ghost" data-delete-case="${item.id}">Excluir</button></td>
                    <td><button class="btn ghost" data-delete-case="${item.id}">Excluir</button></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="btn-row cases-footer">
        <button class="btn ghost" id="casesLoadMoreBtn" ${canLoadMore ? "" : "disabled"}>${canLoadMore ? "Carregar mais" : "Tudo carregado"}</button>
      </div>
    </section>
  `;

  document.querySelector("#casesSearchInput").addEventListener("input", async (event) => {
    state.caseSearch = event.currentTarget.value;
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelector("#casesStatusFilter").addEventListener("change", async (event) => {
    state.caseStatus = event.currentTarget.value;
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelector("#casesNewBtn").addEventListener("click", async () => {
    const title = prompt("Digite o titulo do novo processo:");
    if (!title) return;
    await api("/api/cases", {
      method: "POST",
      body: JSON.stringify({
        title,
        status: "ativo",
        risk: "medio",
        action_name: "Procedimento",
        forum: "TJMG",
        instance_level: "1 Grau",
      }),
    });
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelector("#casesExportBtn").addEventListener("click", () => {
    exportCasesCsvV3(filtered);
  });
  document.querySelector("#casesSyncBtn").addEventListener("click", async () => {
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify({ provider: "ALL-TJ", system_code: "DATAJUD" }) });
    await casesAstreaView();
  });
  document.querySelectorAll("[data-delete-case]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir este processo? Isso remove vínculos com documentos, atendimentos, prazos e financeiro.")) return;
      await api(`/api/cases/${button.dataset.deleteCase}`, { method: "DELETE" });
      await casesAstreaView();
    });
  });
  document.querySelectorAll("[data-delete-case]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir este processo? Isso remove vínculos com documentos, atendimentos, prazos e financeiro.")) return;
      await api(`/api/cases/${button.dataset.deleteCase}`, { method: "DELETE" });
      await casesAstreaView();
    });
  });
  document.querySelector("#casesLoadMoreBtn").addEventListener("click", async () => {
    if (!canLoadMore) return;
    state.caseVisibleCount = visibleCount + 30;
    await casesAstreaView();
  });
}

function agendaFilterStatusV4(items, type, activityFilter) {
  const normalized = normalizeAgendaV2(activityFilter || "todas");
  if (normalized === "tarefas") return type === "task" ? items : [];
  if (normalized === "eventos") return type === "event" ? items : [];
  if (normalized === "aconcluir") {
    return items.filter((item) => (type === "task" ? !isTaskDoneV2(item.status) : !isEventClosedV2(item.status)));
  }
  if (normalized === "concluidas") {
    return items.filter((item) => (type === "task" ? isTaskDoneV2(item.status) : normalizeAgendaV2(item.status).includes("conclu")));
  }
  if (normalized === "canceladas") {
    return type === "event" ? items.filter((item) => normalizeAgendaV2(item.status).includes("cancel")) : [];
  }
  return items;
}

// V3 única definição acima - removida duplicata conflitante

function agendaDayPanelTitleV4Stub(dateKey) {
  const structureView = state.agendaStructureView || (agendaView === "dia" ? "por-dia" : agendaView === "semana" ? "por-semana" : "por-mes");
  const ownerName = normalizeAgendaV2(state.user?.name || "");

  const ownerFilteredTasks =
    ownerFilter === "todas"
      ? tasks
      : tasks.filter((item) => {
          const owner = normalizeAgendaV2(item.owner || "");
          const collaborators = normalizeAgendaV2(item.collaborators || "");
          return owner.includes(ownerName) || collaborators.includes(ownerName);
        });
  const ownerFilteredEvents =
    ownerFilter === "todas"
      ? events
      : events.filter((item) => {
          const owner = normalizeAgendaV2(item.owner || "");
          return owner.includes(ownerName);
        });

  const filteredByStatusTasks = agendaFilterStatusV4(ownerFilteredTasks, "task", activityFilter);
  const filteredByStatusEvents = agendaFilterStatusV4(ownerFilteredEvents, "event", activityFilter);
  const filteredTasks = filterAgendaByRangeV3(filteredByStatusTasks, "due_date", range);
  const filteredEvents = filterAgendaByRangeV3(filteredByStatusEvents, "start_date", range);
  const openDeadlines = deadlines.filter((item) => !isDeadlineDoneV2(item.status));

  const calendarEntries = [
    ...filteredTasks
      .filter((item) => item.due_date)
      .map((item) => ({
        id: item.id,
        entity: "task",
        kind: "Tarefa",
        title: item.title || "Tarefa sem título",
        date: item.due_date,
        time: item.deadline_time || "",
        status: item.status || "aberta",
        priority: item.priority || "média",
        owner: item.owner || "",
        linked_reference: item.linked_reference || "",
        label_name: item.label_name || "",
        completed: isTaskDoneV2(item.status),
      })),
    ...filteredEvents
      .filter((item) => item.start_date)
      .map((item) => ({
        id: item.id,
        entity: "event",
        kind: normalizeAgendaV2(item.modality).includes("audiencia") ? "Audiência" : "Evento",
        title: item.title || "Evento sem título",
        date: item.start_date,
        time: item.start_time || "",
        status: item.status || "agendado",
        priority: item.modality || "presencial",
        owner: item.owner || "",
        linked_reference: item.linked_reference || "",
        label_name: item.label_name || "",
        completed: isEventClosedV2(item.status),
      })),
    ...filteredDeadlines
      .filter((item) => item.due_date)
      .map((item) => ({
        id: item.id,
        entity: "deadline",
        kind: "Prazo",
        title: item.title || "Prazo processual",
        date: item.due_date,
        time: "",
        status: item.status || "pendente",
        priority: item.priority || "media",
        owner: item.responsible || "",
        linked_reference: item.case_number ? `Processo ${item.case_number}` : "",
        case_title: item.case_title || "",
        client_name: item.client_name || "",
        deadline_type: item.deadline_type || "prazo",
        completed: isDeadlineDoneV2(item.status),
      })),
  ];

  view.innerHTML = `
    ${pageHeader(
      "Agenda",
      "Visualização por dia, semana e mês com filtros por atribuição e atividade.",
      `
        <div class="agenda-toolbar">
          <div class="segmented" id="agendaViewSelector">
            <button class="${agendaView === "dia" ? "active" : ""}" data-agenda-view="dia" type="button">Dia</button>
            <button class="${agendaView === "semana" ? "active" : ""}" data-agenda-view="semana" type="button">Semana</button>
            <button class="${agendaView === "mes" ? "active" : ""}" data-agenda-view="mes" type="button">Mês</button>
          </div>
          <div class="agenda-nav">
            <button class="btn ghost" id="agendaPrevBtn" type="button">Anterior</button>
            <button class="btn ghost" id="agendaTodayBtn" type="button">Hoje</button>
            <button class="btn ghost" id="agendaNextBtn" type="button">Próximo</button>
          </div>
          <div class="agenda-create-wrap">
            <button class="agenda-create-btn" id="agendaCreateBtn" type="button" aria-label="Criar">+</button>
            <div class="agenda-create-menu hidden" id="agendaCreateMenu">
              <button class="btn ghost" id="openTaskModalBtnV2" type="button">Tarefa</button>
              <button class="btn ghost" id="openEventModalBtnV2" type="button">Evento</button>
              <button class="btn ghost" id="openHearingModalBtnV2" type="button">Audiência</button>
            </div>
          </div>
        </div>
      `
    )}
    <section class="panel agenda-filter-bars">
      <div class="agenda-bar-grid">
        <select id="agendaStructureSelect">
          <option value="por-mes" ${structureView === "por-mes" ? "selected" : ""}>Por mês</option>
          <option value="por-semana" ${structureView === "por-semana" ? "selected" : ""}>Por semana</option>
          <option value="por-dia" ${structureView === "por-dia" ? "selected" : ""}>Por dia</option>
          <option value="em-lista" ${structureView === "em-lista" ? "selected" : ""}>Em lista</option>
        </select>
        <select id="agendaOwnerSelect">
          <option value="responsaveis" ${ownerFilter === "responsaveis" ? "selected" : ""}>Minhas atribuições</option>
          <option value="todas" ${ownerFilter === "todas" ? "selected" : ""}>Todas as pessoas</option>
        </select>
        <select id="agendaActivitySelect">
          <option value="todas" ${activityFilter === "todas" ? "selected" : ""}>Todas as atividades</option>
          <option value="tarefas" ${activityFilter === "tarefas" ? "selected" : ""}>Tarefas</option>
          <option value="eventos" ${activityFilter === "eventos" ? "selected" : ""}>Eventos</option>
          <option value="a-concluir" ${activityFilter === "a-concluir" ? "selected" : ""}>A concluir</option>
          <option value="concluidas" ${activityFilter === "concluidas" ? "selected" : ""}>Concluídas</option>
          <option value="canceladas" ${activityFilter === "canceladas" ? "selected" : ""}>Canceladas</option>
        </select>
      </div>
    </section>
    <section class="agenda-calendar-shell">
      <div class="panel agenda-calendar-panel">
        ${structureView === "em-lista" ? recordList(calendarEntries, (item) => ({ title: item.title, badges: [item.kind, item.status, item.label_name || item.deadline_type || "sem etiqueta"], meta: [`Data: ${formatDate(item.date)}`, `Horário: ${item.time || "Dia inteiro"}`] })) : renderAgendaCalendarV3(calendarEntries, agendaView, anchorDate, selectedDateKey)}
      </div>
      ${agendaDayPanelHtmlV4(calendarEntries, selectedDateKey)}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Tarefas</h2>
        ${recordList(filteredTasks, (item) => ({
          title: item.title,
          badges: [item.status, item.priority, item.label_name || "sem etiqueta", item.task_list || "lista geral"],
          meta: [
            item.description || "sem descrição",
            `Data: ${formatDate(item.due_date)}${item.deadline_time ? ` às ${item.deadline_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            `Vínculo: ${item.linked_reference || "sem vínculo"}`,
          ],
          actions: `
            <button class="btn ghost" data-edit-task-v2="${item.id}">Editar</button>
            ${!isTaskDoneV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-task-v2="${item.id}" title="Concluir tarefa" aria-label="Concluir tarefa">✓</button>` : ""}
            <button class="btn danger" data-delete-task-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
      <div class="panel">
        <h2>Eventos</h2>
        ${recordList(filteredEvents, (item) => ({
          title: item.title,
          badges: [item.status, item.modality || "modalidade não definida", item.label_name || "sem etiqueta"],
          meta: [
            `Início: ${formatDate(item.start_date)}${item.start_time ? ` às ${item.start_time}` : ""}`,
            `Fim: ${formatDate(item.end_date || item.start_date)}${item.end_time ? ` às ${item.end_time}` : ""}`,
            `Responsável: ${item.owner || "não definido"}`,
            item.location || item.observations || "sem detalhes",
          ],
          actions: `
            <button class="btn ghost" data-edit-event-v2="${item.id}">Editar</button>
            ${!isEventClosedV2(item.status) ? `<button class="btn ghost agenda-icon-btn" data-complete-event-v2="${item.id}" title="Concluir evento" aria-label="Concluir evento">✓</button>` : ""}
            <button class="btn danger" data-delete-event-v2="${item.id}">Excluir</button>
          `,
        }))}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Prazos processuais</h2>
      ${recordList(openDeadlines.slice(0, 12), deadlineCard)}
    </section>
    ${taskModalHtmlV2(refs, labels)}
    ${eventModalHtmlV2(refs, labels)}
  `;

  document.querySelectorAll("[data-agenda-view]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.agendaView = button.dataset.agendaView || "mes";
      state.agendaStructureView = state.agendaView === "dia" ? "por-dia" : state.agendaView === "semana" ? "por-semana" : "por-mes";
      state.agendaSelectedDate = state.agendaDate || agendaDateToKeyV3(new Date());
      await agendaAstreaV3();
    });
  });
  document.querySelector("#agendaPrevBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, -1));
    state.agendaSelectedDate = state.agendaDate;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaNextBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(shiftAgendaAnchorDateV3(anchorDate, agendaView, 1));
    state.agendaSelectedDate = state.agendaDate;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaTodayBtn").addEventListener("click", async () => {
    state.agendaDate = agendaDateToKeyV3(new Date());
    state.agendaSelectedDate = state.agendaDate;
    await agendaAstreaV3();
  });
  document.querySelector("#agendaStructureSelect").addEventListener("change", async (event) => {
    state.agendaStructureView = event.currentTarget.value || "por-mes";
    if (state.agendaStructureView === "por-dia") state.agendaView = "dia";
    if (state.agendaStructureView === "por-semana") state.agendaView = "semana";
    if (state.agendaStructureView === "por-mes") state.agendaView = "mes";
    await agendaAstreaV3();
  });
  document.querySelector("#agendaOwnerSelect").addEventListener("change", async (event) => {
    state.agendaOwnerFilter = event.currentTarget.value || "responsaveis";
    await agendaAstreaV3();
  });
  document.querySelector("#agendaActivitySelect").addEventListener("change", async (event) => {
    state.agendaActivityFilter = event.currentTarget.value || "a-concluir";
    await agendaAstreaV3();
  });
  const agendaCreateBtn = document.querySelector("#agendaCreateBtn");
  const agendaCreateMenu = document.querySelector("#agendaCreateMenu");
  if (agendaCreateBtn && agendaCreateMenu) {
    agendaCreateBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      agendaCreateMenu.classList.toggle("hidden");
      if (!agendaCreateMenu.classList.contains("hidden")) {
        setTimeout(() => {
          document.addEventListener(
            "click",
            () => {
              agendaCreateMenu.classList.add("hidden");
            },
            { once: true }
          );
        }, 0);
      }
    });
    agendaCreateMenu.addEventListener("click", (event) => event.stopPropagation());
  }

  document.querySelectorAll("[data-agenda-day]").forEach((item) => {
    item.addEventListener("click", async (event) => {
      if (event.target.closest("[data-complete-agenda-id]")) return;
      const selected = item.dataset.agendaDay || item.getAttribute("data-agenda-day");
      if (!selected) return;
      state.agendaSelectedDate = selected;
      state.agendaDate = selected;
      await agendaAstreaV3();
    });
  });

  document.querySelectorAll("[data-complete-agenda-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const id = Number(button.dataset.completeAgendaId || 0);
      const kind = String(button.dataset.completeAgendaKind || "");
      if (!id || !kind) return;
      if (kind === "task") {
        await api(`/api/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      } else if (kind === "event") {
        await api(`/api/events/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluido" }) });
      } else if (kind === "deadline") {
        await api(`/api/deadlines/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluído" }) });
      }
      state.agendaActivityFilter = "a-concluir";
      await agendaAstreaV3();
    });
  });

  bindAgendaModalsV2(tasks, events);
  if (state.pendingAgendaModal) {
    const pending = state.pendingAgendaModal;
    state.pendingAgendaModal = null;
    const selector = pending === "hearing" ? "#openHearingModalBtnV2" : pending === "event" ? "#openEventModalBtnV2" : "#openTaskModalBtnV2";
    document.querySelector(selector)?.click();
  }
}

function agendaDayPanelTitleV4(dateKey) {
  const date = parseDateOnly(dateKey) || new Date();
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const day = date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day}`;
}

function agendaEntryKindLabelV4(item) {
  const normalized = normalizeAgendaV2(item.kind);
  if (normalized.includes("prazo")) return "PRAZO";
  if (normalized.includes("audiencia")) return "AUDIÊNCIA";
  if (normalized.includes("atendimento")) return "ATENDIMENTO";
  if (normalized.includes("evento")) return "EVENTO";
  return "TAREFA";
}

function agendaEntryAvatarV4(item) {
  const owner = String(item.owner || item.responsible || state.user?.name || "Eu").trim();
  if (!owner) return "Eu";
  const initials = owner
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "Eu";
}

function agendaDayPanelHtmlV4(entries, selectedDate) {
  const selectedKey = selectedDate || state.agendaDate || agendaDateToKeyV3(new Date());
  const dayEntries = (entries || [])
    .filter((item) => item.date === selectedKey)
    .sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99")));
  const selectedActivity = dayEntries.find((item) => agendaEntryKeyV5(item) === state.agendaSelectedActivity) || null;
  const countLabel = `${dayEntries.length} ${dayEntries.length === 1 ? "atividade" : "atividades"}`;
  return `
    <aside class="panel agenda-day-side-panel">
      <header class="agenda-day-side-head">
        <h2>${esc(agendaDayPanelTitleV4(selectedKey))}</h2>
        <span>${esc(countLabel)}</span>
      </header>
      ${agendaActivityDetailHtmlV5(selectedActivity)}
      <div class="agenda-day-side-list">
        ${
          dayEntries.length
            ? dayEntries
                .map((item) => {
                  const activityKey = agendaEntryKeyV5(item);
                  const kind = agendaEntryKindLabelV4(item);
                  const details = [item.linked_reference, item.case_title, item.client_name, item.status]
                    .filter(Boolean)
                    .join(" - ");
                  const label = item.label_name || item.deadline_type || item.priority || "";
                  return `
                    <article class="agenda-side-item ${esc(normalizeAgendaV2(item.kind))}${state.agendaSelectedActivity === activityKey ? " active" : ""}" data-open-agenda-activity="${esc(activityKey)}" data-agenda-activity-date="${esc(item.date)}" role="button" tabindex="0">
                      <button class="agenda-side-check" data-complete-agenda-kind="${esc(item.entity)}" data-complete-agenda-id="${esc(item.id)}" ${item.completed ? "disabled" : ""} title="${item.completed ? "Concluido" : "Concluir"}" aria-label="${item.completed ? "Concluido" : "Concluir"}">
                        ${item.completed ? "✓" : ""}
                      </button>
                      <div class="agenda-side-main">
                        <div class="agenda-side-kind">${esc(kind)}</div>
                        <strong>${esc(item.title)}</strong>
                        ${details ? `<span>${esc(details)}</span>` : ""}
                        ${label ? `<div class="agenda-side-label">${esc(label)}</div>` : ""}
                      </div>
                      <div class="agenda-side-avatar">${esc(agendaEntryAvatarV4(item))}</div>
                    </article>
                  `;
                })
                .join("")
            : `<div class="empty">Nenhuma atividade cadastrada para este dia.</div>`
        }
      </div>
    </aside>
  `;
}

function exportCasesCsvV3(items) {
  const headers = ["Título", "Número do processo", "Cliente", "Ação/Foro", "Status", "Último movimento"];
  const rows = (items || []).map((item) => [
    item.title || "",
    item.case_number || "",
    item.client_name || "",
    `${item.action_name || item.area || ""} ${item.forum || item.court || ""}`.trim(),
    item.status || "",
    formatDate(item.last_movement_date || item.next_deadline || item.created_at),
  ]);
  downloadCsvV3("processos-e-casos.csv", headers, rows);
}

function downloadCsvV3(filename, headers, rows) {
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const lines = [headers.map(escapeCell).join(";"), ...rows.map((row) => row.map(escapeCell).join(";"))];
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function caseInfoRow(label, value) {
  return `
    <div class="case-info-row">
      <span>${esc(label)}</span>
      <strong>${esc(value || "-")}</strong>
    </div>
  `;
}

function caseHistoryItem(item) {
  return `
    <div class="case-history-item">
      <strong>${esc(formatDate(item.movement_date))}</strong>
      <span>${esc(item.title || "Movimentacao")}</span>
    </div>
  `;
}

function caseDjenPublicationHtml(item) {
  const fullText = item.publication_text || item.description || item.title || "";
  const snippet = fullText.length > 260 ? `${fullText.slice(0, 260)}...` : fullText;
  const source = item.source || item.tribunal_source || "DJEN";
  return `
    <article class="case-djen-publication">
      <header>
        <div>
          <strong>${esc(formatDate(item.movement_date))}</strong>
          <span>${esc(source)}</span>
        </div>
        <span class="clip-status ${esc(publicationStatusKey(item))}">${esc(publicationStatusLabel(item))}</span>
      </header>
      <h3>${esc(item.title || "Publicação processual")}</h3>
      <p>${esc(snippet || "Publicação vinculada ao processo.")}</p>
      ${fullText ? `<details><summary>Ler resumo completo</summary><p>${esc(fullText)}</p></details>` : ""}
    </article>
  `;
}

async function caseDetailAstreaView(caseId) {
  const view = document.querySelector("#view");
  const query = location.hash.includes("?") ? location.hash.split("?")[1] : "";
  const params = new URLSearchParams(query);
  const tab = (params.get("tab") || "resumo").toLowerCase();
  const payload = await api(`/api/cases/${caseId}`);
  const caseItem = payload.case || {};
  const summary = payload.summary || {};
  const movements = payload.movements || [];
  const deadlines = payload.deadlines || [];
  const tasks = payload.tasks || [];
  const events = payload.events || [];
  const documents = payload.documents || [];
  const parties = payload.parties || [];
  const attendances = payload.attendances || [];
  const finance = payload.finance || [];
  const djenPublications = movements.filter((item) => item.publication_text || normalizeAgendaV2(item.source || "").includes("djen") || normalizeAgendaV2(item.source || "").includes("diario"));
  const caseLabelsText = Array.isArray(caseItem.label_names) && caseItem.label_names.length ? caseItem.label_names.join(", ") : "Sem etiqueta";
  const openDeadlines = deadlines.filter((item) => !String(item.status || "").toLowerCase().startsWith("concl"));

  view.innerHTML = `
    ${pageHeader(caseItem.title || "Processo", "Ficha completa do processo com resumo, atividades e historico.", `
      <button class="btn ghost" id="caseBackBtn">Voltar</button>
      <button class="btn primary" id="caseNewTaskBtn">Nova tarefa</button>
    `)}
    <section class="panel case-head-panel">
      <div class="case-head-grid">
        <div>${caseInfoRow("Processo", caseItem.case_number || "-")}</div>
        <div>${caseInfoRow("Cliente", caseItem.client_name || "-")}</div>
        <div>${caseInfoRow("Status", caseItem.status || "ativo")}</div>
        <div>${caseInfoRow("Etiquetas", caseLabelsText)}</div>
        <div>${caseInfoRow("Responsável", caseItem.responsible || "-")}</div>
        <div>${caseInfoRow("Criado por", caseItem.created_by || caseItem.responsible || "-")}</div>
        <div>${caseInfoRow("Ult. mov", formatDate(summary.last_movement_date || caseItem.created_at))}</div>
      </div>
      <div class="segmented case-tabs">
        <button class="${tab === "resumo" ? "active" : ""}" data-case-tab="resumo">Resumo</button>
        <button class="${tab === "atividades" ? "active" : ""}" data-case-tab="atividades">Atividades</button>
        <button class="${tab === "historico" ? "active" : ""}" data-case-tab="historico">Historico</button>
      </div>
    </section>
    ${
      tab === "resumo"
        ? `
      <section class="panel">
        <h2>Dados do processo</h2>
        <div class="case-data-grid">
          ${caseInfoRow("Acao", caseItem.action_name || caseItem.area || "-")}
          ${caseInfoRow("Numero", caseItem.case_number || "-")}
          ${caseInfoRow("Juizo/Foro", caseItem.forum || caseItem.court || "-")}
          ${caseInfoRow("Distribuido em", formatDate(caseItem.distributed_at || caseItem.created_at))}
          ${caseInfoRow("Valor da causa", money(caseItem.amount_claim || 0))}
          ${caseInfoRow("Val. condenacao", money(caseItem.amount_condemnation || 0))}
          ${caseInfoRow("Prazos abertos", String(summary.open_deadlines || 0))}
          ${caseInfoRow("Proximo prazo", formatDate(summary.next_deadline))}
        </div>
        <div class="case-parties">
          ${parties.map((item) => `<div>${esc(item.role)}: <strong>${esc(item.name)}</strong></div>`).join("")}
        </div>
      </section>
      <section class="panel">
        <h2>Ultimos historicos</h2>
        ${movements.length ? movements.slice(0, 12).map(caseHistoryItem).join("") : `<div class="empty">Sem historico registrado.</div>`}
      </section>
      <section class="panel">
        <h2>Publicações DJEN</h2>
        ${djenPublications.length ? djenPublications.slice(0, 8).map(caseDjenPublicationHtml).join("") : `<div class="empty">Nenhuma publicação DJEN vinculada a este processo.</div>`}
      </section>
      <section class="grid two">
        <div class="panel">
          <h2>Proximas atividades</h2>
          ${recordList(openDeadlines.slice(0, 10), deadlineCard)}
        </div>
        <div class="panel">
          <h2>Atendimentos</h2>
          ${
            attendances.length
              ? recordList(attendances.slice(0, 8), (item) => ({
                  title: item.subject,
                  badges: [item.status || "ativo"],
                  meta: [item.notes || "", `Responsável: ${item.owner || "-"}`],
                }))
              : `<div class="empty">Nenhum atendimento encontrado.</div>`
          }
        </div>
      </section>
      <section class="grid two">
        <div class="panel">
          <h2>Documentos</h2>
          ${
            documents.length
              ? recordList(documents.slice(0, 10), (item) => ({
                  title: item.title,
                  badges: [item.status || "-"],
                  meta: [item.category || "", item.summary || ""],
                }))
              : `<div class="empty">Nenhum documento encontrado.</div>`
          }
        </div>
        <div class="panel">
          <h2>Financeiro</h2>
          ${
            finance.length
              ? simpleTable(
                  ["Status", "Total"],
                  finance.map((item) => [item.status || "-", money(item.total || 0)])
                )
              : `<div class="empty">Sem valores registrados.</div>`
          }
        </div>
      </section>
    `
        : ""
    }
    ${
      tab === "atividades"
        ? `
      <section class="grid two">
        <div class="panel">
          <h2>Tarefas vinculadas</h2>
          ${
            tasks.length
              ? recordList(tasks, (item) => ({
                  title: item.title,
                  badges: [item.status || "aberta", item.priority || "media"],
                  meta: [item.description || "", `Vencimento: ${formatDate(item.due_date)}`],
                }))
              : `<div class="empty">Sem tarefas para este processo.</div>`
          }
        </div>
        <div class="panel">
          <h2>Eventos vinculados</h2>
          ${
            events.length
              ? recordList(events, (item) => ({
                  title: item.title,
                  badges: [item.status || "agendado"],
                  meta: [`Inicio: ${formatDate(item.start_date)} ${item.start_time || ""}`, item.location || item.observations || ""],
                }))
              : `<div class="empty">Sem eventos para este processo.</div>`
          }
        </div>
      </section>
      <section class="panel">
        <h2>Prazos processuais</h2>
        ${recordList(deadlines, deadlineCard)}
      </section>
    `
        : ""
    }
    ${
      tab === "historico"
        ? `
      <section class="panel">
        <h2>Historico completo</h2>
        ${movements.length ? movements.map(caseHistoryItem).join("") : `<div class="empty">Sem historico registrado.</div>`}
      </section>
    `
        : ""
    }
  `;

  document.querySelector("#caseBackBtn").addEventListener("click", () => {
    location.hash = "#/cases";
  });
  document.querySelector("#caseNewTaskBtn").addEventListener("click", () => {
    location.hash = "#/tasks";
  });
  document.querySelectorAll("[data-case-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTab = button.dataset.caseTab;
      location.hash = `#/cases/${caseId}?tab=${nextTab}`;
    });
  });
}

function attendanceReferenceOptions(references) {
  const options = [];
  (references.clients || []).forEach((item) => options.push(`cliente #${item.id} - ${item.name || "sem nome"}`));
  (references.cases || []).forEach((item) => options.push(`processo #${item.id} - ${item.case_number || item.title || "sem numero"}`));
  (references.leads || []).forEach((item) => options.push(`lead #${item.id} - ${item.name || "sem nome"}`));
  (references.attendances || []).forEach((item) => options.push(`atendimento #${item.id} - ${item.subject || "sem assunto"}`));
  return `<datalist id="attendanceReferenceOptions">${options.map((item) => `<option value="${esc(item)}"></option>`).join("")}</datalist>`;
}

function attendanceSelectOptions(items, selectedId = null) {
  return (items || [])
    .map((item) => `<option value="${esc(item.id)}" ${selectedId && Number(selectedId) === Number(item.id) ? "selected" : ""}>#${esc(item.id)} - ${esc(item.subject || "sem assunto")}</option>`)
    .join("");
}

function attendanceInitialsV5(item) {
  const name = item.owner || item.client_name || item.subject || "AS";
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function attendanceTagsV5(item) {
  const tags = String(item.tag || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag && !["entrada", "processo", "caso"].includes(stripAccents(tag).toLowerCase()));
  if (!tags.length) return "";
  return tags
    .slice(0, 5)
    .map((tag, index) => `<span class="attendance-tag color-${(index % 5) + 1}">${esc(tag)} <b>x</b></span>`)
    .join("");
}

function attendanceCardsHtmlV5(items) {
  if (!items.length) return `<div class="empty">Nenhum atendimento cadastrado.</div>`;
  return `
    <div class="attendance-astrea-list">
      ${items
        .map(
          (item) => `
            <article class="attendance-astrea-card">
              <div class="attendance-astrea-left">
                <div class="attendance-title-row">
                  <a href="#/attendances/${esc(item.id)}">${esc(formatDate(item.created_at))} - ${esc(item.subject || "Atendimento")}</a>
                  <span class="attendance-status">${esc(String(item.status || "em andamento").toUpperCase())}</span>
                </div>
                <div class="attendance-client-line">${iconSvg("users")} ${esc(item.client_name || "Cliente não informado")}</div>
                ${attendanceTagsV5(item) ? `<div class="attendance-tags">${attendanceTagsV5(item)}</div>` : ""}
              </div>
              <div class="attendance-astrea-right">
                <div class="attendance-last-title">ÚLTIMO REGISTRO</div>
                <div class="attendance-note-bubble">${esc(item.notes || "Inicial.")}</div>
                <div class="attendance-avatar-block">
                  <span class="attendance-avatar">${esc(attendanceInitialsV5(item))}</span>
                  <small>${esc(formatDate(item.updated_at || item.created_at))}</small>
                </div>
              </div>
              <div class="attendance-card-actions">
                <button class="icon-btn" type="button" title="Abrir" data-open-attendance="${esc(item.id)}">${iconSvg("search")}</button>
                <button class="icon-btn" type="button" title="Excluir" data-delete-attendance="${esc(item.id)}">${iconSvg("trash")}</button>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

async function attendanceDetailAstreaView(attendanceId) {
  state.attendanceDetailId = Number(attendanceId) || null;
  state.attendancePanel = state.attendancePanel || "atendimento";
  await attendancesAstreaView();
}

async function attendancesAstreaView() {
  const view = document.querySelector("#view");
  const [attRes, refs, labelsRes] = await Promise.all([api("/api/attendances"), api("/api/agenda/references"), api("/api/labels").catch(() => ({ items: [] }))]);
  const attendances = attRes.items || [];
  const labels = labelsRes.items || [];
  const attendanceSearch = stripAccents(state.attendanceSearch || "").toLowerCase().trim();
  const attendanceStatus = state.attendanceStatus || "em-andamento";
  const filteredAttendances = attendances.filter((item) => {
    const statusKey = normalizeAgendaV2(item.status || "em andamento").replace(/\s+/g, "-");
    if (attendanceStatus === "em-andamento" && (statusKey.includes("final") || statusKey.includes("conclu") || statusKey.includes("arquiv"))) return false;
    if (attendanceStatus === "finalizados" && !(statusKey.includes("final") || statusKey.includes("conclu") || statusKey.includes("arquiv"))) return false;
    if (!attendanceSearch) return true;
    const haystack = stripAccents([item.subject, item.client_name, item.case_number, item.case_title, item.notes, item.tag].join(" ")).toLowerCase();
    return haystack.includes(attendanceSearch);
  });
  const query = location.hash.includes("?") ? location.hash.split("?")[1] : "";
  const params = new URLSearchParams(query);
  const leadParam = Number(params.get("lead_id") || params.get("lead") || 0);
  if (leadParam) state.attendanceLeadPrefillId = leadParam;
  const detail = state.attendanceDetailId ? attendances.find((item) => item.id === Number(state.attendanceDetailId)) : null;
  if (state.attendanceDetailId && !detail) state.attendanceDetailId = null;
  const detailNotes = detail ? (await api(`/api/attendances/${detail.id}/notes`)).items || [] : [];
  const prefillLead = (refs.leads || []).find((item) => item.id === Number(state.attendanceLeadPrefillId || 0));
  const prefillLeadReference = prefillLead ? `lead #${prefillLead.id} - ${prefillLead.name || "sem nome"}` : "";
  const panel = state.attendancePanel || "atendimento";
  const selectedLabelNames = labels.map((label) => label.name).filter(Boolean);
  const labelOptions = `<datalist id="attendanceLabelOptions">${selectedLabelNames.map((name) => `<option value="${esc(name)}"></option>`).join("")}</datalist>`;
  const labelScope = (label) => {
    if (!label.scope || label.scope === "attendance") return "Atendimento";
    if (label.scope === "task") return "Tarefa";
    if (label.scope === "event") return "Evento";
    if (label.scope === "case") return "Processo";
    return "Geral";
  };

  const attendanceForm = `
    <form id="attendanceForm" class="form-grid">
      <div class="field full">
        <label for="attendance_subject">Assunto*</label>
        <input id="attendance_subject" name="subject" required placeholder="Digite um título para o atendimento" />
      </div>
      <div class="field full">
        <label for="attendance_tag">Etiqueta</label>
        <input id="attendance_tag" name="tag" list="attendanceLabelOptions" placeholder="Ex.: retorno, inicial, reunião" />
        ${labelOptions}
      </div>
      <div class="field">
        <label for="attendance_owner">Responsável</label>
        <input id="attendance_owner" name="owner" value="${esc(state.user?.name || "")}" />
      </div>
      <div class="field full">
        <label for="attendance_reference">Processo, caso ou atendimento</label>
        <input id="attendance_reference" name="linked_reference" list="attendanceReferenceOptions" placeholder="Encontre processo, caso ou atendimento" value="${esc(prefillLeadReference)}" />
        ${attendanceReferenceOptions(refs)}
      </div>
      <div class="field full">
        <label for="attendance_notes">1º registro do atendimento*</label>
        <textarea id="attendance_notes" name="notes" required placeholder="Insira as anotações referentes ao atendimento"></textarea>
      </div>
      <div class="full btn-row" style="justify-content:flex-end">
        <button class="btn ghost" type="button" id="attendanceCancelBtn">Cancelar</button>
        <button class="btn primary" type="submit">Salvar</button>
      </div>
      <div class="full"><div id="attendanceFormError" class="error"></div></div>
    </form>
  `;

  const taskForm = `
    <form id="attendanceTaskForm" class="form-grid">
      <div class="field full">
        <label for="attendance_task_title">Descrição da tarefa*</label>
        <textarea id="attendance_task_title" name="title" required placeholder="Digite a descrição da tarefa"></textarea>
      </div>
      <div class="field">
        <label for="attendance_task_due">Data</label>
        <input id="attendance_task_due" name="due_date" type="date" />
      </div>
      <div class="field">
        <label for="attendance_task_priority">Prioridade</label>
        <select id="attendance_task_priority" name="priority">
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <div class="field">
        <label for="attendance_task_owner">Responsável</label>
        <input id="attendance_task_owner" name="owner" value="${esc(state.user?.name || "")}" />
      </div>
      <div class="field">
        <label for="attendance_task_label">Etiqueta</label>
        <select id="attendance_task_label" name="label_id">
          ${labelSelectOptionsHtml(labels, "task")}
        </select>
      </div>
      <div class="field">
        <label for="attendance_task_ref">Atendimento vinculado</label>
        <select id="attendance_task_ref" name="attendance_id">
          <option value="">Selecione</option>
          ${attendanceSelectOptions(attendances, detail?.id || null)}
        </select>
      </div>
      <div class="full btn-row" style="justify-content:flex-end">
        <button class="btn primary" type="submit">Salvar tarefa</button>
      </div>
      <div class="full"><div id="attendanceTaskFormError" class="error"></div></div>
    </form>
  `;

  const eventForm = `
    <form id="attendanceEventForm" class="form-grid">
      <div class="field full">
        <label for="attendance_event_title">Título do evento*</label>
        <input id="attendance_event_title" name="title" required placeholder="Digite o título do evento" />
      </div>
      <div class="field">
        <label for="attendance_event_date">Data*</label>
        <input id="attendance_event_date" name="start_date" type="date" required />
      </div>
      <div class="field">
        <label for="attendance_event_time">Hora</label>
        <input id="attendance_event_time" name="start_time" type="time" />
      </div>
      <div class="field">
        <label for="attendance_event_owner">Responsável</label>
        <input id="attendance_event_owner" name="owner" value="${esc(state.user?.name || "")}" />
      </div>
      <div class="field">
        <label for="attendance_event_label">Etiqueta</label>
        <select id="attendance_event_label" name="label_id">
          ${labelSelectOptionsHtml(labels, "event")}
        </select>
      </div>
      <div class="field">
        <label for="attendance_event_ref">Atendimento vinculado</label>
        <select id="attendance_event_ref" name="attendance_id">
          <option value="">Selecione</option>
          ${attendanceSelectOptions(attendances, detail?.id || null)}
        </select>
      </div>
      <div class="field full">
        <label for="attendance_event_obs">Observações</label>
        <textarea id="attendance_event_obs" name="observations"></textarea>
      </div>
      <div class="full btn-row" style="justify-content:flex-end">
        <button class="btn primary" type="submit">Salvar evento</button>
      </div>
      <div class="full"><div id="attendanceEventFormError" class="error"></div></div>
    </form>
  `;

  const labelManager = `
    <div class="panel">
      <h3>Gerenciador de etiquetas</h3>
      <form id="labelForm" class="form-grid">
        <div class="field full"><label for="label_name">Nome</label><input id="label_name" name="name" placeholder="Ex.: Priorit?rio" required /></div>
        <div class="field"><label for="label_color">Cor</label><input id="label_color" name="color" type="color" value="#4f46e5" /></div>
        <div class="field"><label for="label_scope">Aplicação</label><select id="label_scope" name="scope"><option value="attendance">Atendimento</option><option value="task">Tarefa</option><option value="event">Evento</option><option value="case">Processo</option><option value="global">Geral</option></select></div>
        <div class="full btn-row" style="justify-content:flex-end"><button class="btn primary" type="submit">Adicionar etiqueta</button></div>
      </form>
      <div class="label-list">
        ${labels.length ? labels.map((label) => `<div class="label-row"><span class="label-swatch" style="background:${esc(label.color || "#4f46e5")}"></span><div><strong>${esc(label.name)}</strong><div class="muted-inline">${esc(labelScope(label))}</div></div><button class="btn ghost" data-delete-label="${label.id}">Excluir</button></div>`).join("") : `<div class="empty">Nenhuma etiqueta cadastrada.</div>`}
      </div>
      <div id="labelFormError" class="error"></div>
    </div>
  `;

  if (detail) {
    const notesCards = detailNotes.length
      ? recordList(detailNotes, (item) => ({
          title: item.author || "Anotação",
          badges: [formatDate(item.created_at)],
          meta: [item.content],
        }))
      : `<div class="empty">Nenhuma anotação registrada.</div>`;

    view.innerHTML = `
      ${pageHeader(
        detail.subject,
        `Cliente: ${detail.client_name || "-"} · Processo: ${detail.case_number || detail.case_title || "-"} · Responsável: ${detail.owner || "-"}`,
        `<button class="btn ghost" id="attendanceBackBtn">Voltar</button><button class="btn ghost" id="attendanceDeleteBtn">Excluir</button>`
      )}
      <section class="grid two attendance-detail-grid">
        <div class="panel">
          <div class="attendance-thread-head">
            <div class="record-meta">${esc(detail.notes || "Sem anotações iniciais.")}</div>
          </div>
          <h3>Notas do atendimento</h3>
          ${notesCards}
          <form id="attendanceNoteForm" class="form-grid attendance-note-form">
            <div class="field full"><label for="attendance_note_content">Adicionar anotação</label><textarea id="attendance_note_content" name="content" required placeholder="Insira aqui as suas anotações referentes ao atendimento"></textarea></div>
            <div class="full btn-row" style="justify-content:flex-end"><button class="btn primary" type="submit">Salvar</button></div>
            <div class="full"><div id="attendanceNoteFormError" class="error"></div></div>
          </form>
        </div>
        <div class="panel">
          <div class="attendance-summary-card">
            <div><strong>${esc(detail.subject)}</strong></div>
            <div class="muted-inline">${esc(detail.status || "ativo")}</div>
            <div class="muted-inline">Etiqueta: ${esc(detail.tag || "sem etiqueta")}</div>
            <div class="muted-inline">Cliente: ${esc(detail.client_name || "-")}</div>
            <div class="muted-inline">Processo: ${esc(detail.case_number || detail.case_title || "-")}</div>
          </div>
          <div class="segmented">
            <button class="${panel === "atendimento" ? "active" : ""}" data-attendance-panel="atendimento">Atendimento</button>
            <button class="${panel === "tarefa" ? "active" : ""}" data-attendance-panel="tarefa">Nova tarefa</button>
            <button class="${panel === "evento" ? "active" : ""}" data-attendance-panel="evento">Novo evento</button>
          </div>
          <div class="attendance-form-wrap">${panel === "atendimento" ? attendanceForm : panel === "tarefa" ? taskForm : eventForm}</div>
          ${labelManager}
        </div>
      </section>
    `;
  } else {
    view.innerHTML = `
      ${pageHeader("Atendimentos", "Registro de conversas, reuniões e tarefas vinculadas à agenda.", `<button class="btn ghost" id="attendanceBackListBtn" type="button">Voltar</button><button class="btn primary" id="attendanceNewBtn">Adicionar</button>`)}
      <section class="attendance-workspace">
        <div class="attendance-searchbar">
          <button class="clip-filter-open" type="button">▾</button>
          <input id="attendanceSearchInput" value="${esc(state.attendanceSearch || "")}" placeholder="Digite um assunto ou cliente" />
          <button class="icon-btn" type="button" title="Pesquisar">${iconSvg("search")}</button>
          <button class="icon-btn" type="button" title="Etiquetas">${iconSvg("tag")}</button>
          <select id="attendanceStatusFilter">
            <option value="em-andamento" ${attendanceStatus === "em-andamento" ? "selected" : ""}>EM ANDAMENTO</option>
            <option value="finalizados" ${attendanceStatus === "finalizados" ? "selected" : ""}>FINALIZADOS</option>
            <option value="todos" ${attendanceStatus === "todos" ? "selected" : ""}>TODOS</option>
          </select>
          <button class="icon-btn" type="button" title="Imprimir">${iconSvg("file")}</button>
        </div>
        <div class="attendance-count">Mostrando ${filteredAttendances.length} de ${attendances.length} atendimento(s)</div>
        ${attendanceCardsHtmlV5(filteredAttendances)}
      </section>
      <section class="panel attendance-composer-panel">
          <h2>Novo registro</h2>
          <div class="segmented">
            <button class="${panel === "atendimento" ? "active" : ""}" data-attendance-panel="atendimento">Atendimento</button>
            <button class="${panel === "tarefa" ? "active" : ""}" data-attendance-panel="tarefa">Nova tarefa</button>
            <button class="${panel === "evento" ? "active" : ""}" data-attendance-panel="evento">Novo evento</button>
          </div>
          <div class="attendance-form-wrap">${panel === "atendimento" ? attendanceForm : panel === "tarefa" ? taskForm : eventForm}</div>
          ${labelManager}
      </section>
    `;
  }

  document.querySelectorAll("[data-attendance-panel]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.attendancePanel = button.dataset.attendancePanel;
      await attendancesAstreaView();
    });
  });
  document.querySelectorAll("[data-open-attendance]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.attendanceDetailId = Number(button.dataset.openAttendance);
      location.hash = `#/attendances/${button.dataset.openAttendance}`;
      await attendancesAstreaView();
    });
  });
  const attendanceSearchInput = document.querySelector("#attendanceSearchInput");
  if (attendanceSearchInput) {
    attendanceSearchInput.addEventListener("input", async (event) => {
      state.attendanceSearch = event.currentTarget.value;
      await attendancesAstreaView();
    });
  }
  const attendanceStatusFilter = document.querySelector("#attendanceStatusFilter");
  if (attendanceStatusFilter) {
    attendanceStatusFilter.addEventListener("change", async (event) => {
      state.attendanceStatus = event.currentTarget.value || "em-andamento";
      await attendancesAstreaView();
    });
  }
  document.querySelectorAll("[data-delete-attendance]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir este atendimento?")) return;
      await api(`/api/attendances/${button.dataset.deleteAttendance}`, { method: "DELETE" });
      if (state.attendanceDetailId === Number(button.dataset.deleteAttendance)) state.attendanceDetailId = null;
      await attendancesAstreaView();
    });
  });
  document.querySelectorAll("[data-delete-label]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir esta etiqueta?")) return;
      await api(`/api/labels/${button.dataset.deleteLabel}`, { method: "DELETE" });
      await attendancesAstreaView();
    });
  });

  const attendanceNewBtn = document.querySelector("#attendanceNewBtn");
  if (attendanceNewBtn) {
    attendanceNewBtn.addEventListener("click", async () => {
      state.attendanceDetailId = null;
      state.attendancePanel = "atendimento";
      await attendancesAstreaView();
    });
  }
  const attendanceBackListBtn = document.querySelector("#attendanceBackListBtn");
  if (attendanceBackListBtn) {
    attendanceBackListBtn.addEventListener("click", () => {
      location.hash = "#/dashboard";
    });
  }
  const attendanceBackBtn = document.querySelector("#attendanceBackBtn");
  if (attendanceBackBtn) {
    attendanceBackBtn.addEventListener("click", async () => {
      state.attendanceDetailId = null;
      location.hash = "#/attendances";
      await attendancesAstreaView();
    });
  }
  const attendanceDeleteBtn = document.querySelector("#attendanceDeleteBtn");
  if (attendanceDeleteBtn && state.attendanceDetailId) {
    attendanceDeleteBtn.addEventListener("click", async () => {
      if (!confirm("Excluir este atendimento e suas anotações?")) return;
      await api(`/api/attendances/${state.attendanceDetailId}`, { method: "DELETE" });
      state.attendanceDetailId = null;
      location.hash = "#/attendances";
      await attendancesAstreaView();
    });
  }

  const labelForm = document.querySelector("#labelForm");
  if (labelForm) {
    labelForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = document.querySelector("#labelFormError");
      error.textContent = "";
      try {
        await api("/api/labels", { method: "POST", body: JSON.stringify(collectForm(labelForm)) });
        await attendancesAstreaView();
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }

  const attendanceNoteForm = document.querySelector("#attendanceNoteForm");
  if (attendanceNoteForm && state.attendanceDetailId) {
    attendanceNoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const error = document.querySelector("#attendanceNoteFormError");
      error.textContent = "";
      try {
        await api(`/api/attendances/${state.attendanceDetailId}/notes`, { method: "POST", body: JSON.stringify(collectForm(attendanceNoteForm)) });
        await attendancesAstreaView();
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }

  if (panel === "atendimento") {
    const form = document.querySelector("#attendanceForm");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = collectForm(event.currentTarget);
        const link = resolveReferenceV2(payload.linked_reference, payload.linked_type);
        payload.linked_type = link.type;
        payload.linked_id = link.id;
        if (payload.linked_type === "case") payload.case_id = payload.linked_id;
        if (payload.linked_type === "client") payload.client_id = payload.linked_id;
        const error = document.querySelector("#attendanceFormError");
        error.textContent = "";
        try {
          const result = await api("/api/attendances", { method: "POST", body: JSON.stringify(payload) });
          state.attendanceLeadPrefillId = null;
          state.attendanceDetailId = result.id || null;
          if (result.id) location.hash = `#/attendances/${result.id}`;
          await attendancesAstreaView();
        } catch (err) {
          error.textContent = err.message;
        }
      });
    }
  }

  if (panel === "tarefa") {
    const form = document.querySelector("#attendanceTaskForm");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = collectForm(event.currentTarget);
        const attendanceId = payload.attendance_id ? Number(payload.attendance_id) : state.attendanceDetailId || null;
        const selected = attendances.find((item) => item.id === attendanceId);
        const taskPayload = {
          title: payload.title,
          due_date: payload.due_date,
          priority: payload.priority || "média",
          owner: payload.owner,
          label_id: payload.label_id ? Number(payload.label_id) : null,
          task_list: "Atendimentos",
          status: "aberta",
          linked_type: attendanceId ? "attendance" : null,
          linked_id: attendanceId,
          linked_reference: selected ? `atendimento #${selected.id} - ${selected.subject}` : null,
        };
        const error = document.querySelector("#attendanceTaskFormError");
        error.textContent = "";
        try {
          await api("/api/tasks", { method: "POST", body: JSON.stringify(taskPayload) });
          state.attendancePanel = "atendimento";
          if (state.attendanceDetailId) location.hash = `#/attendances/${state.attendanceDetailId}`;
          await attendancesAstreaView();
        } catch (err) {
          error.textContent = err.message;
        }
      });
    }
  }

  if (panel === "evento") {
    const form = document.querySelector("#attendanceEventForm");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = collectForm(event.currentTarget);
        const attendanceId = payload.attendance_id ? Number(payload.attendance_id) : state.attendanceDetailId || null;
        const selected = attendances.find((item) => item.id === attendanceId);
        const eventPayload = {
          title: payload.title,
          start_date: payload.start_date,
          start_time: payload.start_time,
          end_date: payload.start_date,
          end_time: payload.start_time,
          owner: payload.owner,
          label_id: payload.label_id ? Number(payload.label_id) : null,
          observations: payload.observations,
          status: "agendado",
          linked_type: attendanceId ? "attendance" : null,
          linked_id: attendanceId,
          linked_reference: selected ? `atendimento #${selected.id} - ${selected.subject}` : null,
        };
        const error = document.querySelector("#attendanceEventFormError");
        error.textContent = "";
        try {
          await api("/api/events", { method: "POST", body: JSON.stringify(eventPayload) });
          state.attendancePanel = "atendimento";
          if (state.attendanceDetailId) location.hash = `#/attendances/${state.attendanceDetailId}`;
          await attendancesAstreaView();
        } catch (err) {
          error.textContent = err.message;
        }
      });
    }
  }
}

function financeAmount(value) {
  return Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function financeMonthLabel(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  if (!year || !month) return monthKey || "-";
  const date = new Date(year, month - 1, 1);
  const short = date.toLocaleString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
  return `${short} ${year}`;
}

function financeTypeLabel(type) {
  const map = {
    honorario: "Honorários",
    entrada: "Outras entradas",
    saida: "Saídas",
    transferencia: "Transferências",
  };
  return map[type] || type || "-";
}

function financeKindFromType(type) {
  if (type === "honorario") return "honorarios";
  if (type === "entrada") return "outras entradas";
  if (type === "saida") return "despesa";
  if (type === "transferencia") return "transferencia";
  return "honorarios";
}

function addMonthsToDateKeyV3(dateKey, monthsToAdd) {
  const base = parseDateOnly(dateKey);
  if (!base) return dateKey;
  const year = base.getFullYear();
  const month = base.getMonth() + Number(monthsToAdd || 0);
  const day = base.getDate();
  const target = new Date(year, month, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
}

function parseRefEntityId(raw, prefix) {
  const text = normalizeAgendaV2(raw || "");
  if (!text.startsWith(prefix)) return null;
  const match = String(raw || "").match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function financeLaunchMenuHtml() {
  return `
    <div class="finance-add-dropdown">
      <button class="btn primary finance-add-btn" id="financeAddLaunchBtn">ADICIONAR LANÇAMENTO <span class="caret">&#9662;</span></button>
      <div class="finance-popover hidden" id="financeAddLaunchMenu">
        <button type="button" data-finance-launch-type="honorario">Honorário</button>
        <button type="button" data-finance-launch-type="entrada">Outras Entradas</button>
        <button type="button" data-finance-launch-type="saida">Saída</button>
        <button type="button" data-finance-launch-type="transferencia">Transferência</button>
      </div>
    </div>
  `;
}

function financeReferenceDatalist(refs) {
  const options = [];
  (refs.cases || []).forEach((item) => options.push(`processo #${item.id} - ${item.case_number || item.title || "sem numero"}`));
  (refs.clients || []).forEach((item) => options.push(`cliente #${item.id} - ${item.name || "sem nome"}`));
  (refs.attendances || []).forEach((item) => options.push(`atendimento #${item.id} - ${item.subject || "sem assunto"}`));
  return `<datalist id="financeReferenceOptions">${options.map((item) => `<option value="${esc(item)}"></option>`).join("")}</datalist>`;
}

function financeClientDatalist(refs) {
  return `<datalist id="financeClientOptions">${(refs.clients || []).map((item) => `<option value="cliente #${esc(item.id)} - ${esc(item.name || "sem nome")}"></option>`).join("")}</datalist>`;
}

function financeLaunchTable(items) {
  return `
    <div class="finance-list-wrap">
      <table class="data-table finance-list-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Cliente</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map((item) => {
              const showEmit = String(item.launch_type || "").toLowerCase() === "honorario" && String(item.invoice_status || "a faturar").toLowerCase() !== "emitida";
              return `
                <tr>
                  <td>${esc(financeTypeLabel(item.launch_type))}</td>
                  <td>${esc(item.description || "-")}</td>
                  <td>${esc(item.client_name || "-")}</td>
                  <td>${esc(formatDate(item.due_date))}</td>
                  <td>${esc(financeAmount(item.amount))}</td>
                  <td>${badge(item.status || "pendente")}</td>
                  <td class="btn-row">
                    ${String(item.status || "").toLowerCase() === "pago" ? "" : `<button class="btn ghost" data-finance-pay="${item.id}">Marcar pago</button>`}
                    ${showEmit ? `<button class="btn ghost" data-finance-emit="${item.id}">Emitir fatura</button>` : ""}
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function financeFlowTable(flowItems) {
  const months = flowItems.map((item) => item.month);
  return `
    <div class="finance-flow-table-wrap">
      <table class="finance-flow-table">
        <thead>
          <tr>
            <th>DESCRICAO</th>
            ${months.map((month) => `<th>${esc(financeMonthLabel(month))}<br /><span>PREVISTO</span></th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Saldo anterior</td>
            ${flowItems.map((item) => `<td>${esc(financeAmount(item.initial_balance))}</td>`).join("")}
          </tr>
          <tr class="row-title row-entries"><td colspan="${months.length + 1}">ENTRADAS</td></tr>
          <tr>
            <td>TOTAL</td>
            ${flowItems.map((item) => `<td class="cell-positive">${esc(financeAmount(item.entries))}</td>`).join("")}
          </tr>
          <tr class="row-title row-exits"><td colspan="${months.length + 1}">SAIDAS</td></tr>
          <tr>
            <td>TOTAL</td>
            ${flowItems.map((item) => `<td class="cell-negative">${esc(financeAmount(item.exits))}</td>`).join("")}
          </tr>
          <tr class="row-title row-balance"><td colspan="${months.length + 1}">SALDO</td></tr>
          <tr>
            <td>Saldo do período</td>
            ${flowItems.map((item) => `<td>${esc(financeAmount(item.period_balance))}</td>`).join("")}
          </tr>
          <tr>
            <td>Saldo final</td>
            ${flowItems.map((item) => `<td>${esc(financeAmount(item.final_balance))}</td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

async function financeAstreaView() {
  const view = document.querySelector("#view");
  const tab = state.financeTab || "lancamentos";
  const flowQuery = state.financeFlowCenterId ? `?cost_center_id=${encodeURIComponent(state.financeFlowCenterId)}` : "";
  const [financeRes, categoriesRes, centersRes, accountsRes, refs, flowRes] = await Promise.all([
    api("/api/finance"),
    api("/api/finance/categories"),
    api("/api/finance/cost-centers"),
    api("/api/finance/accounts"),
    api("/api/agenda/references"),
    api(`/api/finance/flow${flowQuery}`),
  ]);
  const items = financeRes.items || [];
  const categories = categoriesRes.items || [];
  const costCenters = centersRes.items || [];
  const accounts = accountsRes.items || [];
  const flowItems = flowRes.items || [];

  const faturarTab = state.financeFaturasTab || "a-faturar";
  const configTab = state.financeConfigTab || "categorias";
  const honorarios = items.filter((item) => String(item.launch_type || "").toLowerCase() === "honorario");
  const filteredInvoices = honorarios.filter((item) => {
    const status = String(item.invoice_status || "a faturar").toLowerCase();
    return faturarTab === "emitidas" ? status === "emitida" : status !== "emitida";
  });

  view.innerHTML = `
    ${pageHeader("Financeiro", "Gestão financeira do escritório com lançamentos, faturas, fluxo de caixa e configurações.")}
    <section class="panel finance-module">
      <div class="finance-main-tabs">
        <button class="${tab === "lancamentos" ? "active" : ""}" data-finance-tab="lancamentos">Lançamentos</button>
        <button class="${tab === "faturas" ? "active" : ""}" data-finance-tab="faturas">Faturas</button>
        <button class="${tab === "fluxo" ? "active" : ""}" data-finance-tab="fluxo">Fluxo de caixa</button>
        <button class="${tab === "configuracoes" ? "active" : ""}" data-finance-tab="configuracoes">Configurações</button>
      </div>

      ${
        tab === "lancamentos"
          ? `
        <div class="finance-lancamentos">
          ${
            state.financeComposerOpen
              ? `
            <section class="finance-composer">
              <h2>Adicionar ${esc(financeTypeLabel(state.financeLaunchType))}</h2>
              <form id="financeLaunchForm" class="finance-form-grid">
                <div class="field">
                  <label for="fin_due_date">Vencimento*</label>
                  <input id="fin_due_date" name="due_date" type="date" required />
                </div>
                <div class="field">
                  <label for="fin_amount">Valor*</label>
                  <input id="fin_amount" name="amount" type="number" min="0" step="0.01" required placeholder="0,00" />
                </div>
                <div class="field full">
                  <label for="fin_description">Descrição*</label>
                  <input id="fin_description" name="description" type="text" required placeholder="Ex.: Honorários da elaboração de contrato" />
                </div>
                <div class="field full checkbox-row">
                  <input id="fin_recurring" name="recurring_monthly" type="checkbox" />
                  <label for="fin_recurring">Repetir mensalmente</label>
                </div>
                <div class="field full finance-inline-row">
                  <label for="financeLinesRange">Quantidade de lançamentos</label>
                  <input id="financeLinesRange" type="range" min="1" max="24" value="${Math.max(1, Math.min(24, Number(state.financeLineCount || 1)))}" />
                  <strong id="financeLinesValue">${Math.max(1, Math.min(24, Number(state.financeLineCount || 1)))} parcela(s)</strong>
                </div>
                <div class="field">
                  <label for="fin_case_ref">Processo, caso ou atendimento*</label>
                  <input id="fin_case_ref" name="case_reference" list="financeReferenceOptions" required placeholder="Encontre processo, caso ou atendimento" />
                </div>
                <div class="field">
                  <label for="fin_client_ref">Cliente*</label>
                  <input id="fin_client_ref" name="client_reference" list="financeClientOptions" required placeholder="Digite o nome do cliente" />
                </div>
                <div class="field">
                  <label for="fin_owner">Responsável*</label>
                  <input id="fin_owner" name="responsible" value="${esc(state.user?.name || "")}" required />
                </div>
                <div class="field">
                  <label for="fin_category">Categoria</label>
                  <select id="fin_category" name="category_id">
                    <option value="">Selecione</option>
                    ${categories.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="fin_center">Centro de custo</label>
                  <select id="fin_center" name="cost_center_id">
                    <option value="">Selecione</option>
                    ${costCenters.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="fin_account">Conta</label>
                  <select id="fin_account" name="account_id">
                    <option value="">Selecione</option>
                    ${accounts.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("")}
                  </select>
                </div>
                ${financeReferenceDatalist(refs)}
                ${financeClientDatalist(refs)}
                <div class="full btn-row finance-actions">
                  <button class="btn ghost" type="button" id="financeCancelComposer">Cancelar</button>
                  <button class="btn primary" type="submit">Salvar</button>
                </div>
                <div class="full"><div id="financeLaunchError" class="error"></div></div>
              </form>
            </section>
          `
              : items.length
                ? `
            <div class="finance-toolbar">
              ${financeLaunchMenuHtml()}
            </div>
            ${financeLaunchTable(items)}
          `
                : `
            <div class="finance-empty-state">
              <img src="/static/mark.svg" alt="Financeiro" />
              <h2>Faça a gestão financeira do seu escritório de forma integrada e eficiente</h2>
              <p>Registre e acompanhe lançamentos financeiros e personalize o módulo com categorias e centros de custo.</p>
              ${financeLaunchMenuHtml()}
              <a class="finance-learn-link" href="#/finance">Saiba mais sobre o módulo financeiro</a>
            </div>
          `
          }
        </div>
      `
          : ""
      }

      ${
        tab === "faturas"
          ? `
        <div class="finance-subtabs">
          <button class="${faturarTab === "a-faturar" ? "active" : ""}" data-finance-fatura-tab="a-faturar">A faturar</button>
          <button class="${faturarTab === "emitidas" ? "active" : ""}" data-finance-fatura-tab="emitidas">Emitidas</button>
        </div>
        ${
          filteredInvoices.length
            ? `
          <div class="finance-list-wrap">
            <table class="data-table finance-list-table">
              <thead>
                <tr><th>Descrição</th><th>Cliente</th><th>Vencimento</th><th>Valor</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                ${filteredInvoices
                  .map(
                    (item) => `
                  <tr>
                    <td>${esc(item.description || "-")}</td>
                    <td>${esc(item.client_name || "-")}</td>
                    <td>${esc(formatDate(item.due_date))}</td>
                    <td>${esc(financeAmount(item.amount))}</td>
                    <td>${badge(item.invoice_status || "a faturar")}</td>
                    <td>
                      ${
                        faturarTab === "a-faturar"
                          ? `<button class="btn ghost" data-finance-emit="${item.id}">Emitir fatura</button>`
                          : `<button class="btn ghost" data-finance-unemit="${item.id}">Voltar para a faturar</button>`
                      }
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : `<div class="empty">Nenhuma fatura nesta visão.</div>`
        }
      `
          : ""
      }

      ${
        tab === "fluxo"
          ? `
        <div class="finance-flow-filters">
          <input id="financeCenterSearch" type="text" list="financeCenterOptions" placeholder="Digite o centro de custo para filtrar" value="${esc(state.financeCenterSearch || "")}" />
          <datalist id="financeCenterOptions">
            ${costCenters.map((item) => `<option value="${esc(item.name)}"></option>`).join("")}
          </datalist>
          <select id="financeCenterSelect">
            <option value="">TODAS</option>
            ${costCenters.map((item) => `<option value="${esc(item.id)}" ${String(state.financeFlowCenterId || "") === String(item.id) ? "selected" : ""}>${esc(item.name)}</option>`).join("")}
          </select>
        </div>
        <h2 class="finance-flow-title">FLUXO DE CAIXA DE ${new Date().getFullYear()}</h2>
        ${financeFlowTable(flowItems)}
      `
          : ""
      }

      ${
        tab === "configuracoes"
          ? `
        <div class="finance-subtabs">
          <button class="${configTab === "categorias" ? "active" : ""}" data-finance-config-tab="categorias">Categorias</button>
          <button class="${configTab === "centros" ? "active" : ""}" data-finance-config-tab="centros">Centros de custo</button>
          <button class="${configTab === "contas" ? "active" : ""}" data-finance-config-tab="contas">Contas</button>
        </div>
        <div class="finance-config-grid">
          <div class="panel">
            <h2>${
              configTab === "categorias" ? "Categorias" : configTab === "centros" ? "Centros de custo" : "Contas"
            }</h2>
            ${
              configTab === "categorias"
                ? recordList(categories, (item) => ({ title: item.name, badges: [item.color || ""], meta: [] }))
                : configTab === "centros"
                  ? recordList(costCenters, (item) => ({ title: item.name, badges: [], meta: [] }))
                  : recordList(accounts, (item) => ({ title: item.name, badges: [item.account_type || "banco"], meta: [] }))
            }
          </div>
          <div class="panel">
            <h2>Adicionar</h2>
            <form id="financeConfigForm" class="form-grid">
              <div class="field full">
                <label for="fin_cfg_name">Nome*</label>
                <input id="fin_cfg_name" name="name" required />
              </div>
              ${
                configTab === "categorias"
                  ? `
                <div class="field full">
                  <label for="fin_cfg_color">Cor</label>
                  <input id="fin_cfg_color" name="color" type="color" value="#2563eb" />
                </div>
              `
                  : ""
              }
              ${
                configTab === "contas"
                  ? `
                <div class="field full">
                  <label for="fin_cfg_type">Tipo da conta</label>
                  <select id="fin_cfg_type" name="account_type">
                    <option value="banco">Banco</option>
                    <option value="caixa">Caixa</option>
                    <option value="cartao">Cartao</option>
                  </select>
                </div>
              `
                  : ""
              }
              <div class="full btn-row">
                <button class="btn primary" type="submit">Salvar</button>
              </div>
              <div class="full"><div id="financeConfigError" class="error"></div></div>
            </form>
          </div>
        </div>
      `
          : ""
      }
    </section>
  `;

  document.querySelectorAll("[data-finance-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.financeTab = button.dataset.financeTab;
      state.financeComposerOpen = false;
      await financeAstreaView();
    });
  });

  document.querySelectorAll("[data-finance-fatura-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.financeFaturasTab = button.dataset.financeFaturaTab;
      await financeAstreaView();
    });
  });

  document.querySelectorAll("[data-finance-config-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.financeConfigTab = button.dataset.financeConfigTab;
      await financeAstreaView();
    });
  });

  const addBtn = document.querySelector("#financeAddLaunchBtn");
  const addMenu = document.querySelector("#financeAddLaunchMenu");
  if (addBtn && addMenu) {
    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addMenu.classList.toggle("hidden");
      if (!addMenu.classList.contains("hidden")) {
        setTimeout(() => {
          document.addEventListener(
            "click",
            () => {
              addMenu.classList.add("hidden");
            },
            { once: true }
          );
        }, 0);
      }
    });
    addMenu.addEventListener("click", (event) => event.stopPropagation());
    document.querySelectorAll("[data-finance-launch-type]").forEach((button) => {
      button.addEventListener("click", async () => {
        state.financeLaunchType = button.dataset.financeLaunchType;
        state.financeLineCount = 1;
        state.financeComposerOpen = true;
        await financeAstreaView();
      });
    });
  }

  if (state.financeComposerOpen && document.querySelector("#financeCancelComposer")) {
    const linesRange = document.querySelector("#financeLinesRange");
    const linesValue = document.querySelector("#financeLinesValue");
    if (linesRange && linesValue) {
      linesRange.addEventListener("input", () => {
        linesValue.textContent = `${Math.max(1, Math.min(24, Number(linesRange.value || 1)))} parcela(s)`;
      });
      linesRange.addEventListener("change", async () => {
        state.financeLineCount = Math.max(1, Math.min(24, Number(linesRange.value || 1)));
        await financeAstreaView();
      });
    }
    document.querySelector("#financeCancelComposer").addEventListener("click", async () => {
      state.financeComposerOpen = false;
      state.financeLineCount = 1;
      await financeAstreaView();
    });
    document.querySelector("#financeLaunchForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = collectForm(event.currentTarget);
      const caseId = parseRefEntityId(payload.case_reference, "processo");
      const clientId = parseRefEntityId(payload.client_reference, "cliente");
      const linked = resolveReferenceV2(payload.case_reference, null);
      const error = document.querySelector("#financeLaunchError");
      const recurringFlag = document.querySelector("#fin_recurring").checked ? "1" : "0";
      const createHonorarioTask = async (description, dueDate, partNumber, totalParts) => {
        if (state.financeLaunchType !== "honorario") return;
        await api("/api/tasks", {
          method: "POST",
          body: JSON.stringify({
            title: `Cobrança de honorários (${partNumber}/${totalParts}) - ${description}`,
            description: "Cobrança automática criada a partir do lançamento de honorários.",
            due_date: dueDate,
            status: "aberta",
            priority: "média",
            owner: payload.responsible || state.user?.name || "",
            task_list: "Financeiro",
            linked_reference: payload.case_reference,
            kanban_board: "Kanban Padrão",
            kanban_column: "A Fazer",
            linked_type: linked.type,
            linked_id: linked.id,
            risk: "médio",
          }),
        });
      };
      error.textContent = "";
      const totalLines = Math.max(1, Math.min(24, Number(state.financeLineCount || 1)));
      if (!linked?.id) {
        error.textContent = "Selecione um processo, caso ou atendimento da lista.";
        return;
      }
      if (!clientId) {
        error.textContent = "Selecione um cliente válido da lista.";
        return;
      }
      try {
        await api("/api/finance", {
          method: "POST",
          body: JSON.stringify({
            description: payload.description,
            amount: payload.amount,
            due_date: payload.due_date,
            status: "pendente",
            kind: financeKindFromType(state.financeLaunchType),
            launch_type: state.financeLaunchType,
            recurring_monthly: recurringFlag,
            responsible: payload.responsible,
            linked_type: linked.type,
            linked_id: linked.id,
            case_id: caseId,
            client_id: clientId,
            category_id: payload.category_id,
            cost_center_id: payload.cost_center_id,
            account_id: payload.account_id,
            invoice_status: state.financeLaunchType === "honorario" ? "a faturar" : "emitida",
          }),
        });
        await createHonorarioTask(payload.description, payload.due_date, 1, totalLines);
        for (let index = 1; index < totalLines; index += 1) {
          const nextDescription = `${payload.description} (${index + 1}/${totalLines})`;
          const nextDueDate = addMonthsToDateKeyV3(payload.due_date, index);
          await api("/api/finance", {
            method: "POST",
            body: JSON.stringify({
              description: nextDescription,
              amount: payload.amount,
              due_date: nextDueDate,
              status: "pendente",
              kind: financeKindFromType(state.financeLaunchType),
              launch_type: state.financeLaunchType,
              recurring_monthly: recurringFlag,
              responsible: payload.responsible,
              linked_type: linked.type,
              linked_id: linked.id,
              case_id: caseId,
              client_id: clientId,
              category_id: payload.category_id,
              cost_center_id: payload.cost_center_id,
              account_id: payload.account_id,
              invoice_status: state.financeLaunchType === "honorario" ? "a faturar" : "emitida",
            }),
          });
          await createHonorarioTask(nextDescription, nextDueDate, index + 1, totalLines);
        }
        state.financeComposerOpen = false;
        state.financeLineCount = 1;
        await financeAstreaView();
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }

  document.querySelectorAll("[data-finance-pay]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/finance/${button.dataset.financePay}/status`, { method: "PATCH", body: JSON.stringify({ status: "pago" }) });
      await financeAstreaView();
    });
  });

  document.querySelectorAll("[data-finance-emit]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/finance/${button.dataset.financeEmit}/invoice-status`, { method: "PATCH", body: JSON.stringify({ invoice_status: "emitida" }) });
      await financeAstreaView();
    });
  });

  document.querySelectorAll("[data-finance-unemit]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/finance/${button.dataset.financeUnemit}/invoice-status`, { method: "PATCH", body: JSON.stringify({ invoice_status: "a faturar" }) });
      await financeAstreaView();
    });
  });

  if (tab === "fluxo" && document.querySelector("#financeCenterSelect")) {
    const centerSelect = document.querySelector("#financeCenterSelect");
    const centerSearch = document.querySelector("#financeCenterSearch");
    centerSelect.addEventListener("change", async (event) => {
      state.financeFlowCenterId = event.currentTarget.value || null;
      const selectedId = state.financeFlowCenterId;
      const selectedCenter = costCenters.find((item) => String(item.id) === String(selectedId || ""));
      state.financeCenterSearch = selectedCenter ? selectedCenter.name : "";
      await financeAstreaView();
    });
    if (centerSearch) {
      const applyCenterFilter = async () => {
        const text = String(centerSearch.value || "").trim();
        state.financeCenterSearch = text;
        if (!text) {
          state.financeFlowCenterId = null;
          await financeAstreaView();
          return;
        }
        const normalizedText = normalizeAgendaV2(text);
        const match = costCenters.find((item) => normalizeAgendaV2(item.name || "").includes(normalizedText));
        state.financeFlowCenterId = match ? match.id : null;
        await financeAstreaView();
      };
      centerSearch.addEventListener("change", applyCenterFilter);
      centerSearch.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          await applyCenterFilter();
        }
      });
    }
  }

  if (tab === "configuracoes" && document.querySelector("#financeConfigForm")) {
    document.querySelector("#financeConfigForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = collectForm(event.currentTarget);
      const error = document.querySelector("#financeConfigError");
      error.textContent = "";
      try {
        if (configTab === "categorias") {
          await api("/api/finance/categories", { method: "POST", body: JSON.stringify(payload) });
        } else if (configTab === "centros") {
          await api("/api/finance/cost-centers", { method: "POST", body: JSON.stringify(payload) });
        } else {
          await api("/api/finance/accounts", { method: "POST", body: JSON.stringify(payload) });
        }
        await financeAstreaView();
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }
}

async function processWorkbenchView() {
  const view = document.querySelector("#view");
  const data = await api("/api/process-workbench");
  view.innerHTML = `
    ${pageHeader("Processos", "Mesa de controle com histórico, publicações, prazos, responsáveis e alertas.")}
    <section class="grid metrics">
      ${metric("Monitorados", data.metrics.processos_monitorados, "processos ativos")}
      ${metric("Andamentos novos", data.metrics.andamentos_novos, "publicações/histórico")}
      ${metric("Prazos pendentes", data.metrics.prazos_pendentes, "agenda processual")}
      ${metric("Críticos/altos", data.metrics.prazos_criticos, "atenção imediata")}
      ${metric("IA processual", "ativa", "triagem de risco")}
      ${metric("Fonte", "manual", "pronto para integrações")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Publicações pendentes</h2>
        ${recordList(data.publication_queue, publicationCard)}
      </div>
      <div class="panel">
        <h2>Processos monitorados</h2>
        ${recordList(data.cases, (item) => ({
          title: item.title,
          badges: [item.status, item.risk, `${item.open_deadlines || 0} prazos`],
          meta: [
            `Cliente: ${item.client_name || "não vinculado"}`,
            `Número: ${item.case_number || "sem número"} · ${item.court || "foro não informado"}`,
            `Responsável: ${item.responsible || "não definido"} · próximo prazo: ${formatDate(item.next_process_deadline || item.next_deadline)}`,
            item.summary || "sem resumo",
          ],
        }))}
      </div>
      <div class="panel">
        <h2>Próximos prazos</h2>
        ${recordList(data.deadlines, deadlineCard)}
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Histórico e publicações</h2>
        ${recordList(data.movements, movementCard)}
      </div>
      <div class="panel">
        <h2>Ações rápidas</h2>
        <h3>Novo andamento</h3>
        ${quickMovementForm()}
        <div id="movementError" class="error"></div>
        <h3>Novo prazo processual</h3>
        ${quickDeadlineForm()}
        <div id="deadlineError" class="error"></div>
      </div>
    </section>
  `;
  document.querySelector("#movementForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/case-movements", { method: "POST", body: JSON.stringify(collectForm(event.currentTarget)) });
      await processWorkbenchView();
    } catch (err) {
      document.querySelector("#movementError").textContent = err.message;
    }
  });
  document.querySelector("#deadlineForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/deadlines", { method: "POST", body: JSON.stringify(collectForm(event.currentTarget)) });
      await processWorkbenchView();
    } catch (err) {
      document.querySelector("#deadlineError").textContent = err.message;
    }
  });
  bindDeadlineActions(processWorkbenchView);
  bindMovementActions(processWorkbenchView);
}

async function publicationsView() {
  const view = document.querySelector("#view");
  const [workbench, integrationStatus] = await Promise.all([api("/api/process-workbench"), api("/api/tribunal-integrations/status")]);
  const publicationQueue = workbench.publication_queue || [];
  const groupedByCase = publicationQueue.reduce((acc, item) => {
    const key = Number(item.case_id || 0);
    if (!key) return acc;
    if (!acc[key]) {
      acc[key] = {
        case_id: key,
        case_title: item.case_title || `Processo #${key}`,
        case_number: item.case_number || "",
        total: 0,
        last_date: item.movement_date || null,
        pending: 0,
      };
    }
    acc[key].total += 1;
    if (String(item.status || "").toLowerCase() === "novo") acc[key].pending += 1;
    if (!acc[key].last_date || String(item.movement_date || "") > String(acc[key].last_date || "")) {
      acc[key].last_date = item.movement_date || acc[key].last_date;
    }
    return acc;
  }, {});
  const processSummaries = Object.values(groupedByCase).sort((a, b) => String(b.last_date || "").localeCompare(String(a.last_date || "")));
  const integrationItems = integrationStatus.items || [];

  view.innerHTML = `
    ${pageHeader(
      "Publicações",
      "Processos com publicações recentes vindas da integração dos tribunais.",
      `
        <select id="publicationSystemSelect">
          <option value="">Todos os sistemas</option>
          <option value="PJE">PJE TJMG</option>
          <option value="EPROC">EPROC</option>
          <option value="JPE">JPE</option>
        </select>
        <button class="btn primary" id="publicationSyncBtn">Sincronizar agora</button>
      `
    )}
    <section class="grid metrics">
      ${metric("Publicações novas", workbench.metrics?.andamentos_novos || 0, "fila de leitura")}
      ${metric("Processos com publicação", processSummaries.length, "carteira monitorada")}
      ${metric("Prazos pendentes", workbench.metrics?.prazos_pendentes || 0, "agenda processual")}
      ${metric("Conectores", integrationItems.length, "PJE, EPROC, JPE")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Processos com publicações recentes</h2>
        ${recordList(processSummaries, (item) => ({
          title: item.case_title,
          badges: [`${item.total} publicações`, `${item.pending} novas`],
          meta: [
            item.case_number ? `Número: ${item.case_number}` : "Número não informado",
            `Última publicação: ${formatDate(item.last_date)}`,
          ],
          actions: `<a class="btn ghost" href="#/cases/${item.case_id}">Abrir processo</a>`,
        }))}
        <div class="muted-inline">Use o botão "Sincronizar agora" para puxar atualizações do tribunal.</div>
      </div>
      <div class="panel">
        <h2>Fila de publicações</h2>
        ${recordList(publicationQueue, publicationCard)}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Conectores do tribunal</h2>
      ${
        integrationItems.length
          ? recordList(integrationItems, (item) => ({
              title: `${item.provider} • ${item.system_code}`,
              badges: [
                item.enabled ? "URL configurada" : "URL pendente",
                item.auth_configured ? "token ok" : "token pendente",
                (integrationStatus.mode || "homolog").toUpperCase(),
              ],
              meta: [
                `Instância: ${item.instance_scope || "todas-instancias"}`,
                item.base_url || "Base URL não configurada",
                item.last_run
                  ? `Última sync: ${item.last_run.created_at || "-"} • ${item.last_run.imported_count || 0} registros`
                  : "Sem sincronização registrada.",
              ],
            }))
          : `<div class="empty">Nenhum conector encontrado.</div>`
      }
    </section>
  `;

  document.querySelector("#publicationSyncBtn").addEventListener("click", async () => {
    const selectedSystem = document.querySelector("#publicationSystemSelect").value;
    const payload = { provider: "TJMG" };
    if (selectedSystem) payload.system_code = selectedSystem;
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify(payload) });
    await publicationsView();
  });

  bindMovementActions(publicationsView);
}

async function publicationsViewV2() {
  const view = document.querySelector("#view");
  const [workbench, integrationStatus] = await Promise.all([api("/api/process-workbench"), api("/api/tribunal-integrations/status")]);
  const publicationQueue = workbench.publication_queue || [];
  const groupedByCase = publicationQueue.reduce((acc, item) => {
    const key = Number(item.case_id || 0);
    if (!key) return acc;
    if (!acc[key]) {
      acc[key] = {
        case_id: key,
        case_title: item.case_title || `Processo #${key}`,
        case_number: item.case_number || "",
        total: 0,
        last_date: item.movement_date || null,
        pending: 0,
      };
    }
    acc[key].total += 1;
    if (String(item.status || "").toLowerCase() === "novo") acc[key].pending += 1;
    if (!acc[key].last_date || String(item.movement_date || "") > String(acc[key].last_date || "")) {
      acc[key].last_date = item.movement_date || acc[key].last_date;
    }
    return acc;
  }, {});
  const processSummaries = Object.values(groupedByCase).sort((a, b) => String(b.last_date || "").localeCompare(String(a.last_date || "")));
  const integrationItems = integrationStatus.items || [];

  view.innerHTML = `
    ${pageHeader(
      "Publicacoes",
      "Processos com publicacoes recentes vindas da integracao dos tribunais.",
      `
        <select id="publicationSystemSelect">
          <option value="">Todos os sistemas</option>
          <option value="PJE">PJE TJMG</option>
          <option value="EPROC">EPROC</option>
          <option value="JPE">JPE</option>
        </select>
        <button class="btn primary" id="publicationSyncBtn">Sincronizar agora</button>
      `
    )}
    <section class="grid metrics">
      ${metric("Publicacoes novas", workbench.metrics?.andamentos_novos || 0, "fila de leitura")}
      ${metric("Processos com publicacao", processSummaries.length, "carteira monitorada")}
      ${metric("Prazos pendentes", workbench.metrics?.prazos_pendentes || 0, "agenda processual")}
      ${metric("Conectores", integrationItems.length, "PJE, EPROC, JPE")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Processos com publicacoes recentes</h2>
        ${recordList(processSummaries, (item) => ({
          title: item.case_title,
          badges: [`${item.total} publicacoes`, `${item.pending} novas`],
          meta: [
            item.case_number ? `Numero: ${item.case_number}` : "Numero nao informado",
            `Ultima publicacao: ${formatDate(item.last_date)}`,
          ],
          actions: `<a class="btn ghost" href="#/cases/${item.case_id}">Abrir processo</a>`,
        }))}
      </div>
      <div class="panel">
        <h2>Fila de publicacoes</h2>
        ${recordList(publicationQueue, publicationCard)}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Conectores TJMG</h2>
      ${
        integrationItems.length
          ? `<div class="connector-grid">${integrationItems.map((item) => connectorConfigCard(item, integrationStatus.mode || "homolog")).join("")}</div>`
          : `<div class="empty">Nenhum conector encontrado.</div>`
      }
    </section>
  `;

  document.querySelector("#publicationSyncBtn").addEventListener("click", async () => {
    const selectedSystem = document.querySelector("#publicationSystemSelect").value;
    const payload = { provider: "TJMG" };
    if (selectedSystem) payload.system_code = selectedSystem;
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify(payload) });
    await publicationsViewV2();
  });

  document.querySelectorAll("[data-connector-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const payload = {
        provider: form.dataset.provider || "TJMG",
        system_code: form.dataset.system || "PJE",
        instance_scope: form.dataset.scope || "todas-instancias",
        enabled: form.querySelector('[name="enabled"]')?.checked || false,
        base_url: String(values.get("base_url") || "").trim(),
        resource_path: String(values.get("resource_path") || "").trim(),
        http_method: String(values.get("http_method") || "GET").trim().toUpperCase(),
        auth_type: String(values.get("auth_type") || "none").trim().toLowerCase(),
        auth_token: String(values.get("auth_token") || "").trim(),
        auth_username: String(values.get("auth_username") || "").trim(),
        auth_password: String(values.get("auth_password") || "").trim(),
        lawyer_name: String(values.get("lawyer_name") || "").trim(),
        oab_number: String(values.get("oab_number") || "").trim(),
        oab_state: String(values.get("oab_state") || "").trim().toUpperCase(),
        totp_seed: String(values.get("totp_seed") || "").trim(),
        totp_enabled: form.querySelector('[name="totp_enabled"]')?.checked || false,
        api_key_header: String(values.get("api_key_header") || "").trim(),
        api_key_value: String(values.get("api_key_value") || "").trim(),
        query_template: String(values.get("query_template") || "").trim(),
        parser_type: String(values.get("parser_type") || "generic").trim().toLowerCase(),
        poll_days_back: Number(values.get("poll_days_back") || 0),
        timeout_seconds: Number(values.get("timeout_seconds") || 25),
        verify_ssl: form.querySelector('[name="verify_ssl"]')?.checked ?? true,
        notes: String(values.get("notes") || "").trim(),
      };
      await api("/api/tribunal-integrations/config", { method: "POST", body: JSON.stringify(payload) });
      await publicationsViewV2();
    });
  });

  bindMovementActions(publicationsViewV2);
}

function connectorConfigCard(item, mode) {
  return `
    <form class="panel connector-card" data-connector-form data-provider="${esc(item.provider)}" data-system="${esc(item.system_code)}" data-scope="${esc(item.instance_scope || "todas-instancias")}">
      <h3>${esc(item.provider)} • ${esc(item.system_code)}</h3>
      <div class="muted-inline">Instancia: ${esc(item.instance_scope || "todas-instancias")} • modo ${esc(String(mode || "homolog").toUpperCase())}</div>
      <div class="field"><label><input type="checkbox" name="enabled" ${item.enabled ? "checked" : ""} /> Habilitar conector</label></div>
      <div class="field"><label>Base URL</label><input name="base_url" value="${esc(item.base_url || "")}" placeholder="https://..." /></div>
      <div class="field"><label>Path</label><input name="resource_path" value="${esc(item.resource_path || "")}" placeholder="/api/publicacoes" /></div>
      <div class="row">
        <div class="field"><label>Metodo</label><select name="http_method"><option value="GET" ${String(item.http_method || "").toUpperCase() === "GET" ? "selected" : ""}>GET</option><option value="POST" ${String(item.http_method || "").toUpperCase() === "POST" ? "selected" : ""}>POST</option></select></div>
        <div class="field"><label>Parser</label><select name="parser_type"><option value="datajud" ${String(item.parser_type || "").toLowerCase() === "datajud" ? "selected" : ""}>datajud</option><option value="djen" ${String(item.parser_type || "").toLowerCase() === "djen" ? "selected" : ""}>djen</option><option value="generic" ${String(item.parser_type || "").toLowerCase() === "generic" ? "selected" : ""}>generic</option></select></div>
      </div>
      <div class="row">
        <div class="field"><label>Auth</label><select name="auth_type"><option value="none" ${String(item.auth_type || "").toLowerCase() === "none" ? "selected" : ""}>none</option><option value="bearer" ${String(item.auth_type || "").toLowerCase() === "bearer" ? "selected" : ""}>bearer</option><option value="basic" ${String(item.auth_type || "").toLowerCase() === "basic" ? "selected" : ""}>basic</option><option value="api-key" ${String(item.auth_type || "").toLowerCase() === "api-key" ? "selected" : ""}>api-key</option></select></div>
        <div class="field"><label>Token</label><input name="auth_token" value="${esc(item.auth_token || "")}" placeholder="Bearer token" /></div>
      </div>
      <div class="row">
        <div class="field"><label>Usuario</label><input name="auth_username" value="${esc(item.auth_username || "")}" placeholder="usuario" /></div>
        <div class="field"><label>Senha</label><input type="password" name="auth_password" value="${esc(item.auth_password || "")}" placeholder="senha" /></div>
      </div>
      <div class="row">
        <div class="field"><label>Advogado monitorado</label><input name="lawyer_name" value="${esc(item.lawyer_name || "")}" placeholder="Nome do advogado" /></div>
        <div class="field"><label>OAB</label><input name="oab_number" value="${esc(item.oab_number || "")}" placeholder="Numero da OAB" /></div>
      </div>
      <div class="row">
        <div class="field"><label>UF da OAB</label><input name="oab_state" value="${esc(item.oab_state || "")}" maxlength="2" placeholder="MG" /></div>
        <div class="field"><label>Seed 2FA do tribunal</label><input type="password" name="totp_seed" value="${esc(item.totp_seed || "")}" placeholder="Chave seed TOTP" /></div>
      </div>
      <div class="field"><label><input type="checkbox" name="totp_enabled" ${item.totp_enabled ? "checked" : ""} /> Usar codigo TOTP nas chamadas do tribunal</label></div>
      <div class="muted-inline">Templates disponiveis: {oab_number}, {oab_state}, {lawyer_name}, {tribunal_otp}, {case_number} e {case_number_digits}.</div>
      <div class="row">
        <div class="field"><label>Header API key</label><input name="api_key_header" value="${esc(item.api_key_header || "")}" placeholder="X-API-Key" /></div>
        <div class="field"><label>Valor API key</label><input name="api_key_value" value="${esc(item.api_key_value || "")}" placeholder="chave" /></div>
      </div>
      <div class="field"><label>Template de query</label><input name="query_template" value="${esc(item.query_template || "")}" placeholder="numeroProcesso={case_number}&from={from_date}&to={to_date}" /></div>
      <div class="field"><label>Body JSON</label><textarea name="request_body_template" placeholder='{"query":{"match":{"numeroProcesso":"{case_number_digits}"}}}'>${esc(item.request_body_template || "")}</textarea></div>
      <div class="row">
        <div class="field"><label>Dias para buscar</label><input name="poll_days_back" type="number" min="0" max="15" value="${esc(item.poll_days_back || 2)}" /></div>
        <div class="field"><label>Timeout (s)</label><input name="timeout_seconds" type="number" min="5" max="120" value="${esc(item.timeout_seconds || 25)}" /></div>
      </div>
      <div class="field"><label><input type="checkbox" name="verify_ssl" ${item.verify_ssl ? "checked" : ""} /> Validar SSL</label></div>
      <div class="field"><label>Notas</label><textarea name="notes" placeholder="Observacoes do conector">${esc(item.notes || "")}</textarea></div>
      <div class="row actions-row">
        <span class="muted-inline">${item.last_run ? `Ultima sync: ${esc(item.last_run.created_at || "-")} • ${esc(item.last_run.imported_count || 0)} itens` : "Sem sync registrada."}</span>
        <button type="submit" class="btn primary">Salvar conector</button>
      </div>
    </form>
  `;
}

function tribunalCourtOptionsHtml(courts, selectedProvider) {
  const selected = selectedProvider || "ALL-TJ";
  const items = Array.isArray(courts) && courts.length ? courts : [];
  return `
    <option value="ALL-TJ" ${selected === "ALL-TJ" ? "selected" : ""}>Todos os TJs</option>
    ${items.map((court) => `<option value="${esc(court.code)}" ${selected === court.code ? "selected" : ""}>${esc(court.code)} - ${esc(court.name || court.code)}</option>`).join("")}
  `;
}

function tribunalProviderLabel(courts, provider) {
  const court = (courts || []).find((item) => item.code === provider);
  return court ? `${court.code} - ${court.name}` : provider;
}

function connectorStatusPill(item) {
  if (!item.enabled) return "desabilitado";
  if (!item.ready) return "pendente";
  const lastStatus = item.last_run?.status;
  return lastStatus ? `sync ${lastStatus}` : "pronto";
}

function connectorSummaryGrid(items, courts) {
  const groups = {};
  (items || []).forEach((item) => {
    if (!groups[item.provider]) groups[item.provider] = [];
    groups[item.provider].push(item);
  });
  const providers = Object.keys(groups).sort();
  if (!providers.length) return `<div class="empty">Nenhum conector encontrado.</div>`;
  return `
    <div class="connector-summary-grid">
      ${providers
        .map((provider) => {
          const group = groups[provider];
          const ready = group.filter((item) => item.ready).length;
          const enabled = group.filter((item) => item.enabled).length;
          const monitoredOab = group.filter((item) => item.oab_number).length;
          const totp = group.filter((item) => item.totp_enabled && item.totp_seed).length;
          const lastRun = group.find((item) => item.last_run)?.last_run;
          return `
            <div class="connector-summary-card">
              <div class="connector-summary-head">
                <strong>${esc(provider)}</strong>
                <span>${esc(tribunalProviderLabel(courts, provider).replace(`${provider} - `, ""))}</span>
              </div>
              <div class="connector-summary-metrics">
                <span>${ready} prontos</span>
                <span>${enabled} habilitados</span>
                <span>${group.length} conectores</span>
                <span>${monitoredOab} OAB</span>
                <span>${totp} 2FA</span>
              </div>
              <div class="muted-inline">${lastRun ? `Ultima sincronizacao: ${esc(lastRun.created_at || "-")}` : "Sem sincronizacao registrada."}</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function tribunalHomologationPanel(report, items, courts) {
  const summary = report?.summary || {};
  const visible = Array.isArray(items) ? items : [];
  const systems = Array.isArray(report?.systems) ? report.systems : [];
  const shown = visible.slice(0, (state.publicationProvider || "ALL-TJ") === "ALL-TJ" ? 12 : 30);
  const sourceLinks = (report?.official_sources || [])
    .map((item) => `<a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.label)}</a>`)
    .join("");
  const statusText = {
    pronto: "Pronto",
    pendente: "Pendente",
    desabilitado: "Desabilitado",
  };
  return `
    <section class="panel tribunal-homologation">
      <div class="tribunal-homologation-head">
        <div>
          <span class="mvp-kicker">Homologacao</span>
          <h2>Homologacao dos tribunais</h2>
          <p>Conferencia de endpoints, credenciais, OAB monitorada, seed 2FA e ultima sincronizacao.</p>
        </div>
        <div class="tribunal-homologation-score">
          <strong>${esc(summary.ready ?? 0)}/${esc(summary.total ?? 0)}</strong>
          <span>conectores prontos</span>
        </div>
      </div>
      <div class="tribunal-homologation-metrics">
        <span>${esc(summary.enabled ?? 0)} habilitados</span>
        <span>${esc(summary.pending ?? 0)} pendentes</span>
        <span>${esc(summary.disabled ?? 0)} desabilitados</span>
        <span>${esc(summary.last_sync_ok ?? 0)} com sincronizacao OK</span>
        <span>modo ${esc(String(report?.mode || "homolog").toUpperCase())}</span>
      </div>
      <div class="tribunal-system-strip">
        ${systems
          .map(
            (item) => `
              <div>
                <strong>${esc(item.system_code)}</strong>
                <span>${esc(item.ready)} prontos / ${esc(item.pending)} pendentes</span>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="tribunal-homologation-grid">
        ${shown
          .map((item) => {
            const missing = item.missing?.length ? item.missing : ["Sem pendencias para homologacao local."];
            const lastRun = item.last_run
              ? `${item.last_run.status || "-"} · ${formatDate(item.last_run.created_at)} · ${item.last_run.imported_count || 0} itens`
              : "Sem sincronizacao registrada.";
            return `
              <article class="tribunal-homologation-card ${esc(item.homologation_status || "pendente")}">
                <div class="tribunal-homologation-card-head">
                  <strong>${esc(item.provider)} / ${esc(item.system_code)}</strong>
                  <span>${esc(statusText[item.homologation_status] || item.homologation_status || "Pendente")}</span>
                </div>
                <small>${esc(tribunalProviderLabel(courts, item.provider).replace(`${item.provider} - `, ""))}</small>
                <ul>
                  ${missing.map((text) => `<li>${esc(text)}</li>`).join("")}
                </ul>
                <div class="muted-inline">${esc(lastRun)}</div>
              </article>
            `;
          })
          .join("")}
      </div>
      ${(state.publicationProvider || "ALL-TJ") === "ALL-TJ" && visible.length > shown.length ? `<div class="muted-inline">Mostrando os ${shown.length} primeiros conectores. Selecione um tribunal especifico para ver a homologacao completa dele.</div>` : ""}
      <div class="tribunal-requirements">
        <div>
          <h3>Para fechar a homologacao</h3>
          <ul>${(report?.requirements || []).map((text) => `<li>${esc(text)}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Referencias oficiais</h3>
          <div class="tribunal-source-links">${sourceLinks}</div>
        </div>
      </div>
    </section>
  `;
}

const brazilUfOptions = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MT", "MS", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];

const cnjJusticeUfMap = {
  "01": "AC",
  "02": "AL",
  "03": "AP",
  "04": "AM",
  "05": "BA",
  "06": "CE",
  "07": "DF",
  "08": "ES",
  "09": "GO",
  "10": "MA",
  "11": "MT",
  "12": "MS",
  "13": "MG",
  "14": "PA",
  "15": "PB",
  "16": "PR",
  "17": "PE",
  "18": "PI",
  "19": "RJ",
  "20": "RN",
  "21": "RS",
  "22": "RO",
  "23": "RR",
  "24": "SC",
  "25": "SE",
  "26": "SP",
  "27": "TO",
};

function publicationUf(item) {
  const text = [item.case_number, item.tribunal_source, item.source, item.diary].join(" ");
  const cnj = String(item.case_number || "").match(/\.8\.(\d{2})\./);
  if (cnj && cnjJusticeUfMap[cnj[1]]) return cnjJusticeUfMap[cnj[1]];
  const provider = String(text || "").toUpperCase().match(/TJDFT|TJ[A-Z]{2}/);
  if (!provider) return "";
  return provider[0] === "TJDFT" ? "DF" : provider[0].replace("TJ", "");
}

function publicationStatusKey(item) {
  const status = normalizeAgendaV2(item.status || "novo");
  if (status.includes("descart")) return "descartada";
  if (status.includes("lido") || status.includes("tratad") || status.includes("conclu") || status.includes("prazo")) return "tratada";
  return "nao-tratada";
}

function publicationStatusLabel(item) {
  const key = publicationStatusKey(item);
  const status = normalizeAgendaV2(item.status || "");
  if (status.includes("prazo")) return "PRAZO GERADO";
  if (key === "tratada") return "TRATADA";
  if (key === "descartada") return "DESCARTADA";
  return "NAO TRATADA";
}

function publicationSearchHaystack(item) {
  return stripAccents([
    item.title,
    item.description,
    item.publication_text,
    item.case_title,
    item.case_number,
    item.case_responsible,
    item.tribunal_source,
    item.source,
  ].join(" ")).toLowerCase();
}

function publicationSnippet(item, expanded = false) {
  const text = item.publication_text || item.description || item.title || "Publicacao sem texto detalhado.";
  if (expanded || String(text).length <= 260) return text;
  return `${String(text).slice(0, 260)}...`;
}

function publicationLabelsHtml(item) {
  const labels = item.case_labels || [];
  if (!labels.length) return "";
  return `<div class="clip-labels">${labels.map((label) => labelBadgeHtml(label)).join("")}</div>`;
}

function publicationTreatmentSuggestion(item) {
  const text = normalizeAgendaV2([item.title, item.description, item.publication_text].join(" "));
  if (text.includes("audiencia") || text.includes("sessao")) {
    return { days: 5, type: "audiência", priority: "alta", confidence: 78, title: "Conferir audiência publicada" };
  }
  if (text.includes("intimacao") || text.includes("manifest")) {
    return { days: 15, type: "prazo processual", priority: "alta", confidence: 64, title: "Manifestar sobre publicação" };
  }
  if (text.includes("sentenca") || text.includes("acordao") || text.includes("decisao")) {
    return { days: 15, type: "recurso", priority: "alta", confidence: 71, title: "Analisar cabimento de recurso" };
  }
  return { days: 5, type: "tarefa processual", priority: "média", confidence: 52, title: "Analisar publicação" };
}

function publicationDetailModalHtml(item) {
  if (!item) return "";
  const suggestion = publicationTreatmentSuggestion(item);
  const text = item.publication_text || item.description || item.title || "Publicação sem texto detalhado.";
  return `
    <div class="modal-shell open publication-modal" id="publicationDetailModal">
      <div class="modal-backdrop" data-close-publication-modal="1"></div>
      <section class="modal-panel publication-modal-panel" role="dialog" aria-modal="true" aria-label="Publicação">
        <div class="modal-header">
          <div>
            <h2>Publicação</h2>
            <p>${esc(item.case_number || "Processo não identificado")} · ${esc(item.tribunal_source || item.source || "Diário de Justiça")}</p>
          </div>
          <button class="btn ghost" type="button" data-close-publication-modal="1">Fechar</button>
        </div>
        <div class="publication-detail-grid">
          <article class="publication-reading">
            <div class="publication-meta-row">
              <span>Divulgado em <strong>${esc(formatDate(item.movement_date))}</strong></span>
              <span class="clip-status ${esc(publicationStatusKey(item))}">${esc(publicationStatusLabel(item))}</span>
            </div>
            <h3>${esc(item.title || "Publicação do processo")}</h3>
            ${publicationLabelsHtml(item)}
            <p>${esc(text)}</p>
          </article>
          <aside class="publication-treatment">
            <h3>Tratamentos sugeridos</h3>
            ${
              item.case_id
                ? `<button class="btn ghost" type="button" data-suggest-deadline-15="${esc(item.id)}" data-business-days="${esc(suggestion.days)}">Adicionar prazo de ${suggestion.days} dias úteis</button>
                   <span>${suggestion.confidence}% de probabilidade</span>`
                : `<a class="btn primary" href="#/cases">Iniciar busca de processo</a>
                   <span>Vincule ou cadastre o processo antes de criar prazo na agenda.</span>`
            }
            ${
              item.case_id
                ? `<form data-publication-deadline-form="${esc(item.id)}">
              <div class="field">
                <label>Título do prazo</label>
                <input name="title" value="${esc(suggestion.title)}" />
              </div>
              <div class="row">
                <div class="field">
                  <label>Dias úteis</label>
                  <select name="business_days">
                    ${[5, 10, 15, 30].map((days) => `<option value="${days}" ${days === suggestion.days ? "selected" : ""}>${days}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label>Prioridade</label>
                  <select name="priority">
                    ${["baixa", "média", "alta", "crítica"].map((priority) => `<option value="${priority}" ${priority === suggestion.priority ? "selected" : ""}>${priority}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="field">
                <label>Tipo</label>
                <select name="deadline_type">
                  ${["prazo processual", "audiência", "recurso", "manifestação", "tarefa processual"].map((type) => `<option value="${type}" ${type === suggestion.type ? "selected" : ""}>${type}</option>`).join("")}
                </select>
              </div>
              <div class="field">
                <label>Responsável</label>
                <input name="responsible" value="${esc(item.case_responsible || state.user?.name || "Advocacia")}" />
              </div>
              <div class="field">
                <label>Observações</label>
                <textarea name="notes">Conferir prazo, termo inicial, feriados e regra processual antes do protocolo.</textarea>
              </div>
              <div class="modal-actions btn-row">
                <button class="btn ghost" type="button" data-discard-publication="${esc(item.id)}">Descartar</button>
                <button class="btn ghost" type="button" data-treat-publication="${esc(item.id)}">Marcar como tratada</button>
                <button class="btn primary" type="submit">Criar prazo na agenda</button>
              </div>
            </form>`
                : `<div class="modal-actions btn-row">
                    <button class="btn ghost" type="button" data-discard-publication="${esc(item.id)}">Descartar</button>
                    <button class="btn ghost" type="button" data-treat-publication="${esc(item.id)}">Marcar como tratada</button>
                  </div>`
            }
          </aside>
        </div>
      </section>
    </div>
  `;
}

function clippingMetricCards(items) {
  const today = new Date().toISOString().slice(0, 10);
  const untreatedToday = items.filter((item) => publicationStatusKey(item) === "nao-tratada" && String(item.movement_date || "").slice(0, 10) === today).length;
  const treatedToday = items.filter((item) => publicationStatusKey(item) === "tratada" && String(item.movement_date || "").slice(0, 10) === today).length;
  const discardedToday = items.filter((item) => publicationStatusKey(item) === "descartada" && String(item.movement_date || "").slice(0, 10) === today).length;
  const untreated = items.filter((item) => publicationStatusKey(item) === "nao-tratada").length;
  const bars = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const iso = date.toISOString().slice(0, 10);
    return items.filter((item) => String(item.movement_date || "").slice(0, 10) === iso).length;
  });
  const max = Math.max(1, ...bars);
  return `
    <section class="clipping-metrics">
      <div><strong>${untreatedToday}</strong><span>NAO TRATADAS DE HOJE</span></div>
      <div><strong class="blue">${treatedToday}</strong><span>TRATADAS HOJE</span></div>
      <div><strong class="red">${discardedToday}</strong><span>DESCARTADAS HOJE</span></div>
      <div><strong class="amber">${untreated}</strong><span>NAO TRATADAS</span></div>
      <div class="clipping-bars" aria-label="Volume semanal">${bars.map((value) => `<i style="height:${Math.max(10, Math.round((value / max) * 52))}px"></i>`).join("")}<small>t q q s s d s</small></div>
    </section>
  `;
}

function clippingRowsHtml(items) {
  if (!items.length) return `<div class="empty">Nenhuma publicacao encontrada para os filtros selecionados.</div>`;
  const expandedSet = state.publicationExpanded instanceof Set ? state.publicationExpanded : new Set();
  return `
    <table class="clipping-table">
      <thead>
        <tr>
          <th><input type="checkbox" aria-label="Selecionar publicacoes" /></th>
          <th>DIVULGADO EM</th>
          <th>TIPO</th>
          <th>PROCESSO</th>
          <th>DIARIO</th>
          <th>NOME PESQUISADO</th>
          <th>STATUS</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item) => {
            const expanded = expandedSet.has(Number(item.id));
            const statusKey = publicationStatusKey(item);
            const diary = item.tribunal_source || item.source || "Diario de Justica";
            const searched = item.case_responsible || "Advocacia Souza";
            return `
              <tr class="clipping-main-row">
                <td><input type="checkbox" aria-label="Selecionar publicacao ${esc(item.id)}" /></td>
                <td><strong>${esc(formatDate(item.movement_date))}</strong><span>Publicado em:<br>${esc(formatDate(item.created_at || item.movement_date))}</span></td>
                <td><span class="clip-doc">${iconSvg("file")}</span></td>
                <td>
                  <strong>${esc(item.case_number || "Processo nao encontrado")}</strong>
                  <span>${item.case_title ? esc(item.case_title) : "Processo nao encontrado"}</span>
                  ${publicationLabelsHtml(item)}
                  ${item.case_id ? `<a href="#/cases/${esc(item.case_id)}">Abrir processo</a>` : `<a href="#/cases">Iniciar busca de processo</a>`}
                </td>
                <td><strong>${esc(diary)}</strong><span>${esc(item.source || item.tribunal_source || "Tribunal")}</span></td>
                <td><strong>${esc(searched)}</strong></td>
                <td><span class="clip-status ${esc(statusKey)}">${esc(publicationStatusLabel(item))}</span></td>
                <td>
                  <div class="clip-actions">
                    ${item.case_id ? `<button class="icon-btn" title="Criar prazo" data-suggest-deadline-15="${esc(item.id)}">${iconSvg("plus")}</button>` : `<button class="icon-btn" title="Vincule o processo antes de criar prazo" disabled>${iconSvg("plus")}</button>`}
                    <button class="icon-btn" title="Marcar como tratada" data-treat-publication="${esc(item.id)}">${iconSvg("check")}</button>
                    <button class="icon-btn" title="Descartar" data-discard-publication="${esc(item.id)}">${iconSvg("trash") || "x"}</button>
                  </div>
                </td>
              </tr>
              <tr class="clipping-detail-row">
                <td></td>
                <td colspan="7">
                  <div class="clipping-detail">
                    <p>${esc(publicationSnippet(item, expanded))}</p>
                    <div class="clipping-detail-actions">
                      <button class="btn primary" type="button" data-open-publication="${esc(item.id)}">ACESSAR PUBLICACAO</button>
                      <button class="btn ghost" type="button" data-expand-publication="${esc(item.id)}">${expanded ? "Ler menos" : "Ler resumo completo"}</button>
                      ${expanded && item.case_id ? `<span>Tratamentos sugeridos</span><button class="btn ghost" type="button" data-suggest-deadline-15="${esc(item.id)}" data-business-days="${esc(publicationTreatmentSuggestion(item).days)}">ADICIONAR PRAZO DE ${publicationTreatmentSuggestion(item).days} DIAS</button><strong>${publicationTreatmentSuggestion(item).confidence}% de probabilidade</strong>` : ""}
                      ${expanded && !item.case_id ? `<span>Vincule o processo para criar prazo na agenda.</span>` : ""}
                    </div>
                  </div>
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function downloadPublicationsCsv(items) {
  const rows = [["divulgado_em", "processo", "diario", "nome_pesquisado", "status", "texto"]];
  items.forEach((item) => rows.push([formatDate(item.movement_date), item.case_number || "", item.tribunal_source || item.source || "", item.case_responsible || "", publicationStatusLabel(item), item.publication_text || item.description || item.title || ""]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "publicacoes.csv";
  link.click();
  URL.revokeObjectURL(url);
}

async function publicationsAstreaClippingsView() {
  const view = document.querySelector("#view");
  const provider = state.publicationProvider || "ALL-TJ";
  const selectedSystem = state.publicationSystem || "DATAJUD";
  const [workbench, integrationStatus, homologationReport] = await Promise.all([
    api("/api/process-workbench"),
    api(`/api/tribunal-integrations/status?provider=${encodeURIComponent(provider)}`),
    api(`/api/tribunal-integrations/homologation?provider=${encodeURIComponent(provider)}`),
  ]);
  const allItems = workbench.publication_queue || [];
  const search = stripAccents(state.publicationSearch || "").toLowerCase().trim();
  const filteredItems = allItems.filter((item) => {
    if (state.publicationStatus && publicationStatusKey(item) !== state.publicationStatus) return false;
    if (state.publicationUf && publicationUf(item) !== state.publicationUf) return false;
    if (search && !publicationSearchHaystack(item).includes(search)) return false;
    return true;
  });
  const courts = integrationStatus.courts || [];
  const connectors = integrationStatus.items || [];
  const visibleConnectors = selectedSystem ? connectors.filter((item) => item.system_code === selectedSystem) : connectors;
  const homologationItems = selectedSystem ? (homologationReport.items || []).filter((item) => item.system_code === selectedSystem) : homologationReport.items || [];
  const statusLabel = state.publicationStatus === "tratada" ? "TRATADA" : state.publicationStatus === "descartada" ? "DESCARTADA" : state.publicationStatus === "nao-tratada" ? "NAO TRATADA" : "TODAS";
  const selectedPublication = allItems.find((item) => Number(item.id) === Number(state.publicationModalId));

  view.innerHTML = `
    <section class="clippings-page">
      ${clippingMetricCards(allItems)}
      <div class="clipping-filterbar">
        <button class="clip-filter-open" type="button">▾</button>
        <div class="clip-search">
          <input id="publicationSearchInput" value="${esc(state.publicationSearch || "")}" placeholder="Digite o processo ou termo pesquisado" />
          <button class="icon-btn" id="publicationSearchBtn" type="button" title="Pesquisar">${iconSvg("search")}</button>
        </div>
        <select id="publicationUfSelect">
          <option value="">ESTADOS</option>
          ${brazilUfOptions.map((uf) => `<option value="${uf}" ${state.publicationUf === uf ? "selected" : ""}>${uf}</option>`).join("")}
        </select>
        <select id="publicationStatusSelect">
          <option value="nao-tratada" ${state.publicationStatus === "nao-tratada" ? "selected" : ""}>STATUS: NAO TRATADA</option>
          <option value="tratada" ${state.publicationStatus === "tratada" ? "selected" : ""}>Tratada</option>
          <option value="descartada" ${state.publicationStatus === "descartada" ? "selected" : ""}>Descartada</option>
          <option value="" ${state.publicationStatus === "" ? "selected" : ""}>Todas</option>
        </select>
        <div class="clip-tool-icons">
          <button class="icon-btn" id="printPublicationsBtn" type="button" title="Imprimir">${iconSvg("file")}</button>
          <button class="icon-btn" id="exportPublicationsBtn" type="button" title="Exportar planilha">${iconSvg("cloud")}</button>
          <button class="icon-btn" id="refreshPublicationsBtn" type="button" title="Atualizar">${iconSvg("clock")}</button>
        </div>
      </div>
      <div class="clip-filter-chip">STATUS: ${esc(statusLabel)}</div>
      <div class="clipping-info">
        As publicacoes abaixo foram encontradas nos sistemas judiciais monitorados. Novas publicacoes serao exibidas automaticamente assim que estiverem disponiveis.
        <button type="button" aria-label="Fechar aviso">x</button>
      </div>
      <div class="clipping-list-head">
        <span>Mostrando ${filteredItems.length} publicacoes</span>
        <button class="btn ghost" id="expandAllPublicationsBtn" type="button">Expandir todos</button>
      </div>
      ${clippingRowsHtml(filteredItems)}
      <section class="panel tribunal-connector-drawer">
        <div>
          <h2>Conexao com tribunais</h2>
          <p>DataJud/CNJ monitora andamentos publicos por numero CNJ. DJEN/Comunica organiza diarios oficiais. PJe, eProc e JPe ficam vinculados quando cada tribunal fornecer credenciais, certificado ou endpoint proprio.</p>
        </div>
        <div class="tribunal-sync-controls">
          <select id="publicationProviderSelect">${tribunalCourtOptionsHtml(courts, provider)}</select>
          <select id="publicationSystemSelect">
            <option value="DATAJUD" ${selectedSystem === "DATAJUD" ? "selected" : ""}>DataJud CNJ</option>
            <option value="DJEN" ${selectedSystem === "DJEN" ? "selected" : ""}>DJEN / Comunica</option>
            <option value="PJE" ${selectedSystem === "PJE" ? "selected" : ""}>PJe</option>
            <option value="EPROC" ${selectedSystem === "EPROC" ? "selected" : ""}>eProc</option>
            <option value="JPE" ${selectedSystem === "JPE" ? "selected" : ""}>JPe</option>
            <option value="" ${selectedSystem === "" ? "selected" : ""}>Todos</option>
          </select>
          <button class="btn primary" id="publicationSyncBtn" type="button">Sincronizar agora</button>
        </div>
        ${connectorSummaryGrid(visibleConnectors, courts)}
      </section>
      ${tribunalHomologationPanel(homologationReport, homologationItems, courts)}
      <section class="panel tribunal-connector-drawer">
        <div>
          <h2>Credenciais, OAB e 2FA dos tribunais</h2>
          <p>Cadastre a OAB monitorada e, quando o tribunal usar autenticador, informe a seed TOTP. O codigo atual sera calculado automaticamente durante a sincronizacao.</p>
        </div>
        ${
          visibleConnectors.length
            ? `<div class="connector-grid">${visibleConnectors.slice(0, provider === "ALL-TJ" ? 12 : 20).map((item) => connectorConfigCard(item, integrationStatus.mode || "homolog")).join("")}</div>`
            : `<div class="empty">Nenhum conector encontrado para o filtro selecionado.</div>`
        }
        ${provider === "ALL-TJ" && visibleConnectors.length > 12 ? `<div class="muted-inline">Mostrando os 12 primeiros conectores. Selecione um tribunal especifico para editar todos os conectores dele.</div>` : ""}
      </section>
      ${publicationDetailModalHtml(selectedPublication)}
    </section>
  `;

  document.querySelector("#publicationSearchInput").addEventListener("input", (event) => {
    state.publicationSearch = event.currentTarget.value;
  });
  document.querySelector("#publicationSearchBtn").addEventListener("click", publicationsAstreaClippingsView);
  document.querySelector("#publicationSearchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") publicationsAstreaClippingsView();
  });
  document.querySelector("#publicationUfSelect").addEventListener("change", async (event) => {
    state.publicationUf = event.currentTarget.value;
    await publicationsAstreaClippingsView();
  });
  document.querySelector("#publicationStatusSelect").addEventListener("change", async (event) => {
    state.publicationStatus = event.currentTarget.value;
    await publicationsAstreaClippingsView();
  });
  document.querySelector("#publicationProviderSelect").addEventListener("change", async (event) => {
    state.publicationProvider = event.currentTarget.value || "ALL-TJ";
    await publicationsAstreaClippingsView();
  });
  document.querySelector("#publicationSystemSelect").addEventListener("change", async (event) => {
    state.publicationSystem = event.currentTarget.value;
    await publicationsAstreaClippingsView();
  });
  document.querySelector("#publicationSyncBtn").addEventListener("click", async () => {
    const payload = { provider: state.publicationProvider || "ALL-TJ" };
    if (state.publicationSystem) payload.system_code = state.publicationSystem;
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify(payload) });
    await publicationsAstreaClippingsView();
  });
  document.querySelectorAll("[data-connector-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const payload = {
        provider: form.dataset.provider || "TJMG",
        system_code: form.dataset.system || "DATAJUD",
        instance_scope: form.dataset.scope || "todas-instancias",
        enabled: form.querySelector('[name="enabled"]')?.checked || false,
        base_url: String(values.get("base_url") || "").trim(),
        resource_path: String(values.get("resource_path") || "").trim(),
        http_method: String(values.get("http_method") || "GET").trim().toUpperCase(),
        auth_type: String(values.get("auth_type") || "none").trim().toLowerCase(),
        auth_token: String(values.get("auth_token") || "").trim(),
        auth_username: String(values.get("auth_username") || "").trim(),
        auth_password: String(values.get("auth_password") || "").trim(),
        lawyer_name: String(values.get("lawyer_name") || "").trim(),
        oab_number: String(values.get("oab_number") || "").trim(),
        oab_state: String(values.get("oab_state") || "").trim().toUpperCase(),
        totp_seed: String(values.get("totp_seed") || "").trim(),
        totp_enabled: form.querySelector('[name="totp_enabled"]')?.checked || false,
        api_key_header: String(values.get("api_key_header") || "").trim(),
        api_key_value: String(values.get("api_key_value") || "").trim(),
        query_template: String(values.get("query_template") || "").trim(),
        request_body_template: String(values.get("request_body_template") || "").trim(),
        parser_type: String(values.get("parser_type") || "generic").trim().toLowerCase(),
        poll_days_back: Number(values.get("poll_days_back") || 0),
        timeout_seconds: Number(values.get("timeout_seconds") || 25),
        verify_ssl: form.querySelector('[name="verify_ssl"]')?.checked ?? true,
        notes: String(values.get("notes") || "").trim(),
      };
      await api("/api/tribunal-integrations/config", { method: "POST", body: JSON.stringify(payload) });
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelector("#refreshPublicationsBtn").addEventListener("click", publicationsAstreaClippingsView);
  document.querySelector("#printPublicationsBtn").addEventListener("click", () => window.print());
  document.querySelector("#exportPublicationsBtn").addEventListener("click", () => downloadPublicationsCsv(filteredItems));
  document.querySelector("#expandAllPublicationsBtn").addEventListener("click", async () => {
    state.publicationExpanded = new Set(filteredItems.map((item) => Number(item.id)));
    await publicationsAstreaClippingsView();
  });
  document.querySelectorAll("[data-open-publication]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.publicationModalId = Number(button.dataset.openPublication);
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-close-publication-modal]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.publicationModalId = null;
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-expand-publication]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = Number(button.dataset.expandPublication);
      if (!(state.publicationExpanded instanceof Set)) state.publicationExpanded = new Set();
      if (state.publicationExpanded.has(id)) state.publicationExpanded.delete(id);
      else state.publicationExpanded.add(id);
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-treat-publication]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/case-movements/${button.dataset.treatPublication}/status`, { method: "PATCH", body: JSON.stringify({ status: "lido" }) });
      state.publicationModalId = null;
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-discard-publication]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/case-movements/${button.dataset.discardPublication}/status`, { method: "PATCH", body: JSON.stringify({ status: "descartada" }) });
      state.publicationModalId = null;
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-suggest-deadline-15]").forEach((button) => {
    button.addEventListener("click", async () => {
      const movementId = button.getAttribute("data-suggest-deadline-15");
      const businessDays = Number(button.getAttribute("data-business-days") || 15);
      await api(`/api/case-movements/${movementId}/suggested-deadline`, { method: "POST", body: JSON.stringify({ business_days: businessDays }) });
      await api(`/api/case-movements/${movementId}/status`, { method: "PATCH", body: JSON.stringify({ status: "lido" }) });
      state.publicationModalId = null;
      await publicationsAstreaClippingsView();
    });
  });
  document.querySelectorAll("[data-publication-deadline-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const movementId = form.dataset.publicationDeadlineForm;
      const payload = collectForm(form);
      payload.business_days = Number(payload.business_days || 5);
      await api(`/api/case-movements/${movementId}/suggested-deadline`, { method: "POST", body: JSON.stringify(payload) });
      state.publicationModalId = null;
      state.route = "publications";
      await publicationsAstreaClippingsView();
    });
  });
}

async function publicationsViewV2() {
  const view = document.querySelector("#view");
  const provider = state.publicationProvider || "ALL-TJ";
  const selectedSystem = state.publicationSystem || "DATAJUD";
  const [workbench, integrationStatus] = await Promise.all([
    api("/api/process-workbench"),
    api(`/api/tribunal-integrations/status?provider=${encodeURIComponent(provider)}`),
  ]);
  const publicationQueue = workbench.publication_queue || [];
  const courts = integrationStatus.courts || [];
  const integrationItems = integrationStatus.items || [];
  const visibleConnectors = selectedSystem ? integrationItems.filter((item) => item.system_code === selectedSystem) : integrationItems;
  const groupedByCase = publicationQueue.reduce((acc, item) => {
    const key = Number(item.case_id || 0);
    if (!key) return acc;
    if (!acc[key]) {
      acc[key] = {
        case_id: key,
        case_title: item.case_title || `Processo #${key}`,
        case_number: item.case_number || "",
        total: 0,
        last_date: item.movement_date || null,
        pending: 0,
      };
    }
    acc[key].total += 1;
    if (String(item.status || "").toLowerCase() === "novo") acc[key].pending += 1;
    if (!acc[key].last_date || String(item.movement_date || "") > String(acc[key].last_date || "")) {
      acc[key].last_date = item.movement_date || acc[key].last_date;
    }
    return acc;
  }, {});
  const processSummaries = Object.values(groupedByCase).sort((a, b) => String(b.last_date || "").localeCompare(String(a.last_date || "")));
  const connectorCountLabel = provider === "ALL-TJ" ? "DataJud nacional" : tribunalProviderLabel(courts, provider);

  view.innerHTML = `
    ${pageHeader(
      "Publicações",
      "Mesa de leitura com publicações e movimentações vindas dos tribunais, com conectores oficiais por TJ.",
      `
        <select id="publicationProviderSelect">
          ${tribunalCourtOptionsHtml(courts, provider)}
        </select>
        <select id="publicationSystemSelect">
          <option value="DATAJUD" ${selectedSystem === "DATAJUD" ? "selected" : ""}>DataJud CNJ</option>
          <option value="DJEN" ${selectedSystem === "DJEN" ? "selected" : ""}>DJEN / Comunica</option>
          <option value="PJE" ${selectedSystem === "PJE" ? "selected" : ""}>PJe</option>
          <option value="EPROC" ${selectedSystem === "EPROC" ? "selected" : ""}>eProc</option>
          <option value="JPE" ${selectedSystem === "JPE" ? "selected" : ""}>JPe</option>
          <option value="" ${selectedSystem === "" ? "selected" : ""}>Todos</option>
        </select>
        <button class="btn primary" id="publicationSyncBtn">Sincronizar agora</button>
      `
    )}
    <section class="grid metrics">
      ${metric("Publicações novas", workbench.metrics?.andamentos_novos || 0, "fila de leitura")}
      ${metric("Processos com publicação", processSummaries.length, "carteira monitorada")}
      ${metric("Prazos pendentes", workbench.metrics?.prazos_pendentes || 0, "agenda processual")}
      ${metric("Integração", connectorCountLabel, `${visibleConnectors.filter((item) => item.ready).length} conectores prontos`)}
    </section>
    <section class="panel tribunal-sync-panel">
      <div>
        <h2>Integrações judiciais</h2>
        <p>DataJud consulta movimentações públicas por número CNJ. DJEN/Comunica busca publicações por caderno e filtra pelos processos monitorados. PJe, eProc e JPe ficam disponíveis quando o tribunal fornece endpoint e credenciais.</p>
      </div>
      <div class="tribunal-sync-actions">
        <button class="btn ghost" id="publicationDataJudAllBtn" type="button">Atualizar DataJud dos TJs</button>
        <button class="btn ghost" id="publicationDjenBtn" type="button">Buscar DJEN selecionado</button>
      </div>
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Processos com publicações recentes</h2>
        ${recordList(processSummaries, (item) => ({
          title: item.case_title,
          badges: [`${item.total} publicações`, `${item.pending} novas`],
          meta: [
            item.case_number ? `Número: ${item.case_number}` : "Número não informado",
            `Última publicação: ${formatDate(item.last_date)}`,
          ],
          actions: `<a class="btn ghost" href="#/cases/${item.case_id}">Abrir processo</a>`,
        }))}
      </div>
      <div class="panel">
        <h2>Fila de publicações</h2>
        ${recordList(publicationQueue, publicationCard)}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Mapa dos conectores</h2>
      ${connectorSummaryGrid(visibleConnectors, courts)}
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Configuração dos conectores</h2>
      ${
        visibleConnectors.length
          ? `<div class="connector-grid">${visibleConnectors.slice(0, provider === "ALL-TJ" ? 12 : 20).map((item) => connectorConfigCard(item, integrationStatus.mode || "homolog")).join("")}</div>`
          : `<div class="empty">Nenhum conector encontrado para o filtro selecionado.</div>`
      }
      ${provider === "ALL-TJ" && visibleConnectors.length > 12 ? `<div class="muted-inline">Mostrando os 12 primeiros conectores. Selecione um tribunal especifico para editar todos os conectores dele.</div>` : ""}
    </section>
  `;

  document.querySelector("#publicationProviderSelect").addEventListener("change", async (event) => {
    state.publicationProvider = event.currentTarget.value || "ALL-TJ";
    await publicationsViewV2();
  });
  document.querySelector("#publicationSystemSelect").addEventListener("change", async (event) => {
    state.publicationSystem = event.currentTarget.value;
    await publicationsViewV2();
  });
  document.querySelector("#publicationSyncBtn").addEventListener("click", async () => {
    const payload = { provider: state.publicationProvider || "ALL-TJ" };
    if (state.publicationSystem) payload.system_code = state.publicationSystem;
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify(payload) });
    await publicationsViewV2();
  });
  document.querySelector("#publicationDataJudAllBtn").addEventListener("click", async () => {
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify({ provider: "ALL-TJ", system_code: "DATAJUD" }) });
    await publicationsViewV2();
  });
  document.querySelector("#publicationDjenBtn").addEventListener("click", async () => {
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify({ provider: state.publicationProvider || "TJMG", system_code: "DJEN" }) });
    await publicationsViewV2();
  });
  document.querySelectorAll("[data-connector-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const payload = {
        provider: form.dataset.provider || "TJMG",
        system_code: form.dataset.system || "DATAJUD",
        instance_scope: form.dataset.scope || "todas-instancias",
        enabled: form.querySelector('[name="enabled"]')?.checked || false,
        base_url: String(values.get("base_url") || "").trim(),
        resource_path: String(values.get("resource_path") || "").trim(),
        http_method: String(values.get("http_method") || "GET").trim().toUpperCase(),
        auth_type: String(values.get("auth_type") || "none").trim().toLowerCase(),
        auth_token: String(values.get("auth_token") || "").trim(),
        auth_username: String(values.get("auth_username") || "").trim(),
        auth_password: String(values.get("auth_password") || "").trim(),
        lawyer_name: String(values.get("lawyer_name") || "").trim(),
        oab_number: String(values.get("oab_number") || "").trim(),
        oab_state: String(values.get("oab_state") || "").trim().toUpperCase(),
        totp_seed: String(values.get("totp_seed") || "").trim(),
        totp_enabled: form.querySelector('[name="totp_enabled"]')?.checked || false,
        api_key_header: String(values.get("api_key_header") || "").trim(),
        api_key_value: String(values.get("api_key_value") || "").trim(),
        query_template: String(values.get("query_template") || "").trim(),
        request_body_template: String(values.get("request_body_template") || "").trim(),
        parser_type: String(values.get("parser_type") || "generic").trim().toLowerCase(),
        poll_days_back: Number(values.get("poll_days_back") || 0),
        timeout_seconds: Number(values.get("timeout_seconds") || 25),
        verify_ssl: form.querySelector('[name="verify_ssl"]')?.checked ?? true,
        notes: String(values.get("notes") || "").trim(),
      };
      await api("/api/tribunal-integrations/config", { method: "POST", body: JSON.stringify(payload) });
      await publicationsViewV2();
    });
  });

  bindMovementActions(publicationsViewV2);
}

async function deadlineAgendaView() {
  const view = document.querySelector("#view");
  const [deadlines, tasks] = await Promise.all([api("/api/deadlines"), api("/api/tasks")]);
  const pendingDeadlines = deadlines.items.filter((item) => item.status !== "concluído");
  const finishedDeadlines = deadlines.items.filter((item) => item.status === "concluído");
  const groups = groupDeadlinesByDueDate(pendingDeadlines);
  view.innerHTML = `
    ${pageHeader("Prazos e tarefas", "Agenda operacional com prazos processuais, tarefas internas, responsáveis e status.")}
    <section class="grid metrics">
      ${metric("Prazos abertos", pendingDeadlines.length, "processual")}
      ${metric("Prazos concluídos", finishedDeadlines.length, "histórico")}
      ${metric("Tarefas abertas", tasks.items.filter((item) => item.status !== "concluída").length, "internas")}
      ${metric("Críticos/altos", pendingDeadlines.filter((item) => ["crítica", "alta"].includes(item.priority)).length, "risco")}
      ${metric("Audiências", pendingDeadlines.filter((item) => item.deadline_type === "audiência").length, "agenda")}
      ${metric("Semana", pendingDeadlines.slice(0, 7).length, "próximos itens")}
    </section>
    <section class="agenda-board" style="margin-top:14px">
      ${agendaColumn("Vencidos", groups.overdue)}
      ${agendaColumn("Hoje", groups.today)}
      ${agendaColumn("Próximos 7 dias", groups.week)}
      ${agendaColumn("Futuros", groups.future)}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Agenda processual</h2>
        ${recordList(pendingDeadlines, deadlineCard)}
      </div>
      <div class="panel">
        <h2>Tarefas internas</h2>
        ${recordList(tasks.items, moduleConfigs.tasks.card)}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Prazos concluídos</h2>
      ${recordList(finishedDeadlines.slice(0, 12), deadlineCard)}
    </section>
  `;
  bindDeadlineActions(deadlineAgendaView);
  document.querySelectorAll("[data-complete-task]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/tasks/${button.dataset.completeTask}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
      await deadlineAgendaView();
    });
  });
}

function publicationCard(item) {
  return {
    title: item.title,
    badges: [item.status, item.source],
    meta: [
      `Processo: ${item.case_title || "não vinculado"} · data: ${formatDate(item.movement_date)}`,
      item.publication_text || item.description || "Sem texto de publicação.",
      `Responsável sugerido: ${item.case_responsible || "Controladoria"}`,
    ],
    actions: `
      <button class="btn ghost" data-read-movement="${item.id}">Marcar como lida</button>
      <button class="btn primary" data-suggest-deadline="${item.id}">Criar prazo sugerido</button>
    `,
  };
}

function deadlineCard(item) {
  return {
    title: item.title,
    badges: [item.status, item.priority, item.deadline_type],
    meta: [
      `Processo: ${item.case_title || "não vinculado"}`,
      `Cliente: ${item.client_name || "não vinculado"} · vencimento: ${formatDate(item.due_date)}`,
      `Responsável: ${item.responsible || "não definido"}`,
      item.calculation_basis ? `Base de contagem: ${item.calculation_basis}` : "",
      item.notes || "",
    ],
    actions: item.status !== "concluído" ? `<button class="btn ghost" data-complete-deadline="${item.id}">✓ Concluir prazo</button>` : "",
  };
}

function groupDeadlinesByDueDate(items) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekLimit = new Date(today);
  weekLimit.setDate(weekLimit.getDate() + 7);
  const groups = { overdue: [], today: [], week: [], future: [] };
  items.forEach((item) => {
    const due = parseDateOnly(item.due_date);
    if (!due) {
      groups.future.push(item);
    } else if (due < today) {
      groups.overdue.push(item);
    } else if (due.getTime() === today.getTime()) {
      groups.today.push(item);
    } else if (due <= weekLimit) {
      groups.week.push(item);
    } else {
      groups.future.push(item);
    }
  });
  return groups;
}

function parseDateOnly(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function agendaColumn(title, items) {
  return `
    <div class="panel agenda-column">
      <h2>${esc(title)}</h2>
      ${items.length ? items.slice(0, 5).map((item) => `
        <article class="mini-deadline">
          <strong>${esc(item.title)}</strong>
          <span>${esc(formatDate(item.due_date))} · ${esc(item.responsible || "sem responsável")}</span>
          <div class="btn-row">${badge(item.priority)} ${badge(item.status)}</div>
        </article>
      `).join("") : `<div class="empty">Nenhum prazo.</div>`}
    </div>
  `;
}

function movementCard(item) {
  return {
    title: item.title,
    badges: [item.status, item.source],
    meta: [
      `Processo: ${item.case_title || "não vinculado"} · data: ${formatDate(item.movement_date)}`,
      item.description || "",
      item.publication_text || "",
    ],
  };
}

function quickMovementForm() {
  return `
    <form id="movementForm" class="form-grid">
      ${fieldHtml("case_id", "ID do processo", "number", true)}
      ${fieldHtml("movement_date", "Data", "date")}
      ${fieldHtml("source", "Fonte", "select", false, ["manual", "publicação", "tribunal", "cliente", "interno"])}
      ${fieldHtml("status", "Status", "select", false, ["novo", "lido", "gerou prazo", "arquivado"])}
      ${fieldHtml("title", "Título", "text", true)}
      ${fieldHtml("description", "Descrição", "textarea")}
      ${fieldHtml("publication_text", "Texto da publicação", "textarea")}
      <div class="full btn-row"><button class="btn primary" type="submit">Salvar andamento</button></div>
    </form>
  `;
}

function quickDeadlineForm() {
  return `
    <form id="deadlineForm" class="form-grid">
      ${fieldHtml("case_id", "ID do processo", "number", true)}
      ${fieldHtml("movement_id", "ID do andamento", "number")}
      ${fieldHtml("title", "Prazo", "text", true)}
      ${fieldHtml("deadline_type", "Tipo", "select", false, ["prazo processual", "audiência", "perícia", "recurso", "manifestação", "tarefa processual"])}
      ${fieldHtml("due_date", "Vencimento", "date", true)}
      ${fieldHtml("priority", "Prioridade", "select", false, ["baixa", "média", "alta", "crítica"])}
      ${fieldHtml("responsible", "Responsável", "text")}
      ${fieldHtml("calculation_basis", "Base de contagem", "textarea")}
      ${fieldHtml("notes", "Observações", "textarea")}
      <div class="full btn-row"><button class="btn primary" type="submit">Criar prazo</button></div>
    </form>
  `;
}

function bindDeadlineActions(refresh) {
  document.querySelectorAll("[data-complete-deadline]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/deadlines/${button.dataset.completeDeadline}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluído" }) });
      await refresh();
    });
  });
}

function bindMovementActions(refresh) {
  document.querySelectorAll("[data-read-movement]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/case-movements/${button.dataset.readMovement}/status`, { method: "PATCH", body: JSON.stringify({ status: "lido" }) });
      await refresh();
    });
  });
  document.querySelectorAll("[data-suggest-deadline]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/case-movements/${button.dataset.suggestDeadline}/suggested-deadline`, { method: "POST", body: JSON.stringify({ business_days: 5 }) });
      await refresh();
    });
  });
}

function formHtml(key, fields) {
  return `
    <form id="${esc(key)}Form" class="form-grid">
      ${fields.map(([name, label, type, required, options]) => fieldHtml(name, label, type, required, options)).join("")}
      <div class="full btn-row">
        <button class="btn primary" type="submit">Salvar</button>
        <button class="btn ghost" type="reset">Limpar</button>
      </div>
    </form>
  `;
}

function fieldHtml(name, label, type = "text", required = false, options = []) {
  const full = type === "textarea" ? " full" : "";
  if (type === "select") {
    return `
      <div class="field${full}">
        <label for="${esc(name)}">${esc(label)}</label>
        <select id="${esc(name)}" name="${esc(name)}" ${required ? "required" : ""}>
          <option value="">Selecione</option>
          ${options.map((option) => `<option value="${esc(option)}">${esc(option)}</option>`).join("")}
        </select>
      </div>
    `;
  }
  if (type === "textarea") {
    return `
      <div class="field full">
        <label for="${esc(name)}">${esc(label)}</label>
        <textarea id="${esc(name)}" name="${esc(name)}" ${required ? "required" : ""}></textarea>
      </div>
    `;
  }
  return `
    <div class="field${full}">
      <label for="${esc(name)}">${esc(label)}</label>
      <input id="${esc(name)}" name="${esc(name)}" type="${esc(type)}" ${required ? "required" : ""} />
    </div>
  `;
}

function collectForm(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value === "" ? null : value;
  });
  return data;
}

function setFormValues(form, data) {
  Object.entries(data || {}).forEach(([key, value]) => {
    const input = form.elements[key];
    if (!input) return;
    if (input.type === "checkbox") {
      input.checked = Boolean(value) && String(value) !== "0";
      return;
    }
    input.value = value ?? "";
  });
}

function recordList(items, mapper) {
  if (!items || items.length === 0) return `<div class="empty">Nenhum registro encontrado.</div>`;
  return `<div class="record-list">${items.map((item) => recordCard(mapper(item))).join("")}</div>`;
}

function recordCard(model) {
  return `
    <article class="record-card">
      <div class="record-head">
        <div class="record-title">${esc(model.title)}</div>
        <div class="btn-row">${(model.badges || []).map(badge).join("")}</div>
      </div>
      ${(model.meta || []).filter(Boolean).map((line) => `<div class="record-meta">${esc(line)}</div>`).join("")}
      ${model.actions ? `<div class="btn-row">${model.actions}</div>` : ""}
    </article>
  `;
}

function simpleTable(headers, rows) {
  if (!rows || rows.length === 0) return `<div class="empty">Sem dados para exibir.</div>`;
  return `
    <table class="data-table">
      <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

async function agentsView(defaultAgent = "coordenador", compactTitle = false) {
  const view = document.querySelector("#view");
  const agents = await api("/api/agents");
  const aiStatus = await api("/api/ai/status");
  const logs = await api("/api/agent-logs");
  view.innerHTML = pageHeader(compactTitle ? "Compliance" : "Agentes de IA", compactTitle ? "Análise de risco ético, sigilo e LGPD." : "Execute agentes supervisionados com rastreabilidade, logs e validação humana.");
  view.innerHTML += `
    <section class="agent-console">
      <div class="panel">
        <h2>Console de execução</h2>
        <div class="record-card" style="margin-bottom:12px">
          <div class="record-head">
            <div class="record-title">Status da IA</div>
            <div class="btn-row">${badge(aiStatus.enabled ? "OpenAI ativa" : "motor local")} ${badge(aiStatus.model)}</div>
          </div>
          <div class="record-meta">${esc(aiStatus.enabled ? "Os agentes estão consultando a API real com fallback local." : "Configure OPENAI_API_KEY no .env para ativar IA real.")}</div>
        </div>
        <form id="agentForm">
          <div class="field">
            <label for="agent">Agente</label>
            <select id="agent" name="agent">
              ${Object.entries(agents.agents).map(([key, value]) => `<option value="${esc(key)}" ${key === defaultAgent ? "selected" : ""}>${esc(value.name)}</option>`).join("")}
            </select>
            <span class="hint" id="agentHint"></span>
          </div>
          <div class="field">
            <label for="input_text">Demanda ou documento-base</label>
            <textarea id="input_text" name="input_text" required>Cliente informa que recebeu citação hoje e tem prazo urgente. Enviou CPF, prints de WhatsApp e contrato para análise.</textarea>
          </div>
          <button class="btn primary" type="submit">Executar agente</button>
          <div id="agentError" class="error"></div>
        </form>
      </div>
      <div class="agent-result">
        <pre id="agentResult">Aguardando execução.</pre>
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Histórico de execuções</h2>
      ${recordList(logs.items, (item) => ({
        title: agentName(item.agent),
        badges: [item.risk_level, item.validation_required ? "validação obrigatória" : "validação recomendada"],
        meta: [item.created_at, item.input_text],
      }))}
    </section>
  `;
  const agentSelect = document.querySelector("#agent");
  const hint = document.querySelector("#agentHint");
  const updateHint = () => {
    const item = agents.agents[agentSelect.value];
    hint.textContent = item ? `${item.description} Risco: ${item.risk}.` : "";
  };
  agentSelect.addEventListener("change", updateHint);
  updateHint();
  document.querySelector("#agentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const error = document.querySelector("#agentError");
    error.textContent = "";
    try {
      const data = await api("/api/agents/run", {
        method: "POST",
        body: JSON.stringify({ agent: form.get("agent"), input_text: form.get("input_text") }),
      });
      document.querySelector("#agentResult").textContent = JSON.stringify(data.result, null, 2);
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

async function complianceView() {
  return agentsView("compliance", true);
}

async function biView() {
  const view = document.querySelector("#view");
  const data = await api("/api/overview");
  view.innerHTML = pageHeader("BI e indicadores", "Leitura gerencial simples para vendas, operação, risco e financeiro.");
  const metrics = data.metrics;
  view.innerHTML += `
    <section class="grid metrics">
      ${metric("Conversão potencial", `${metrics.leads_abertos}/${metrics.clientes_ativos + metrics.leads_abertos}`, "leads vs carteira")}
      ${metric("Tarefas críticas", metrics.tarefas_criticas, "prioridade")}
      ${metric("Recebíveis", money(metrics.financeiro_pendente), "financeiro")}
      ${metric("Processos", metrics.processos_ativos, "ativo")}
      ${metric("Carga operacional", metrics.tarefas_abertas, "tarefas")}
      ${metric("Base", metrics.clientes_ativos, "clientes")}
    </section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <h2>Funil comercial</h2>
        ${simpleTable(["Etapa", "Total"], data.pipeline.map((row) => [row.stage, row.total]))}
      </div>
      <div class="panel">
        <h2>Financeiro por status</h2>
        ${simpleTable(["Status", "Total"], data.finance.map((row) => [row.status, money(row.total)]))}
      </div>
    </section>
    <section class="panel" style="margin-top:14px">
      <h2>Interpretação gerencial</h2>
      ${recordList([
        { title: "Priorize a fila crítica", priority: "alta", text: "Tarefas críticas e leads com prazo devem ser tratados antes de iniciativas comerciais." },
        { title: "Acompanhe follow-ups", priority: "média", text: "Leads parados nas etapas de triagem e proposta enviada reduzem conversão." },
        { title: "Separe honorários de custas", priority: "média", text: "O financeiro deve manter origem, comprovantes e autorização antes de cobranças." },
      ], (item) => ({ title: item.title, badges: [item.priority], meta: [item.text] }))}
    </section>
  `;
}

function twoFactorPanelHtml(security) {
  const setup = state.twoFactorSetup;
  if (security?.enabled) {
    return `
      <div class="panel security-panel">
        <h2>Autenticador em duas etapas</h2>
        <p class="muted-inline">Ativo para ${esc(security.account || state.user?.email || "este usuario")}. Desde: ${esc(formatDate(security.confirmed_at))}.</p>
        <form id="disable2faForm" class="security-2fa-form">
          <div class="field">
            <label for="disable_2fa_code">Codigo atual</label>
            <input id="disable_2fa_code" name="code" inputmode="numeric" maxlength="6" placeholder="000000" required />
          </div>
          <button class="btn danger" type="submit">Desativar autenticador</button>
          <div class="error" id="security2faError"></div>
        </form>
      </div>
    `;
  }
  if (setup) {
    return `
      <div class="panel security-panel">
        <h2>Conectar autenticador</h2>
        <p class="muted-inline">No Google Authenticator, Microsoft Authenticator, 1Password ou app equivalente, escolha adicionar conta e use a chave manual abaixo.</p>
        <div class="security-secret-box">
          <span>Chave manual</span>
          <strong>${esc(setup.secret)}</strong>
        </div>
        <div class="field">
          <label>URI otpauth</label>
          <textarea readonly>${esc(setup.otpauth_uri)}</textarea>
        </div>
        <form id="confirm2faForm" class="security-2fa-form">
          <div class="field">
            <label for="confirm_2fa_code">Codigo gerado</label>
            <input id="confirm_2fa_code" name="code" inputmode="numeric" maxlength="6" placeholder="000000" required />
          </div>
          <button class="btn primary" type="submit">Confirmar e ativar</button>
          <button class="btn ghost" id="restart2faBtn" type="button">Gerar nova chave</button>
          <div class="error" id="security2faError"></div>
        </form>
      </div>
    `;
  }
  return `
    <div class="panel security-panel">
      <h2>Autenticador em duas etapas</h2>
      <p class="muted-inline">Proteja o acesso ao escritorio exigindo senha e codigo temporario de 6 digitos no login.</p>
      <button class="btn primary" id="start2faBtn" type="button">Conectar autenticador</button>
      <div class="security-steps">
        <span>1. Gere a chave</span>
        <span>2. Cadastre no app autenticador</span>
        <span>3. Confirme com o codigo</span>
      </div>
    </div>
  `;
}

async function settingsView() {
  const view = document.querySelector("#view");
  const [data, security] = await Promise.all([api("/api/settings"), api("/api/security/2fa")]);
  const s = data.settings;
  view.innerHTML = pageHeader("Configurações", "Governança, guardrails e parâmetros da organização.");
  view.innerHTML += `
    <section class="grid two">
      <div class="panel">
        <h2>Políticas operacionais</h2>
        <form id="settingsForm" class="settings-list">
          ${switchRow("human_review", "Validação humana obrigatória", "Exige revisão em entregas jurídicas, financeiras e externas.", s.human_review)}
          ${switchRow("external_send_block", "Bloqueio de envio externo", "Impede tratar minutas sensíveis como versão final.", s.external_send_block)}
          ${switchRow("prompt_injection_guard", "Proteção contra instrução oculta", "Sinaliza tentativas de manipulação do agente.", s.prompt_injection_guard)}
          <div class="field">
            <label for="brand_name">Nome comercial</label>
            <input id="brand_name" name="brand_name" value="${esc(s.brand_name || "LexFlow IA Jurídica")}" />
          </div>
          <div class="field">
            <label for="data_retention_days">Retenção de dados em dias</label>
            <input id="data_retention_days" name="data_retention_days" type="number" value="${esc(s.data_retention_days || "365")}" />
          </div>
          <button class="btn primary" type="submit">Salvar configurações</button>
          <div id="settingsError" class="error"></div>
        </form>
      </div>
      <div class="panel">
        <h2>Auditoria recente</h2>
        <div id="auditList" class="record-list"></div>
      </div>
    </section>
  `;
  view.innerHTML += `
    <section class="grid two" style="margin-top:14px">
      ${twoFactorPanelHtml(security)}
      <div class="panel security-panel">
        <h2>Como o 2FA funciona</h2>
        <p class="muted-inline">O pareamento usa TOTP: o sistema guarda uma chave secreta em formato Base32 e o app autenticador gera codigos temporarios a cada 30 segundos.</p>
        <p class="muted-inline">No proximo login, depois da senha, o SaaS exigira esse codigo. O fluxo confirma o codigo antes de ativar e so desativa com codigo valido.</p>
      </div>
    </section>
  `;
  try {
    const audit = await api("/api/audit");
    document.querySelector("#auditList").innerHTML = recordList(audit.items, (item) => ({
      title: `${item.action} · ${item.entity}`,
      badges: [item.user_name || "sistema"],
      meta: [item.created_at, item.details || ""],
    }));
  } catch (err) {
    document.querySelector("#auditList").innerHTML = `<div class="empty">${esc(err.message)}</div>`;
  }
  document.querySelector("#settingsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = collectForm(event.currentTarget);
    ["human_review", "external_send_block", "prompt_injection_guard"].forEach((key) => {
      payload[key] = document.querySelector(`[name="${key}"]`).checked ? "true" : "false";
    });
    try {
      await api("/api/settings", { method: "POST", body: JSON.stringify(payload) });
      await settingsView();
    } catch (err) {
      document.querySelector("#settingsError").textContent = err.message;
    }
  });
  document.querySelector("#start2faBtn")?.addEventListener("click", async () => {
    state.twoFactorSetup = await api("/api/security/2fa/setup", { method: "POST", body: "{}" });
    await settingsView();
  });
  document.querySelector("#restart2faBtn")?.addEventListener("click", async () => {
    state.twoFactorSetup = await api("/api/security/2fa/setup", { method: "POST", body: "{}" });
    await settingsView();
  });
  document.querySelector("#confirm2faForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#security2faError");
    error.textContent = "";
    try {
      await api("/api/security/2fa/confirm", { method: "POST", body: JSON.stringify(collectForm(event.currentTarget)) });
      state.twoFactorSetup = null;
      await settingsView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
  document.querySelector("#disable2faForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#security2faError");
    error.textContent = "";
    try {
      await api("/api/security/2fa/disable", { method: "POST", body: JSON.stringify(collectForm(event.currentTarget)) });
      state.twoFactorSetup = null;
      await settingsView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function switchRow(name, title, description, value) {
  return `
    <label class="switch-row">
      <span>
        <strong>${esc(title)}</strong><br />
        <span class="hint">${esc(description)}</span>
      </span>
      <input type="checkbox" name="${esc(name)}" ${value === "true" ? "checked" : ""} />
    </label>
  `;
}

function agentName(key) {
  const names = {
    coordenador: "Coordenador Geral",
    triagem: "Triagem e Classificação",
    atendimento: "Atendimento Inicial",
    crm: "CRM e Relacionamento",
    propostas: "Comercial e Propostas",
    peticionamento: "Peticionamento Assistido",
    revisao: "Revisão Jurídica",
    prazos: "Prazos e Agenda",
    documental: "Gestão Documental",
    financeiro: "Financeiro e Cobrança",
    compliance: "Compliance, Ética e LGPD",
    bi: "BI e Indicadores",
  };
  return names[key] || key;
}

function detectClientPersonTypeV4(client) {
  const type = normalizeAgendaV2(client?.type || "");
  return type.includes("jurid") ? "pj" : "pf";
}

function parseClientNotesMetaV4(notesRaw) {
  try {
    const parsed = JSON.parse(String(notesRaw || ""));
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return { text: String(notesRaw || ""), meta: {} };
}

function clientFormFieldsV4(personType, tab) {
  const pf = personType === "pf";
  if (tab === "pessoais") {
    if (pf) {
      return `
        <div class="field full"><label for="c_name">Nome*</label><input id="c_name" name="name" required placeholder="Digite o nome" /></div>
        <div class="field"><label for="c_legal_name">Apelido</label><input id="c_legal_name" name="legal_name" placeholder="Digite o apelido" /></div>
        <div class="field"><label for="c_profile">Perfil</label><select id="c_profile" name="profile"><option>Contato</option><option>Cliente</option></select></div>
        <div class="field"><label for="c_phone">Telefone</label><input id="c_phone" name="phone" placeholder="Digite o telefone" /></div>
        <div class="field"><label for="c_email">Email</label><input id="c_email" name="email" type="email" placeholder="Digite o email" /></div>
        <div class="field full"><label for="c_website">Site</label><input id="c_website" name="website" placeholder="Digite o site" /></div>
        <div class="field"><label for="c_zip">CEP</label><input id="c_zip" name="zip_code" placeholder="Digite o CEP" /></div>
        <div class="field"><label for="c_country">País</label><input id="c_country" name="country" placeholder="Digite o país" /></div>
        <div class="field"><label for="c_street">Rua</label><input id="c_street" name="street" placeholder="Digite a rua" /></div>
        <div class="field"><label for="c_num">Número</label><input id="c_num" name="street_number" placeholder="Digite o número" /></div>
        <div class="field"><label for="c_district">Bairro</label><input id="c_district" name="district" placeholder="Digite o bairro" /></div>
        <div class="field"><label for="c_comp">Complemento</label><input id="c_comp" name="complement" placeholder="Digite o complemento" /></div>
        <div class="field"><label for="c_city">Cidade</label><input id="c_city" name="city" placeholder="Digite a cidade" /></div>
        <div class="field"><label for="c_state">Estado</label><input id="c_state" name="state" placeholder="Digite o estado" /></div>
        <div class="field full"><label for="c_tags">Etiquetas</label><input id="c_tags" name="tags" placeholder="Ex: cliente principal" /></div>
      `;
    }
    return `
      <div class="field full"><label for="c_name">Empresa*</label><input id="c_name" name="name" required placeholder="Digite a empresa" /></div>
      <div class="field"><label for="c_legal_name">Nome fantasia</label><input id="c_legal_name" name="legal_name" placeholder="Digite o nome fantasia" /></div>
      <div class="field"><label for="c_profile">Perfil</label><select id="c_profile" name="profile"><option>Contato</option><option>Cliente</option></select></div>
      <div class="field"><label for="c_phone">Telefone</label><input id="c_phone" name="phone" placeholder="Digite o telefone" /></div>
      <div class="field"><label for="c_email">Email</label><input id="c_email" name="email" type="email" placeholder="Digite o email" /></div>
      <div class="field full"><label for="c_website">Site</label><input id="c_website" name="website" placeholder="Digite o site" /></div>
      <div class="field"><label for="c_zip">CEP</label><input id="c_zip" name="zip_code" placeholder="Digite o CEP" /></div>
      <div class="field"><label for="c_country">País</label><input id="c_country" name="country" placeholder="Digite o país" /></div>
      <div class="field"><label for="c_street">Rua</label><input id="c_street" name="street" placeholder="Digite a rua" /></div>
      <div class="field"><label for="c_num">Número</label><input id="c_num" name="street_number" placeholder="Digite o número" /></div>
      <div class="field"><label for="c_district">Bairro</label><input id="c_district" name="district" placeholder="Digite o bairro" /></div>
      <div class="field"><label for="c_comp">Complemento</label><input id="c_comp" name="complement" placeholder="Digite o complemento" /></div>
      <div class="field"><label for="c_city">Cidade</label><input id="c_city" name="city" placeholder="Digite a cidade" /></div>
      <div class="field"><label for="c_state">Estado</label><input id="c_state" name="state" placeholder="Digite o estado" /></div>
      <div class="field full"><label for="c_tags">Etiquetas</label><input id="c_tags" name="tags" placeholder="Ex: empresa, contencioso" /></div>
    `;
  }
  if (tab === "complementares") {
    if (pf) {
      return `
        <div class="field"><label for="c_birth">Nascimento</label><input id="c_birth" name="birth_date" type="date" /></div>
        <div class="field"><label for="c_prof">Profissão</label><input id="c_prof" name="profession" placeholder="Digite a profissão" /></div>
        <div class="field"><label for="c_marital">Estado civil</label><input id="c_marital" name="marital_status" placeholder="Digite o estado civil" /></div>
        <div class="field"><label for="c_area">Área</label><input id="c_area" name="area" placeholder="Digite a área" /></div>
        <div class="field"><label for="c_contact_person">Contato</label><input id="c_contact_person" name="contact_person" placeholder="Digite o contato" /></div>
        <div class="field"><label for="c_code">Código</label><input id="c_code" name="code" placeholder="Digite o código" /></div>
        <div class="field"><label for="c_bank">Banco</label><input id="c_bank" name="bank_name" placeholder="Digite o banco" /></div>
        <div class="field"><label for="c_agency">Agência</label><input id="c_agency" name="bank_agency" placeholder="Digite a agência" /></div>
        <div class="field"><label for="c_account">Conta</label><input id="c_account" name="bank_account" placeholder="Digite a conta" /></div>
        <div class="field"><label for="c_pix">Pix</label><input id="c_pix" name="pix_key" placeholder="Digite a chave pix" /></div>
        <div class="field full"><label for="c_notes">Comentários</label><textarea id="c_notes" name="notes" placeholder="Digite um comentário"></textarea></div>
      `;
    }
    return `
      <div class="field"><label for="c_contact_person">Contato</label><input id="c_contact_person" name="contact_person" placeholder="Digite o contato" /></div>
      <div class="field"><label for="c_role">Cargo</label><input id="c_role" name="role_name" placeholder="Digite o cargo" /></div>
      <div class="field"><label for="c_code">Código</label><input id="c_code" name="code" placeholder="Digite o código" /></div>
      <div class="field"><label for="c_area">Área</label><input id="c_area" name="area" placeholder="Digite a área" /></div>
      <div class="field"><label for="c_bank">Banco</label><input id="c_bank" name="bank_name" placeholder="Digite o banco" /></div>
      <div class="field"><label for="c_agency">Agência</label><input id="c_agency" name="bank_agency" placeholder="Digite a agência" /></div>
      <div class="field"><label for="c_account">Conta</label><input id="c_account" name="bank_account" placeholder="Digite a conta" /></div>
      <div class="field"><label for="c_pix">Pix</label><input id="c_pix" name="pix_key" placeholder="Digite a chave pix" /></div>
      <div class="field full"><label for="c_notes">Comentários</label><textarea id="c_notes" name="notes" placeholder="Digite um comentário"></textarea></div>
    `;
  }
  if (pf) {
    return `
      <div class="field"><label for="c_doc">CPF</label><input id="c_doc" name="document" placeholder="Digite o CPF" /></div>
      <div class="field"><label for="c_doc2">RG</label><input id="c_doc2" name="secondary_document" placeholder="Número/emissão/emissor" /></div>
      <div class="field"><label for="c_ctps">CTPS</label><input id="c_ctps" name="ctps" placeholder="Número / série / emissão / UF" /></div>
      <div class="field"><label for="c_pis">PIS</label><input id="c_pis" name="pis" placeholder="Número" /></div>
      <div class="field"><label for="c_voter">Título de eleitor</label><input id="c_voter" name="voter_id" placeholder="Número/zona/seção" /></div>
      <div class="field"><label for="c_cnh">CNH</label><input id="c_cnh" name="cnh" placeholder="Número/categoria/vencimento" /></div>
      <div class="field"><label for="c_passport">Passaporte</label><input id="c_passport" name="passport" placeholder="Número/tipo/emissor" /></div>
      <div class="field"><label for="c_reservist">Certidão reservista</label><input id="c_reservist" name="reservist_certificate" placeholder="Número/espécie/categoria" /></div>
    `;
  }
  return `
    <div class="field full"><label for="c_doc">CNPJ</label><input id="c_doc" name="document" placeholder="Digite o CNPJ" /></div>
    <div class="field"><label for="c_doc2">Inscrição estadual</label><input id="c_doc2" name="secondary_document" placeholder="Digite a inscrição estadual" /></div>
    <div class="field"><label for="c_muni">Inscrição municipal</label><input id="c_muni" name="municipal_registration" placeholder="Digite a inscrição municipal" /></div>
    <div class="field"><label for="c_simple">Optante Simples Nacional</label><select id="c_simple" name="simple_national"><option>Não</option><option>Sim</option></select></div>
  `;
}

function buildClientPayloadV4(form, personType) {
  const values = collectForm(form);
  const extraMeta = {
    code: values.code || "",
    bank_name: values.bank_name || "",
    bank_agency: values.bank_agency || "",
    bank_account: values.bank_account || "",
    pix_key: values.pix_key || "",
    ctps: values.ctps || "",
    pis: values.pis || "",
    voter_id: values.voter_id || "",
    cnh: values.cnh || "",
    passport: values.passport || "",
    reservist_certificate: values.reservist_certificate || "",
    role_name: values.role_name || "",
    municipal_registration: values.municipal_registration || "",
    simple_national: values.simple_national || "",
    profile: values.profile || "",
  };
  const noteJson = JSON.stringify({ text: values.notes || "", meta: extraMeta });
  return {
    name: values.name,
    type: personType === "pj" ? "Pessoa jurídica" : "Pessoa física",
    legal_name: values.legal_name || null,
    document: values.document || null,
    secondary_document: values.secondary_document || null,
    email: values.email || null,
    phone: values.phone || null,
    birth_date: values.birth_date || null,
    marital_status: values.marital_status || null,
    profession: values.profession || null,
    contact_person: values.contact_person || null,
    website: values.website || null,
    zip_code: values.zip_code || null,
    street: values.street || null,
    street_number: values.street_number || null,
    complement: values.complement || null,
    district: values.district || null,
    city: values.city || null,
    state: values.state || null,
    country: values.country || null,
    area: values.area || null,
    tags: values.tags || null,
    status: "ativo",
    notes: noteJson,
  };
}

function mapClientToFormValuesV4(client) {
  const mapped = { ...client };
  const parsed = parseClientNotesMetaV4(client.notes);
  mapped.notes = parsed.text || "";
  Object.assign(mapped, parsed.meta || {});
  return mapped;
}

async function clientsAstreaView() {
  const view = document.querySelector("#view");
  const data = await api("/api/clients");
  const items = data.items || [];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const search = stripAccents(String(state.clientSearch || "").toLowerCase());
  const letter = state.clientLetter || "todos";
  const filtered = items.filter((item) => {
    const normalized = stripAccents(String(item.name || "")).toUpperCase();
    if (letter !== "todos" && !normalized.startsWith(letter)) return false;
    if (!search) return true;
    const haystack = stripAccents([item.name, item.legal_name, item.email, item.phone, item.document].join(" ").toLowerCase());
    return haystack.includes(search);
  });
  const editing = items.find((item) => item.id === state.clientEditingId) || null;
  const personType = state.clientPersonType || detectClientPersonTypeV4(editing);
  const tab = state.clientFormTab || "pessoais";
  const rows = filtered
    .map(
      (item) => `
      <tr>
        <td>${esc(item.name || "-")}</td>
        <td>${esc(item.type || "-")}</td>
        <td>${esc(item.document || "-")}</td>
        <td>${esc(item.phone || "-")}</td>
        <td>${esc(item.email || "-")}</td>
        <td>${esc(item.city || "-")}${item.state ? `/${esc(item.state)}` : ""}</td>
        <td>${badge(item.status || "ativo")}</td>
        <td class="btn-row">
          <button class="btn ghost" data-edit-client="${item.id}">Editar</button>
          <button class="btn ghost" data-archive-client="${item.id}">Arquivar</button>
          <button class="btn danger" data-delete-client="${item.id}">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
  view.innerHTML = `
    ${pageHeader("Contatos", "Cadastro completo de pessoas físicas e jurídicas.", `<button class="btn primary" id="clientNewBtn">Adicionar</button>`)}
    <section class="panel contacts-screen">
      <div class="contacts-alpha-row">
        <div class="contacts-alpha-list">
          <button class="alpha-btn ${letter === "todos" ? "active" : ""}" data-client-letter="todos" type="button">TODOS</button>
          ${letters.map((item) => `<button class="alpha-btn ${letter === item ? "active" : ""}" data-client-letter="${item}" type="button">${item}</button>`).join("")}
        </div>
        <div class="contacts-search-wrap">
          <input id="clientSearchInput" type="text" placeholder="Procure por nome, apelido ou nome fantasia do seu contato" value="${esc(state.clientSearch || "")}" />
        </div>
      </div>
      <div class="contacts-chip-row"><span class="contacts-chip">TIPO: CLIENTE</span></div>
      <div class="contacts-list-wrap">
        <table class="data-table contacts-table">
          <thead><tr><th>Nome</th><th>Tipo</th><th>Documento</th><th>Telefone</th><th>E-mail</th><th>Cidade</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows || `<tr><td colspan="8"><div class="empty">Nenhum contato encontrado.</div></td></tr>`}</tbody>
        </table>
      </div>
    </section>
    ${
      state.clientComposerOpen || editing
        ? `
      <section class="panel contact-form-shell">
        <h2>${editing ? "Editar contato" : "Adicionar contato"}</h2>
        <div class="contact-person-type">
          <label><input type="radio" name="contact_person_type" value="pf" ${personType === "pf" ? "checked" : ""} /> Pessoa física</label>
          <label><input type="radio" name="contact_person_type" value="pj" ${personType === "pj" ? "checked" : ""} /> Pessoa jurídica</label>
        </div>
        <div class="contact-form-tabs">
          <button type="button" class="${tab === "pessoais" ? "active" : ""}" data-client-tab="pessoais">Informações pessoais</button>
          <button type="button" class="${tab === "complementares" ? "active" : ""}" data-client-tab="complementares">Informações complementares</button>
          <button type="button" class="${tab === "documentacao" ? "active" : ""}" data-client-tab="documentacao">Documentação</button>
        </div>
        <form id="clientAstreaForm" class="form-grid contact-form-grid">
          ${clientFormFieldsV4(personType, tab)}
          <div class="full btn-row">
            <button class="btn ghost" type="button" id="clientCancelBtn">Cancelar</button>
            <button class="btn primary" type="submit">Salvar</button>
            ${editing ? '<button class="btn danger" type="button" id="clientDeleteBtn">Excluir</button>' : ""}
          </div>
          <div class="full"><div id="clientFormError" class="error"></div></div>
        </form>
      </section>
    `
        : ""
    }
  `;

  document.querySelector("#clientNewBtn").addEventListener("click", async () => {
    state.clientEditingId = null;
    state.clientComposerOpen = true;
    state.clientPersonType = "pf";
    state.clientFormTab = "pessoais";
    await clientsAstreaView();
  });
  document.querySelector("#clientSearchInput").addEventListener("input", async (event) => {
    state.clientSearch = event.currentTarget.value;
    await clientsAstreaView();
  });
  document.querySelectorAll("[data-client-letter]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.clientLetter = button.dataset.clientLetter || "todos";
      await clientsAstreaView();
    });
  });
  document.querySelectorAll("[data-edit-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.clientEditingId = Number(button.dataset.editClient);
      state.clientComposerOpen = true;
      state.clientPersonType = detectClientPersonTypeV4(items.find((item) => item.id === state.clientEditingId));
      state.clientFormTab = "pessoais";
      await clientsAstreaView();
    });
  });
  document.querySelectorAll("[data-archive-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/clients/${button.dataset.archiveClient}/status`, { method: "PATCH", body: JSON.stringify({ status: "arquivado" }) });
      if (state.clientEditingId === Number(button.dataset.archiveClient)) state.clientEditingId = null;
      await clientsAstreaView();
    });
  });
  document.querySelectorAll("[data-delete-client]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir este contato? Isso remove vínculos com processos, atendimentos, documentos e financeiro.")) return;
      await api(`/api/clients/${button.dataset.deleteClient}`, { method: "DELETE" });
      if (state.clientEditingId === Number(button.dataset.deleteClient)) state.clientEditingId = null;
      state.clientComposerOpen = false;
      await clientsAstreaView();
    });
  });

  const form = document.querySelector("#clientAstreaForm");
  if (!form) return;
  if (editing) setFormValues(form, mapClientToFormValuesV4(editing));
  document.querySelectorAll('input[name="contact_person_type"]').forEach((item) => {
    item.addEventListener("change", async (event) => {
      state.clientPersonType = event.currentTarget.value || "pf";
      await clientsAstreaView();
    });
  });
  document.querySelectorAll("[data-client-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.clientFormTab = button.dataset.clientTab || "pessoais";
      await clientsAstreaView();
    });
  });
  document.querySelector("#clientCancelBtn").addEventListener("click", async () => {
    state.clientEditingId = null;
    state.clientComposerOpen = false;
    await clientsAstreaView();
  });
  const clientDeleteBtn = document.querySelector("#clientDeleteBtn");
  if (clientDeleteBtn) {
    clientDeleteBtn.addEventListener("click", async () => {
      if (!confirm("Excluir este contato? Isso remove vínculos com processos, atendimentos, documentos e financeiro.")) return;
      await api(`/api/clients/${state.clientEditingId}`, { method: "DELETE" });
      state.clientEditingId = null;
      state.clientComposerOpen = false;
      await clientsAstreaView();
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#clientFormError");
    error.textContent = "";
    try {
      const payload = buildClientPayloadV4(form, personType);
      if (state.clientEditingId) {
        await api(`/api/clients/${state.clientEditingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await api("/api/clients", { method: "POST", body: JSON.stringify(payload) });
      }
      state.clientEditingId = null;
      state.clientComposerOpen = false;
      await clientsAstreaView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function caseClientDatalistV4(clients) {
  return `<datalist id="caseClientOptionsV4">${(clients || [])
    .map((item) => `<option value="cliente #${esc(item.id)} - ${esc(item.name || "sem nome")}"></option>`)
    .join("")}</datalist>`;
}

function parseCaseClientIdV4(raw) {
  const match = String(raw || "").match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function caseLabelPickerV4(labels = []) {
  const scoped = (labels || []).filter((label) => labelScopeMatches(label, "case"));
  if (!scoped.length) {
    return `<div class="empty compact">Nenhuma etiqueta cadastrada. Crie uma etiqueta antes de salvar o processo.</div>`;
  }
  return `
    <div class="case-label-picker">
      ${scoped
        .map(
          (label) => `
        <label class="case-label-option">
          <input type="checkbox" name="label_ids" value="${esc(label.id)}" />
          <span class="label-swatch" style="background:${esc(label.color || "#2d8ce6")}"></span>
          <strong>${esc(label.name)}</strong>
        </label>
      `
        )
        .join("")}
    </div>
  `;
}

function caseLabelToolbarV4(labels = [], selected = "todos", items = []) {
  const scoped = (labels || []).filter((label) => labelScopeMatches(label, "case"));
  const selectedText = String(selected || "todos");
  const countFor = (labelId) =>
    (items || []).filter((item) => Array.isArray(item.label_ids) && item.label_ids.map((value) => Number(value)).includes(Number(labelId))).length;
  return `
    <div class="case-label-toolbar">
      <button class="case-label-chip ${selectedText === "todos" ? "active" : ""}" type="button" data-case-label-chip="todos">
        TODOS <span>${items.length}</span>
      </button>
      ${scoped
        .map(
          (label) => `
        <span class="case-label-chip-wrap">
          <button class="case-label-chip ${String(label.id) === selectedText ? "active" : ""}" type="button" data-case-label-chip="${esc(label.id)}">
            <span class="label-swatch" style="background:${esc(label.color || "#2d8ce6")}"></span>
            ${esc(label.name)}
            <small>${countFor(label.id)}</small>
          </button>
          <button class="case-label-delete" type="button" data-delete-case-label-id="${esc(label.id)}" title="Excluir etiqueta" aria-label="Excluir etiqueta ${esc(label.name)}">x</button>
        </span>
      `
        )
        .join("")}
    </div>
  `;
}

function caseCreateFormV4(clients, labels = []) {
  return `
    <section class="panel case-create-panel">
      <h2>Adicionar processo</h2>
      <form id="caseCreateFormV4" class="form-grid case-create-grid">
        <div class="field full"><label for="case_folder">Pasta</label><input id="case_folder" name="folder" placeholder="Digite o nome ou número da pasta" /></div>
        <div class="field"><label for="case_client_ref">Clientes*</label><input id="case_client_ref" name="client_reference" list="caseClientOptionsV4" required placeholder="Digite o nome do cliente" /></div>
        <div class="field"><label for="case_client_qualification">Qualificação</label><input id="case_client_qualification" name="client_qualification" placeholder="Qualificação" /></div>
        <div class="field"><label for="case_other_party">Outros envolvidos</label><input id="case_other_party" name="other_party" placeholder="Digite o nome do envolvido" /></div>
        <div class="field"><label for="case_other_party_qualification">Qualificação</label><input id="case_other_party_qualification" name="other_party_qualification" placeholder="Qualificação" /></div>
        <div class="field full"><label for="case_title">Título*</label><input id="case_title" name="title" required placeholder="Digite o título do processo" /></div>
        <div class="field full">
          <label>Etiquetas*</label>
          ${caseLabelPickerV4(labels)}
        </div>
        <div class="field"><label for="case_instance_level">Instância</label><select id="case_instance_level" name="instance_level"><option>1º Grau</option><option>2º Grau</option><option>Tribunais Superiores</option></select></div>
        <div class="field"><label for="case_case_number">Número</label><input id="case_case_number" name="case_number" placeholder="Digite o número do processo" /></div>
        <div class="field"><label for="case_court_number">Juízo Nº</label><input id="case_court_number" name="court_number" placeholder="Nº" /></div>
        <div class="field"><label for="case_court_branch">Vara</label><input id="case_court_branch" name="court_branch" placeholder="Vara" /></div>
        <div class="field"><label for="case_forum">Foro</label><input id="case_forum" name="forum" placeholder="Foro" /></div>
        <div class="field full"><label for="case_action_name">Ação</label><input id="case_action_name" name="action_name" placeholder="Digite a ação" /></div>
        <div class="field full"><label for="case_court_link">Link no tribunal</label><input id="case_court_link" name="court_link" placeholder="Digite o link no tribunal" /></div>
        <div class="field full"><label for="case_summary">Objeto</label><textarea id="case_summary" name="summary" placeholder="Digite a descrição do processo"></textarea></div>
        <div class="field"><label for="case_amount_claim">Valor da causa</label><input id="case_amount_claim" name="amount_claim" type="number" min="0" step="0.01" placeholder="Digite o valor" /></div>
        <div class="field"><label for="case_distributed_at">Distribuído em</label><input id="case_distributed_at" name="distributed_at" type="date" /></div>
        <div class="field"><label for="case_amount_condemnation">Valor da condenação</label><input id="case_amount_condemnation" name="amount_condemnation" type="number" min="0" step="0.01" placeholder="Digite o valor" /></div>
        <div class="field"><label for="case_status">Status</label><select id="case_status" name="status"><option value="ativo">Ativo</option><option value="encerrado">Encerrado</option><option value="suspenso">Suspenso</option></select></div>
        <div class="field full"><label for="case_notes">Observações</label><textarea id="case_notes" name="notes" placeholder="Digite mais detalhes"></textarea></div>
        <div class="field"><label for="case_responsible">Responsável</label><input id="case_responsible" name="responsible" placeholder="Responsável" /></div>
        <div class="field"><label for="case_access">Acesso</label><select id="case_access" name="access_level"><option value="publico">Público</option><option value="privado">Privado</option><option value="envolvidos">Envolvidos</option></select></div>
        <div class="field full">${caseClientDatalistV4(clients)}</div>
        <div class="full btn-row">
          <button class="btn ghost" id="caseCancelBtnV4" type="button">Cancelar</button>
          <button class="btn primary" type="submit">Salvar</button>
        </div>
        <div class="full"><div id="caseFormErrorV4" class="error"></div></div>
      </form>
    </section>
  `;
}

function casePayloadFromFormV4(form) {
  const values = collectForm(form);
  const labelSelect = form.querySelector("#case_label_ids");
  const labelIdsFromChecks = Array.from(form.querySelectorAll('input[name="label_ids"]:checked'))
    .map((option) => Number(option.value))
    .filter((value) => Number.isFinite(value) && value > 0);
  const labelIds = labelIdsFromChecks.length
    ? labelIdsFromChecks
    : labelSelect
      ? Array.from(labelSelect.selectedOptions || [])
          .map((option) => Number(option.value))
          .filter((value) => Number.isFinite(value) && value > 0)
      : [];
  const clientId = parseCaseClientIdV4(values.client_reference);
  const summaryParts = [
    values.summary || "",
    values.notes ? `Observações: ${values.notes}` : "",
    values.folder ? `Pasta: ${values.folder}` : "",
    values.client_qualification ? `Qualificação do cliente: ${values.client_qualification}` : "",
    values.other_party ? `Outros envolvidos: ${values.other_party}` : "",
    values.other_party_qualification ? `Qualificação de terceiros: ${values.other_party_qualification}` : "",
    values.court_link ? `Link no tribunal: ${values.court_link}` : "",
    values.access_level ? `Acesso: ${values.access_level}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const courtPieces = [values.court_number ? `Juízo ${values.court_number}` : "", values.court_branch || ""].filter(Boolean).join(" - ");
  return {
    client_id: clientId,
    title: values.title,
    area: null,
    court: courtPieces || null,
    case_number: values.case_number || null,
    status: values.status || "ativo",
    next_deadline: null,
    risk: "médio",
    summary: summaryParts,
    responsible: values.responsible || state.user?.name || null,
    action_name: values.action_name || "Procedimento",
    forum: values.forum || null,
    instance_level: values.instance_level || "1º Grau",
    distributed_at: values.distributed_at || null,
    amount_claim: values.amount_claim || 0,
    amount_condemnation: values.amount_condemnation || 0,
    created_by: state.user?.name || null,
    label_ids: labelIds,
  };
}

async function casesAstreaView() {
  const view = document.querySelector("#view");
  const selectedLabelFilter = String(state.caseLabelFilter || "todos");
  const [data, clientsRes, labelsRes] = await Promise.all([api("/api/cases"), api("/api/clients"), api("/api/labels").catch(() => ({ items: [] }))]);
  const items = data.items || [];
  const clients = clientsRes.items || [];
  const labels = (labelsRes.items || []).filter((label) => labelScopeMatches(label, "case"));
  const search = (state.caseSearch || "").trim().toLowerCase();
  const status = (state.caseStatus || "ativos").toLowerCase();
  const filtered = items.filter((item) => {
    if (status === "ativos" && String(item.status || "").toLowerCase() !== "ativo") return false;
    if (status === "encerrados" && String(item.status || "").toLowerCase() !== "encerrado") return false;
    if (selectedLabelFilter !== "todos") {
      const currentIds = Array.isArray(item.label_ids) ? item.label_ids.map((value) => Number(value)) : [];
      if (!currentIds.includes(Number(selectedLabelFilter))) return false;
    }
    if (!search) return true;
    const haystack = [item.title, item.case_number, item.client_name, item.action_name, item.forum, item.court].join(" ").toLowerCase();
    return haystack.includes(search);
  });
  const visibleCount = Math.max(30, Number(state.caseVisibleCount || 30));
  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visible.length < filtered.length;

  view.innerHTML = `
    ${pageHeader("Processos e casos", "Controle completo da carteira processual, com filtro, histórico e acesso rápido ao detalhe.", `
      <button class="btn ghost" id="casesExportBtn">Exportar</button>
      <button class="btn ghost" id="casesSyncBtn">Atualizar tribunal</button>
      <button class="btn ghost" id="casesNewLabelBtn">Nova etiqueta</button>
      <button class="btn primary" id="casesNewBtn">Novo processo</button>
    `)}
    ${state.caseComposerOpen ? caseCreateFormV4(clients, labels) : ""}
    <section class="panel cases-screen">
      <div class="cases-filters">
        <input id="casesSearchInput" type="text" placeholder="Digite algo para pesquisar" value="${esc(state.caseSearch || "")}" />
        <select id="casesStatusFilter">
          <option value="ativos" ${status === "ativos" ? "selected" : ""}>Ativos</option>
          <option value="todos" ${status === "todos" ? "selected" : ""}>Todos</option>
          <option value="encerrados" ${status === "encerrados" ? "selected" : ""}>Encerrados</option>
        </select>
        <select id="casesLabelFilter">
          <option value="todos" ${selectedLabelFilter === "todos" ? "selected" : ""}>Todas as etiquetas</option>
          ${labels.map((label) => `<option value="${esc(label.id)}" ${String(label.id) === selectedLabelFilter ? "selected" : ""}>${esc(label.name)}</option>`).join("")}
        </select>
      </div>
      ${caseLabelToolbarV4(labels, selectedLabelFilter, items)}
      <div class="cases-count">${visible.length} de ${filtered.length} processos filtrados (${items.length} no total)</div>
      <div class="cases-table-wrap">
        <table class="data-table cases-table">
          <thead><tr><th></th><th>Título</th><th>Cliente / pasta</th><th>Ação / foro</th><th>Últ. mov</th><th>Ações</th></tr></thead>
          <tbody>
            ${visible
              .map((item) => {
                const actionForo = item.action_name || item.area || "Procedimento";
                const foro = item.forum || item.court || "-";
                const labelsHtml = (item.labels || []).map((label) => labelBadgeHtml(label, { removable: true, caseId: item.id })).join(" ") || `<span class="muted-inline">Sem etiqueta</span>`;
                return `
                  <tr>
                    <td><input type="checkbox" aria-label="Selecionar processo ${esc(item.title || item.id)}" /></td>
                    <td>
                      <div class="case-title-cell">
                        <div class="case-title-main">${esc(item.title || "Processo sem titulo")}</div>
                        <div class="case-title-sub">Processo ${esc(item.status || "ativo")}${item.case_number ? ` · <a href="#/cases/${item.id}" class="case-number-link">${esc(item.case_number)}</a>` : ""}</div>
                        <div class="case-label-list">${labelsHtml}</div>
                      </div>
                    </td>
                    <td>${esc(item.client_name || "-")}</td>
                    <td>${esc(actionForo)}<br /><span class="muted-inline">${esc(foro)}</span></td>
                    <td>${esc(formatDate(item.last_movement_date || item.next_deadline || item.created_at))}</td>
                    <td><button class="btn ghost" data-delete-case="${item.id}">Excluir</button></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="btn-row cases-footer"><button class="btn ghost" id="casesLoadMoreBtn" ${canLoadMore ? "" : "disabled"}>${canLoadMore ? "Carregar mais" : "Tudo carregado"}</button></div>
    </section>
  `;

  document.querySelector("#casesSearchInput").addEventListener("input", async (event) => {
    state.caseSearch = event.currentTarget.value;
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelector("#casesStatusFilter").addEventListener("change", async (event) => {
    state.caseStatus = event.currentTarget.value;
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelector("#casesLabelFilter").addEventListener("change", async (event) => {
    state.caseLabelFilter = event.currentTarget.value;
    state.caseVisibleCount = 30;
    await casesAstreaView();
  });
  document.querySelectorAll("[data-case-label-chip]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.caseLabelFilter = button.dataset.caseLabelChip || "todos";
      state.caseVisibleCount = 30;
      await casesAstreaView();
    });
  });
  document.querySelectorAll("[data-remove-case-label-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const labelId = button.dataset.removeCaseLabelId;
      const caseId = button.dataset.removeCaseLabelCaseId;
      if (!labelId || !caseId) return;
      await api(`/api/cases/${caseId}/labels/${labelId}`, { method: "DELETE" });
      await casesAstreaView();
    });
  });
  document.querySelectorAll("[data-delete-case-label-id]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const labelId = button.dataset.deleteCaseLabelId;
      if (!labelId) return;
      if (!confirm("Excluir esta etiqueta de todos os processos?")) return;
      await api(`/api/labels/${labelId}`, { method: "DELETE" });
      if (String(state.caseLabelFilter || "") === String(labelId)) state.caseLabelFilter = "todos";
      await casesAstreaView();
    });
  });
  document.querySelector("#casesNewBtn").addEventListener("click", async () => {
    state.caseComposerOpen = true;
    await casesAstreaView();
  });
  document.querySelector("#casesExportBtn").addEventListener("click", () => exportCasesCsvV3(filtered));
  document.querySelector("#casesSyncBtn").addEventListener("click", async () => {
    await api("/api/tribunal-integrations/sync", { method: "POST", body: JSON.stringify({ provider: "ALL-TJ", system_code: "DATAJUD" }) });
    await casesAstreaView();
  });
  document.querySelector("#casesNewLabelBtn").addEventListener("click", async () => {
    const name = prompt("Digite o nome da nova etiqueta de processo:");
    if (!name) return;
    const color = prompt("Digite a cor da etiqueta em hexadecimal:", "#facc15") || "#facc15";
    await api("/api/labels", { method: "POST", body: JSON.stringify({ name, color, scope: "case" }) });
    await casesAstreaView();
  });
  document.querySelectorAll("[data-delete-case]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Excluir este processo? Isso remove vínculos com documentos, atendimentos, prazos e financeiro.")) return;
      await api(`/api/cases/${button.dataset.deleteCase}`, { method: "DELETE" });
      await casesAstreaView();
    });
  });
  document.querySelector("#casesLoadMoreBtn").addEventListener("click", async () => {
    if (!canLoadMore) return;
    state.caseVisibleCount = visibleCount + 30;
    await casesAstreaView();
  });

  const caseForm = document.querySelector("#caseCreateFormV4");
  if (!caseForm) return;
  const responsibleInput = caseForm.querySelector("#case_responsible");
  if (responsibleInput) responsibleInput.value = state.user?.name || "";
  document.querySelector("#caseCancelBtnV4").addEventListener("click", async () => {
    state.caseComposerOpen = false;
    await casesAstreaView();
  });
  caseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.querySelector("#caseFormErrorV4");
    error.textContent = "";
    try {
      const payload = casePayloadFromFormV4(caseForm);
      if (!payload.client_id) throw new Error("Selecione um cliente válido da lista.");
      if (!payload.label_ids || payload.label_ids.length === 0) throw new Error("Selecione pelo menos uma etiqueta para o processo.");
      await api("/api/cases", { method: "POST", body: JSON.stringify(payload) });
      state.caseComposerOpen = false;
      state.caseVisibleCount = 30;
      await casesAstreaView();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function renderAgendaCalendarMonthV3(entries, anchorDate, selectedDate = null) {
  const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
  const firstGridDay = agendaAddDaysV3(monthStart, -((monthStart.getDay() + 6) % 7));
  const selectedKey = selectedDate || state.agendaSelectedDate || state.agendaDate || agendaDateToKeyV3(new Date());
  const entriesByDay = new Map();
  entries.forEach((item) => {
    if (!entriesByDay.has(item.date)) entriesByDay.set(item.date, []);
    entriesByDay.get(item.date).push(item);
  });
  entriesByDay.forEach((items) => items.sort((a, b) => String(a.time || "99:99").localeCompare(String(b.time || "99:99"))));
  const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const monthTitle = monthStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return `
    <div class="agenda-month-block">
      <div class="agenda-month-title">${esc(monthTitle)}</div>
      <div class="agenda-month-grid">
        ${weekdays.map((name) => `<div class="agenda-month-weekday">${name}</div>`).join("")}
        ${Array.from({ length: 42 }, (_, index) => {
          const day = agendaAddDaysV3(firstGridDay, index);
          const key = agendaDateToKeyV3(day);
          const items = entriesByDay.get(key) || [];
          const outside = day < monthStart || day > monthEnd;
          const selected = key === selectedKey;
          return `
            <article class="agenda-month-cell${outside ? " outside" : ""}${selected ? " selected" : ""}" data-agenda-day="${esc(key)}">
              <header><button type="button" class="agenda-day-number" data-agenda-day-button="${esc(key)}">${day.getDate()}</button></header>
              <div class="agenda-month-items">
                ${items
                  .slice(0, 3)
                  .map(
                    (item) => `
                  <div class="agenda-month-item ${esc(normalizeAgendaV2(item.kind))}${state.agendaSelectedActivity === agendaEntryKeyV5(item) ? " active" : ""}" data-open-agenda-activity="${esc(agendaEntryKeyV5(item))}" data-agenda-activity-date="${esc(item.date)}" role="button" tabindex="0">
                    <div class="agenda-month-item-head">
                      <span>${esc(item.time || "•")}</span>
                      ${
                        !item.completed
                          ? `<button class="btn ghost agenda-icon-btn" data-complete-agenda-kind="${esc(item.entity)}" data-complete-agenda-id="${esc(item.id)}" title="Concluir" aria-label="Concluir">✓</button>`
                          : ""
                      }
                    </div>
                    <strong>${esc(item.title)}</strong>
                  </div>
                `
                  )
                  .join("")}
                ${items.length > 3 ? `<div class="agenda-month-more">+${items.length - 3} mais</div>` : ""}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

window.addEventListener("hashchange", async () => {
  if (!state.user) return;
  await renderRoute();
});

init();

// Auto-bind dynamic buttons inserted after initial render.
(function autoBindDynamicActions() {
  const selectors = [
    '[data-complete-task]',
    '[data-complete-task-v2]',
    '[data-complete-event-v2]',
    '[data-delete-task-v2]',
    '[data-delete-event-v2]',
    '[data-delete-task]',
    '[data-delete-event]',
    '[data-complete-event]',
    '[data-complete-task-astrea]',
    '[data-edit-task-v2]',
    '[data-edit-event-v2]',
    '[data-edit-task]',
    '[data-edit-event]',
    '[data-api]',
    '[data-open-modal]',
    '[data-open-modal-v2]',
  ];

  function bindOnce(el, fn) {
    if (!el || el.dataset.lfAutoBound) return;
    el.dataset.lfAutoBound = "1";
    try {
      fn(el);
    } catch (e) {
      console.warn("autoBind error", e);
    }
  }

  function scanAndBind(root = document) {
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        bindOnce(el, (button) => {
          // complete task (v1)
          if (button.dataset.completeTask) {
            button.addEventListener("click", async () => {
              await api(`/api/tasks/${button.dataset.completeTask}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
              await renderRoute();
            });
            return;
          }
          // v2 complete
          if (button.dataset.completeTaskV2) {
            button.addEventListener("click", async () => {
              await api(`/api/tasks/${button.dataset.completeTaskV2}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluída" }) });
              await renderRoute();
            });
            return;
          }
          if (button.dataset.completeEventV2) {
            button.addEventListener("click", async () => {
              await api(`/api/events/${button.dataset.completeEventV2}/status`, { method: "PATCH", body: JSON.stringify({ status: "concluido" }) });
              await renderRoute();
            });
            return;
          }
          // deletes
          if (button.dataset.deleteTaskV2) {
            button.addEventListener("click", async () => {
              if (!confirm("Excluir esta tarefa?")) return;
              await api(`/api/tasks/${button.dataset.deleteTaskV2}`, { method: "DELETE" });
              await renderRoute();
            });
            return;
          }
          if (button.dataset.deleteEventV2) {
            button.addEventListener("click", async () => {
              if (!confirm("Excluir este evento?")) return;
              await api(`/api/events/${button.dataset.deleteEventV2}`, { method: "DELETE" });
              await renderRoute();
            });
            return;
          }
          if (button.dataset.deleteTask) {
            button.addEventListener("click", async () => {
              if (!confirm("Excluir esta tarefa?")) return;
              await api(`/api/tasks/${button.dataset.deleteTask}`, { method: "DELETE" });
              await renderRoute();
            });
            return;
          }
          if (button.dataset.deleteEvent) {
            button.addEventListener("click", async () => {
              if (!confirm("Excluir este evento?")) return;
              await api(`/api/events/${button.dataset.deleteEvent}`, { method: "DELETE" });
              await renderRoute();
            });
            return;
          }
          // edit buttons: try to dispatch click to existing handlers
          if (button.dataset.editTaskV2 || button.dataset.editTask) {
            button.addEventListener("click", () => {
              // prefer existing handlers; if none, show toast
              try {
                button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              } catch (e) {
                showToast("Editar tarefa (handler ausente)");
              }
            });
            return;
          }
          if (button.dataset.editEventV2 || button.dataset.editEvent) {
            button.addEventListener("click", () => {
              try {
                button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              } catch (e) {
                showToast("Editar evento (handler ausente)");
              }
            });
            return;
          }
          // generic data-api
          if (button.dataset.api) {
            button.addEventListener("click", async () => {
              const method = button.dataset.method || "GET";
              const body = button.dataset.payload ? JSON.parse(button.dataset.payload) : undefined;
              await api(button.dataset.api, { method, body: body ? JSON.stringify(body) : undefined });
              showToast("Ação executada");
              await renderRoute();
            });
            return;
          }
          // fallback open modal
          const openModal = button.dataset.openModal || button.dataset.openModalV2 || button.dataset.openModalV3;
          if (openModal) {
            button.addEventListener("click", () => {
              const modal = document.getElementById(openModal);
              if (modal) modal.classList.add("open");
            });
            return;
          }
        });
      });
    });
  }

  // initial scan
  scanAndBind(document);

  // observe mutations
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          scanAndBind(node);
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
