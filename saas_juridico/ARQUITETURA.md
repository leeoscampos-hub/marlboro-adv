# 🏗️ ARQUITETURA - LexFlow IA Jurídica

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Padrão Arquitetural](#padrão-arquitetural)
4. [Componentes Principais](#componentes-principais)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Estrutura de Diretórios](#estrutura-de-diretórios)
7. [Banco de Dados](#banco-de-dados)
8. [Camada de Apresentação](#camada-de-apresentação)
9. [Camada de Negócio](#camada-de-negócio)
10. [Integrações Externas](#integrações-externas)
11. [Fluxos Principais](#fluxos-principais)
12. [Padrões de Design](#padrões-de-design)
13. [Segurança](#segurança)
14. [Deployment](#deployment)

---

## 1. Visão Geral

### O que é LexFlow?

**LexFlow** é uma plataforma SaaS (Software as a Service) completa para **escritórios de advocacia** que integra:

- ✅ **CRM Jurídico** - Gestão de clientes e leads
- ✅ **Agenda Operacional** - Eventos e tarefas
- ✅ **Gestão de Processos** - Controle de casos judiciais
- ✅ **Financeiro** - Faturamento e recebimentos
- ✅ **Inteligência Artificial** - Análises e geração de documentos (OpenAI)
- ✅ **Integração com Tribunais** - Acesso a publicações judiciais (DataJud, DJEN, PJE)
- ✅ **Dashboard Executivo** - Indicadores e alertas

### Filosofia de Design

- **Monolith Modular**: Um único arquivo (`server.py`) com múltiplos módulos funcionais
- **Sem Frameworks Pesados**: Usa apenas stdlib Python (`http.server`)
- **Minimal Dependencies**: Apenas 1 dependência externa (`psycopg`)
- **Full-Stack Integrado**: Backend + Frontend no mesmo pacote

---

## 2. Stack Tecnológico

### 2.1 Visão Geral da Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                  │
│  HTML5 | CSS3 | JavaScript ES6+ (Vanilla, sem frameworks)  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                  CAMADA DE APLICAÇÃO                        │
│     Python 3.14.5 | http.server.ThreadingHTTPServer       │
│     Monolith (5600+ linhas, thread-safe)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  SQLite3     │  │ OpenAI API   │  │ Tribunal     │
│  ou          │  │              │  │ APIs         │
│  PostgreSQL  │  │ (gpt-5.4-mini)  │ (DataJud,   │
│              │  │              │  │  DJEN, PJE) │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Componentes do Stack

| Camada | Componente | Versão | Propósito |
|--------|-----------|--------|----------|
| **Runtime** | Python | 3.14.5 | Interpretador |
| **Servidor HTTP** | http.server | stdlib | ThreadingHTTPServer |
| **BD Local (Dev)** | SQLite3 | 3 | Armazenamento local |
| **BD Produção** | PostgreSQL | 16 | Banco escalável |
| **Driver PostgreSQL** | psycopg | 3.3.4 | Conexão PostgreSQL |
| **Timezone** | tzdata | 2026.2 | Dados de fuso horário |
| **Frontend** | HTML5+CSS3+JS | ES6+ | Interface responsiva |
| **Containerização** | Docker | Latest | Empacotamento |
| **Orquestração** | Docker Compose | Latest | Multi-container |
| **API IA** | OpenAI | gpt-5.4-mini | Large Language Model |
| **APIs Tribunal** | REST | - | DataJud/DJEN/PJE |

### 2.3 Dependências Python (requirements.txt)

```
psycopg[binary]>=3.2,<4
```

**Apenas 1 dependência externa!** O backend utiliza da stdlib:

```python
import http.server              # Servidor HTTP
import sqlite3                  # Banco SQLite
import json                     # Serialização JSON
import hashlib, hmac           # Segurança/criptografia
import datetime                 # Manipulação de datas
import urllib.request          # Requisições HTTP
import zipfile                 # Compressão
import pathlib                 # File system
import threading               # Concorrência
import base64                  # Encoding
import secrets                 # Geração de tokens
import re                      # Expressões regulares
```

---

## 3. Padrão Arquitetural

### 3.1 Tipo de Arquitetura

**Monolith Modular com SPA Frontend**

```
Tradicional
┌─────────────────────┐
│   Monolith único    │
│   (um binário)      │
└─────────────────────┘
        ↓
   Difícil escalar

LexFlow (Atual)
┌─────────────────────┐
│  Monolith Modular   │
│  (múltiplos módulos │
│   no mesmo arquivo) │
└─────────────────────┘
        ↓
   Escalável até  us~100Kuários
```

### 3.2 Padrões de Design Utilizados

#### 1. **MVC (Model-View-Controller)**

```
Model:      Banco SQLite/PostgreSQL
            Classes: DbRow, PgConnection, PgCursor

View:       Frontend HTML/CSS/JS
            Renderização no cliente (SPA)

Controller: server.py
            Request handlers HTTP
            Rotas e lógica de negócio
```

#### 2. **Repository Pattern**

```python
# Abstração de banco de dados
class DbRow:
    def __init__(self, columns, values):
        self._data = dict(zip(columns, values))

class PgConnection:
    def execute(self, sql, params):
        # Executa SQL tanto em SQLite quanto PostgreSQL
```

#### 3. **Adapter Pattern**

```python
# Adaptador SQLite ↔ PostgreSQL
if DB_PROVIDER == "postgres":
    conn = PgConnection(DATABASE_URL)
else:
    conn = sqlite3.connect(DB_PATH)
```

#### 4. **Template Pattern**

```python
# Para requisições a APIs
def template_fill(template: str, values: dict) -> str:
    for key, value in values.items():
        template = template.replace(f"{{{key}}}", str(value))
    return template
```

#### 5. **Strategy Pattern**

```python
# Diferentes parsers para resposta de APIs
parsers = {
    "datajud": parse_datajud_response,
    "djen": parse_djen_response,
    "pje": parse_pje_response,
}
```

---

## 4. Componentes Principais

### 4.1 Backend (server.py - 5606 linhas)

```
server.py (260 KB)
│
├── 🔐 Autenticação
│   ├── login()                  - Valida credenciais
│   ├── verify_session()         - Verifica token HMAC
│   ├── logout()                 - Encerra sessão
│   └── setup_2fa()              - Autenticação 2 fatores
│
├── 📊 CRM Jurídico
│   ├── get_clients()            - Lista clientes
│   ├── create_client()          - Novo cliente
│   ├── update_client()          - Edita cliente
│   ├── get_leads()              - Lista leads
│   └── create_lead()            - Novo lead
│
├── 📅 Agenda
│   ├── get_events()             - Lista eventos
│   ├── create_event()           - Novo evento
│   ├── get_tasks()              - Lista tarefas
│   └── create_task()            - Nova tarefa
│
├── ⚖️ Processos Judiciais
│   ├── get_cases()              - Lista casos
│   ├── create_case()            - Novo caso
│   ├── update_case()            - Edita caso
│   ├── get_case_movements()     - Movimentação processual
│   └── sync_tribunal()          - Sincroniza com tribunal
│
├── 💰 Financeiro
│   ├── get_invoices()           - Lista faturas
│   ├── create_invoice()         - Nova fatura
│   ├── get_payments()           - Pagamentos
│   ├── create_payment()         - Novo pagamento
│   └── get_financial_report()   - Relatórios
│
├── 📰 Publicações (Tribunais)
│   ├── get_publications()       - Lista publicações
│   ├── search_publications()    - Busca por número CNJ
│   ├── sync_tribunal_api()      - Sincroniza DataJud/DJEN/PJE
│   └── parse_tribunal_response()- Processa resposta API
│
├── 🤖 Inteligência Artificial
│   ├── generate_document()      - Gera peças jurídicas
│   ├── analyze_case()           - Analisa caso
│   ├── call_openai()            - Requisição OpenAI
│   └── fallback_local_ai()      - IA local (fallback)
│
├── 📁 Documentos
│   ├── get_documents()          - Lista documentos
│   ├── store_document()         - Armazena documento
│   ├── download_document()      - Download de arquivo
│   └── process_zip_upload()     - Processa ZIP de documentos
│
├── 🔔 Alertas & Indicadores
│   ├── get_alerts()             - Lista alertas
│   ├── create_alert()           - Novo alerta
│   ├── get_dashboard_metrics()  - Métricas dashboard
│   └── calculate_kpis()         - KPIs do sistema
│
├── ⚙️ Configurações
│   ├── get_settings()           - Lê configurações
│   ├── update_settings()        - Atualiza configurações
│   └── get_tribunal_config()    - Config tribunais
│
├── 🏥 Health & Monitoring
│   ├── health_check()           - Status geral
│   ├── db_health()              - Status BD
│   └── api_health()             - Status APIs externas
│
└── 🛠️ Utilidades
    ├── load_env_file()          - Carrega .env
    ├── connect()                - Conecta BD
    ├── parse_date_only()        - Parser de datas
    ├── normalize_case_number()  - Normaliza número CNJ
    ├── template_fill()          - Preenche templates
    └── split_sql_script()       - Processa SQL multi-statement
```

### 4.2 Frontend (app.js + index.html + styles.css)

#### Estado Global (app.js)

```javascript
state = {
  // Autenticação
  token: localStorage.lexflow_token,
  user: null,
  loginEmail: "admin@lexflow.local",
  loginPassword: "admin123",
  loginRequires2fa: false,
  
  // Tema
  theme: localStorage.lexflow_theme || "light",
  
  // Roteamento
  route: "dashboard",
  
  // CRM
  clientEditingId: null,
  clientSearch: "",
  clientPersonType: "pf",
  clientFormTab: "pessoais",
  
  // Agenda
  agendaView: "mes",
  agendaDate: null,
  agendaSelectedDate: null,
  agendaFilter: "todos",
  agendaOwnerFilter: "responsaveis",
  
  // Processos
  caseVisibleCount: 30,
  caseComposerOpen: false,
  caseLabelFilter: "todos",
  
  // Financeiro
  financeTab: "lancamentos",
  financeLaunchType: "honorario",
  financeFaturasTab: "a-faturar",
  
  // Publicações
  publicationProvider: "ALL-TJ",
  publicationSystem: "DATAJUD",
  publicationSearch: "",
  publicationUf: "",
  publicationStatus: "",
  
  // Atendimento
  attendancePanel: "atendimento",
  attendanceDetailId: null,
}
```

#### Rotas (SPA - Single Page Application)

```javascript
Routes = {
  "dashboard":     Dashboard Executivo
  "crm":           CRM Jurídico
  "clients":       Listagem Clientes
  "leads":         Gestão Leads
  "attendance":    Atendimentos
  "cases":         Processos e Casos
  "agenda":        Agenda (Eventos/Tarefas)
  "finance":       Financeiro
  "publications":  Publicações Tribunais
  "documents":     Documentos
  "alerts":        Alertas
  "indicators":    Indicadores
  "settings":      Configurações
}
```

#### Componentes UI

```
index.html
│
├── Login Screen
│   ├── Email input
│   ├── Senha input
│   ├── Botão Entrar
│   └── Credenciais demo
│
├── Main App (após login)
│   ├── Sidebar Navigation
│   │   ├── Logo
│   │   ├── Menu itens (13 rotas)
│   │   └── Perfil + Logout
│   │
│   └── Main Content Area
│       ├── Top Bar
│       │   ├── Search bar
│       │   ├── Quick actions (Criar, Publicações, Agenda)
│       │   ├── Theme toggle
│       │   └── Menu hambúrguer
│       │
│       └── Dinamic Content (por rota)
│           ├── Dashboard com cards + gráficos
│           ├── Tabelas de dados (CRM, Processos)
│           ├── Formulários (Novo cliente, evento)
│           ├── Modals e dialogs
│           └── Detalhes/edição
```

#### Estilos (styles.css)

```css
Design System:
├── Cores
│   ├── Primária: #2d8ce6 (teal)
│   ├── Primária Dark: #1570c8
│   ├── Sucesso: #15803d (green)
│   ├── Erro: #b42318 (red)
│   └── Neutros: grays
│
├── Tipografia
│   ├── Font: Nunito Sans
│   ├── Pesos: 400, 500, 600, 700, 800
│   └── Tamanhos: var(--text), --muted
│
├── Espaçamento
│   ├── Radius: 6px
│   ├── Shadow: 0 8px 26px rgba(...)
│   └── Sidebar width: 294px
│
├── Temas
│   ├── Light (default)
│   │   ├── BG: #f4f5f7
│   │   ├── Surface: #ffffff
│   │   └── Text: #1f2937
│   │
│   └── Dark [data-theme="dark"]
│       ├── BG: #111827
│       ├── Surface: #1f2937
│       └── Text: #e5e7eb
│
└── Componentes
    ├── Botões (primary, secondary, danger)
    ├── Inputs (text, email, password, select)
    ├── Cards (com hover effects)
    ├── Tabelas (responsivas, com sorting)
    ├── Modals (centered, fullscreen)
    ├── Badges (status, labels)
    └── Tooltips & Dropdowns
```

---

## 5. Fluxo de Dados

### 5.1 Fluxo Completo de uma Requisição

```
1. USER ACTION (Frontend)
   └─ Clica em "Novo Processo"
   
2. EVENT LISTENER (app.js)
   └─ Intercepta click
   └─ Atualiza state.caseComposerOpen = true
   └─ Re-renderiza UI
   
3. FORM SUBMISSION (Frontend)
   └─ User preenche formulário
   └─ Clica em "Salvar"
   └─ Coleta dados do form
   └─ Valida dados localmente
   
4. HTTP REQUEST (Frontend → Backend)
   POST /api/cases
   Headers: {
     "Authorization": "Bearer {token}",
     "Content-Type": "application/json"
   }
   Body: {
     "title": "Produto com defeito",
     "client_id": 1,
     "case_number": "0800000-22.2026.8.19.0001",
     ...
   }
   
5. REQUEST HANDLING (Backend - server.py)
   └─ ThreadingHTTPServer intercepta requisição
   └─ Valida token HMAC
   └─ Verifica permissões do usuário
   └─ Valida dados recebidos
   
6. BUSINESS LOGIC (Backend)
   └─ Cria objeto case em memória
   └─ Aplica regras de negócio
   └─ Normaliza dados (número CNJ, etc)
   
7. DATABASE OPERATION (Backend)
   └─ INSERT INTO cases (...) VALUES (...)
   └─ SQLite ou PostgreSQL
   └─ Retorna lastrowid
   
8. RESPONSE (Backend → Frontend)
   HTTP 200 OK
   Content-Type: application/json
   Body: {
     "success": true,
     "case_id": 42,
     "message": "Caso criado com sucesso"
   }
   
9. STATE UPDATE (Frontend)
   └─ Recebe resposta
   └─ Atualiza state.caseVisibleCount++
   └─ Fecha modal
   └─ Re-renderiza lista de casos
   
10. UI RENDER (Frontend)
    └─ Novo caso aparece na tabela
    └─ Toast notification "Sucesso!"
```

### 5.2 Fluxo de Autenticação

```
1. Login Page
   └─ User entra email + senha
   
2. POST /api/login
   {
     "email": "admin@lexflow.local",
     "password": "admin123"
   }
   
3. Backend Validation
   └─ SELECT user FROM users WHERE email = ?
   └─ Compara hash: HMAC-SHA256(password, secret)
   └─ Se válido → continua
   
4. Session Creation
   └─ Gera token único: secrets.token_urlsafe(32)
   └─ HMAC-SHA256(token, backend_secret) para verificação
   └─ INSERT INTO sessions (user_id, token, expires_at)
   └─ Retorna token para cliente
   
5. Token Storage (Frontend)
   └─ localStorage.lexflow_token = returned_token
   
6. Requisições Subsequentes
   └─ Todas incluem header: Authorization: Bearer {token}
   
7. Backend Verification
   └─ Para cada request:
   └─ SELECT user FROM sessions WHERE token = ?
   └─ Verifica se ainda válido (ttl)
   └─ Verifica se expirado (SESSION_HOURS = 12)
   └─ Retorna 401 se inválido
   
8. Logout
   └─ DELETE FROM sessions WHERE token = ?
   └─ localStorage.removeItem("lexflow_token")
   └─ Redirect to /login
```

### 5.3 Fluxo de Integração com Tribunal

```
1. User Action
   └─ Clica "Atualizar tribunal" em caso
   
2. Frontend Request
   POST /api/sync-tribunal
   {
     "case_id": 42,
     "case_number": "0800000-22.2026.8.19.0001"
   }
   
3. Backend - Identifica Tribunal
   └─ Extrai digits: "0800000222026819000001"
   └─ Verifica posição 13-16: "8" + "19" = TJ code "19"
   └─ Lookup: STATE_TJ_BY_JUSTICE_CODE["19"] = TJRJ
   
4. Backend - Prepara Requisição
   └─ Sistema detectado: DATAJUD ou DJEN
   └─ Escolhe provider baseado em DATABASE_URL
   
5. DATAJUD Request (API Pública CNJ)
   POST https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search
   Headers: {
     "Authorization": "APIKey {key}",
     "Content-Type": "application/json"
   }
   Body: {
     "query": {
       "match": {
         "numeroProcesso": "0800000222026819000001"
       }
     },
     "size": 1
   }
   
6. Response Parsing
   └─ Extrai dados:
      - numeroProcesso
      - dataMovimentacao
      - descricaoMovimentacao
      - assunto
   └─ Normaliza para schema interno
   
7. Database Update
   └─ INSERT INTO case_movements (case_id, movement_date, ...)
   └─ Atualiza last_sync_date em case
   
8. Frontend Update
   └─ Retorna para frontend:
   {
     "success": true,
     "movements_found": 3,
     "last_movement": "03/06/2026"
   }
   └─ Atualiza UI com novas movimentações
```

---

## 6. Estrutura de Diretórios

```
saas_juridico/
│
├── 📄 Configuração & Documentação
│   ├── README.md                  # Documentação principal
│   ├── ARQUITETURA.md             # Este arquivo
│   ├── Dockerfile                 # Build Docker
│   ├── docker-compose.yml         # Dev compose
│   ├── docker-compose.prod.yml    # Prod compose
│   ├── .env.example               # Template de env
│   ├── .env                       # Configuração local (gitignored)
│   ├── .gitignore                 # Controle Git
│   └── .dockerignore              # Controle Docker
│
├── 🐍 Backend
│   ├── server.py                  # Monolith (5606 linhas, 260KB)
│   │   └─ Contém todos os módulos funcionais
│   │
│   └── requirements.txt           # Dependencies
│       └─ psycopg[binary]>=3.2,<4
│
├── 🌐 Frontend
│   ├── static/
│   │   ├── index.html             # Single HTML page
│   │   │   └─ Single entry point para SPA
│   │   │
│   │   ├── app.js                 # JavaScript aplicação
│   │   │   ├─ Estado global (state object)
│   │   │   ├─ Listeners (click, submit, change)
│   │   │   ├─ Renderização dinâmica
│   │   │   ├─ API calls (fetch)
│   │   │   ├─ Rotas (hash-based)
│   │   │   └─ ~2000+ linhas
│   │   │
│   │   ├── styles.css             # Estilos
│   │   │   ├─ Design system (variáveis CSS)
│   │   │   ├─ Temas light/dark
│   │   │   ├─ Componentes
│   │   │   └─ Responsividade
│   │   │
│   │   └── mark.svg               # Logo/favicon
│
├── 📊 Banco de Dados
│   ├── lexflow.db                 # SQLite local (auto-criado)
│   │   └─ Tabelas: users, sessions, clients, cases, ...
│   │
│   └── (PostgreSQL em Docker Compose)
│       └─ Volume: postgres_data
│
├── 📖 Documentação
│   └── docs/
│       ├── PRODUCAO.md            # Guia de produção (Docker)
│       └── [future docs]
│
├── 🔧 Scripts de Automação
│   └── scripts/
│       ├── backup_postgres.ps1    # Backup BD
│       ├── restore_postgres.ps1   # Restore BD
│       ├── smoke_test.ps1         # Health check
│       ├── start_docker.ps1       # Inicia Docker
│       ├── start_server.ps1       # Inicia servidor
│       ├── stop_docker.ps1        # Para Docker
│       └── stop_server.ps1        # Para servidor
│
├── 📦 Batch Files (Windows)
│   ├── run_server.bat             # Executa na porta 8765
│   ├── run_server_8770.bat        # Executa na porta 8770
│   ├── stop_server.bat            # Para servidor 8765
│   └── stop_server_8770.bat       # Para servidor 8770
│
├── 🧪 Testes & Verificação
│   ├── verify_ui.cjs              # Verifica UI
│   ├── verify_astrea_ui.cjs       # Verifica Astrea UI
│   ├── verify_process_ui.cjs      # Verifica Process UI
│   ├── verify_ui_server.log       # Log de verificação
│   └── wscript_test.txt           # Script test
│
└── 📝 Logs & Temp
    ├── server.out.log             # Output servidor
    ├── server.err.log             # Erros servidor
    ├── server.debug.out.log       # Debug output
    ├── server.debug.err.log       # Debug errors
    ├── server_8770.out.log        # Output porta 8770
    ├── server_8770.err.log        # Erros porta 8770
    ├── server.status.log          # Status log
    └── __pycache__/               # Cache Python
```

---

## 7. Banco de Dados

### 7.1 Arquitetura de Dados

#### Provedor em Desenvolvimento (SQLite)

```
┌────────────────────────────────────────┐
│           lexflow.db (SQLite3)         │
│          (arquivo local)               │
└────────────────────────────────────────┘
         ↑
    http.server
         ↓
    sqlite3 module (Python stdlib)
         ↓
    Conexão local ao arquivo .db
```

**Características:**
- ✅ Autocriado na primeira execução
- ✅ Sem configuração necessária
- ✅ Perfeito para desenvolvimento
- ❌ Não recomendado para produção (single user)

#### Provedor em Produção (PostgreSQL)

```
┌────────────────────────────────────────┐
│       PostgreSQL 16 (em Docker)        │
│          container: lexflow_db         │
└────────────────────────────────────────┘
         ↑
    psycopg[binary] (driver Python)
         ↓
    TCP conexão port 5432
         ↓
    Database: lexflow
    User: lexflow
    Host: db (service name)
```

**Características:**
- ✅ Multi-user (concorrência)
- ✅ Full ACID compliance
- ✅ Replicação e backup
- ✅ Performance em escala

### 7.2 Schema de Dados (Tabelas Principais)

```sql
-- Autenticação & Sessões
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP
);

-- CRM
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  person_type TEXT, -- 'pf' (física) ou 'pj' (jurídica)
  document TEXT, -- CPF ou CNPJ
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE leads (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT, -- 'prospecto', 'qualificado', 'convertido'
  source TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Processos Judiciais
CREATE TABLE cases (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  case_number TEXT UNIQUE, -- número CNJ
  client_id INTEGER REFERENCES clients(id),
  status TEXT, -- 'ativo', 'encerrado', 'suspenso'
  action_type TEXT,
  court TEXT, -- tribunal
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_sync_date TIMESTAMP
);

CREATE TABLE case_movements (
  id INTEGER PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  movement_date TIMESTAMP,
  description TEXT,
  source TEXT, -- 'DATAJUD', 'DJEN', 'manual'
  created_at TIMESTAMP
);

-- Agenda
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  owner_id INTEGER REFERENCES users(id),
  case_id INTEGER REFERENCES cases(id),
  description TEXT,
  created_at TIMESTAMP
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  due_date TIMESTAMP,
  owner_id INTEGER REFERENCES users(id),
  case_id INTEGER REFERENCES cases(id),
  status TEXT, -- 'aberta', 'concluída', 'vencida'
  priority TEXT, -- 'baixa', 'média', 'alta'
  created_at TIMESTAMP
);

-- Financeiro
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  number TEXT UNIQUE,
  client_id INTEGER REFERENCES clients(id),
  amount DECIMAL(10, 2),
  issue_date TIMESTAMP,
  due_date TIMESTAMP,
  status TEXT, -- 'rascunho', 'emitida', 'paga', 'atrasada'
  created_at TIMESTAMP
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP,
  method TEXT, -- 'pix', 'transfer', 'cheque'
  created_at TIMESTAMP
);

-- Documentos
CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  case_id INTEGER REFERENCES cases(id),
  file_path TEXT,
  file_type TEXT, -- 'pdf', 'docx', 'odt'
  generated_by TEXT, -- 'manual', 'ia'
  created_at TIMESTAMP
);

-- Alertas
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  alert_type TEXT, -- 'info', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

-- Publicações/Integração Tribunal
CREATE TABLE publications (
  id INTEGER PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id),
  publication_date TIMESTAMP,
  tribunal TEXT,
  description TEXT,
  source TEXT, -- 'DATAJUD', 'DJEN', 'PJE'
  external_id TEXT,
  created_at TIMESTAMP
);

-- Configurações
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP
);
```

### 7.3 Fluxo de Conexão BD

```
1. Initialization (server.py startup)
   └─ load_env_file(".env")
   └─ DB_PROVIDER = "postgres" if DATABASE_URL else "sqlite"
   
2. Connect Function
   ```python
   def connect():
     if DB_PROVIDER == "postgres":
       return PgConnection(DATABASE_URL)  # Psycopg
     else:
       return sqlite3.connect(DB_PATH)    # SQLite
   ```
   
3. Abstraction Layer
   ├─ DbRow: wraps result rows
   ├─ PgCursor: wraps cursor
   └─ PgConnection: wraps connection (context manager)
   
4. Query Execution
   ```python
   with connect() as conn:
     cursor = conn.execute("SELECT * FROM users WHERE id = ?", (1,))
     row = cursor.fetchone()
     # Retorna DbRow (compatibility layer)
   ```
   
5. SQL Transpilation
   ├─ SQLite: `?` placeholders
   └─ PostgreSQL: `%s` placeholders (convertido automaticamente)
   
6. Result Processing
   └─ Compatibilidade automática entre SQLite e PostgreSQL
```

---

## 8. Camada de Apresentação

### 8.1 Arquitetura Frontend

```
                    index.html
                         │
         ┌────────────────┴────────────────┐
         │                                  │
    CSS (styles.css)              JavaScript (app.js)
    │                             │
    ├─ Design System             ├─ State Management
    ├─ Temas (light/dark)        ├─ Rotas (hash-based SPA)
    ├─ Componentes               ├─ Event Listeners
    ├─ Responsividade            ├─ API Calls
    └─ Animações                 ├─ Renderização
                                 └─ LocalStorage (token, theme)
                                 
                    HTTP Requests
                         │
                    server.py (Backend)
```

### 8.2 Fluxo de Renderização

```
1. Page Load
   └─ Carrega index.html (1 arquivo único)
   └─ Carrega app.js (lógica aplicação)
   └─ Carrega styles.css (estilos)
   
2. Initial State Check
   └─ localStorage.lexflow_token existe?
   └─ Sim → vai para dashboard
   └─ Não → mostra login
   
3. Event-Driven Rendering
   └─ User clica botão → dispara listener
   └─ Listener atualiza state
   └─ State muda → re-renderiza componente
   
4. API Data Fetching
   └─ fetch(url, {headers: {Authorization: token}})
   └─ Aguarda resposta JSON
   └─ Atualiza state com dados
   └─ Re-renderiza componente com dados
   
5. Dynamic HTML Generation
   └─ Concatena strings para gerar HTML
   └─ Insere em DOM via innerHTML
   └─ Aplica event listeners
```

### 8.3 Rotas e Componentes

#### Dashboard (/)

```
┌─────────────────────────────────────────────┐
│              Painel Executivo               │
├─────────────────────────────────────────────┤
│ Cards: Clientes | Leads | Processos | Tasks │
├─────────────────────────────────────────────┤
│ Fila de Atenção                             │
│ ├─ Tarefas vencidas                         │
│ ├─ Alertas críticos                         │
│ └─ Próximos eventos                         │
├─────────────────────────────────────────────┤
│ Funil e IA                                  │
│ ├─ Pipeline de leads                        │
│ └─ Execuções recentes de agentes            │
└─────────────────────────────────────────────┘
```

#### CRM Jurídico (/#/crm, /#/clients)

```
┌──────────────────────────────────────┐
│      Clientes & Leads                │
├──────────────────────────────────────┤
│ Search + Filtros                     │
├──────────────────────────────────────┤
│ Tabela de Clientes                   │
│ ├─ Nome | Email | Fone | Actions    │
│ ├─ Paginação                         │
│ └─ Formulário de novo cliente        │
├──────────────────────────────────────┤
│ Abas                                 │
│ ├─ Dados pessoais                    │
│ ├─ Endereço                          │
│ ├─ Contato                           │
│ └─ Histórico                         │
└──────────────────────────────────────┘
```

#### Processos (/#/cases)

```
┌──────────────────────────────────────┐
│    Processos e Casos                 │
├──────────────────────────────────────┤
│ Search + Filtros                     │
│ ├─ Status (Ativos/Todos/Encerrados) │
│ └─ Etiquetas                         │
├──────────────────────────────────────┤
│ Tabela de Processos                  │
│ ├─ Título | Cliente | Número CNJ    │
│ ├─ Ação/Foro | Última Movimentação  │
│ └─ Ações (Excluir, Editar)          │
├──────────────────────────────────────┤
│ Botões de Ação                       │
│ ├─ Novo Processo                    │
│ ├─ Exportar                          │
│ ├─ Atualizar Tribunal                │
│ └─ Nova Etiqueta                     │
└──────────────────────────────────────┘
```

### 8.4 Componentes Reutilizáveis

```javascript
// Modal
function renderModal(title, content, actions) {
  return `
    <div class="modal-overlay">
      <div class="modal">
        <h2>${title}</h2>
        ${content}
        <div class="modal-actions">${actions}</div>
      </div>
    </div>
  `;
}

// Card
function renderCard(icon, title, value, subtitle) {
  return `
    <article class="card">
      <div class="card-icon">${icon}</div>
      <div class="card-title">${title}</div>
      <div class="card-value">${value}</div>
      <div class="card-subtitle">${subtitle}</div>
    </article>
  `;
}

// Table Row
function renderTableRow(data, columns) {
  return `
    <tr>
      ${columns.map(col => `<td>${data[col]}</td>`).join('')}
    </tr>
  `;
}

// Form Input
function renderInput(label, name, value, type = 'text') {
  return `
    <div class="form-group">
      <label>${label}</label>
      <input type="${type}" name="${name}" value="${value}" />
    </div>
  `;
}
```

---

## 9. Camada de Negócio

### 9.1 Lógica de Autenticação

```python
# server.py - authentication.py (conceitual)

def handle_login(email, password):
    """Autentica usuário"""
    # 1. Busca usuário
    user = db.query("SELECT * FROM users WHERE email = ?", (email,))
    if not user:
        return {"error": "Usuário não encontrado"}, 401
    
    # 2. Valida senha (HMAC)
    expected_hash = hmac.new(
        key=BACKEND_SECRET.encode(),
        msg=password.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    if expected_hash != user['password_hash']:
        return {"error": "Senha incorreta"}, 401
    
    # 3. Cria sessão
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=SESSION_HOURS)
    
    db.execute(
        "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
        (user['id'], token, expires_at)
    )
    
    # 4. Retorna token
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "role": user['role']
        }
    }, 200

def verify_token(token):
    """Verifica validade do token"""
    session = db.query(
        "SELECT * FROM sessions WHERE token = ?", 
        (token,)
    )
    
    if not session:
        return None
    
    if datetime.fromisoformat(session['expires_at']) < datetime.utcnow():
        db.execute("DELETE FROM sessions WHERE id = ?", (session['id'],))
        return None
    
    return session['user_id']
```

### 9.2 Lógica de CRM

```python
# server.py - crm.py (conceitual)

def handle_create_client(data, user_id):
    """Cria novo cliente"""
    # Validação
    required = ['name', 'person_type']
    if not all(k in data for k in required):
        return {"error": "Campos obrigatórios"}, 400
    
    # Normalização
    person_type = data['person_type']  # 'pf' ou 'pj'
    
    # Criação
    cursor = db.execute(
        """INSERT INTO clients 
           (name, email, phone, person_type, document, created_at)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            data['name'],
            data.get('email'),
            data.get('phone'),
            person_type,
            data.get('document'),  # CPF ou CNPJ
            utc_now()
        )
    )
    
    client_id = cursor.lastrowid
    
    return {
        "success": True,
        "client_id": client_id,
        "message": "Cliente criado com sucesso"
    }, 201
```

### 9.3 Lógica de Processos Judiciais

```python
# server.py - cases.py (conceitual)

def handle_sync_tribunal(case_id, case_number):
    """Sincroniza caso com tribunal"""
    
    # 1. Identifica tribunal
    provider = infer_state_tj_provider_from_case_number(case_number)
    if not provider:
        return {"error": "Número CNJ inválido"}, 400
    
    # 2. Configura connector
    connector = tribunal_default_connector("DATAJUD", provider)
    
    # 3. Prepara requisição
    case_number_digits = normalize_case_number(case_number)
    
    request_body = parse_json_object(
        connector['request_body_template']
    )
    request_body = template_fill(
        json.dumps(request_body),
        {"case_number_digits": case_number_digits}
    )
    
    # 4. Faz requisição HTTP
    headers = {
        connector['api_key_header']: connector['api_key_value']
    }
    
    response = urllib.request.urlopen(
        urllib.request.Request(
            url=f"{connector['base_url']}{connector['resource_path']}",
            data=request_body.encode() if request_body else None,
            headers=headers,
            method=connector['http_method']
        ),
        timeout=connector['timeout_seconds']
    ).read().decode()
    
    # 5. Processa resposta
    movements = parse_datajud_response(json.loads(response))
    
    # 6. Armazena no BD
    for movement in movements:
        db.execute(
            """INSERT INTO case_movements 
               (case_id, movement_date, description, source)
               VALUES (?, ?, ?, ?)""",
            (case_id, movement['date'], movement['desc'], 'DATAJUD')
        )
    
    # 7. Atualiza caso
    db.execute(
        "UPDATE cases SET last_sync_date = ? WHERE id = ?",
        (utc_now(), case_id)
    )
    
    return {
        "success": True,
        "movements_found": len(movements),
        "last_movement": movements[-1]['date'] if movements else None
    }, 200
```

### 9.4 Lógica de IA (OpenAI Integration)

```python
# server.py - ai.py (conceitual)

def handle_generate_document(case_id, document_type):
    """Gera documento jurídico com IA"""
    
    # 1. Busca contexto do caso
    case = db.query("SELECT * FROM cases WHERE id = ?", (case_id,))
    client = db.query("SELECT * FROM clients WHERE id = ?", (case['client_id'],))
    movements = db.query(
        "SELECT * FROM case_movements WHERE case_id = ? ORDER BY movement_date DESC",
        (case_id,)
    )
    
    # 2. Monta prompt
    prompt = f"""
    Gere uma {document_type} jurídica para o seguinte caso:
    
    Caso: {case['title']}
    Número: {case['case_number']}
    Cliente: {client['name']}
    Ação: {case['action_type']}
    Tribunal: {case['court']}
    
    Movimentações recentes:
    {chr(10).join(m['description'] for m in movements[:5])}
    
    Gere um documento profissional em português brasileiro.
    """
    
    # 3. Chama OpenAI (se habilitado)
    if USE_OPENAI_AGENTS and OPENAI_API_KEY:
        try:
            response = urllib.request.urlopen(
                urllib.request.Request(
                    url=f"{OPENAI_API_BASE}/chat/completions",
                    data=json.dumps({
                        "model": OPENAI_MODEL,
                        "messages": [
                            {"role": "system", "content": "Você é um advogado experiente..."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7
                    }).encode(),
                    headers={
                        "Authorization": f"Bearer {OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    }
                ),
                timeout=OPENAI_TIMEOUT_SECONDS
            ).read().decode()
            
            result = json.loads(response)
            document_content = result['choices'][0]['message']['content']
            
        except Exception as e:
            # Fallback para modelo local
            document_content = generate_document_local(prompt)
    else:
        # Usa modelo local por padrão
        document_content = generate_document_local(prompt)
    
    # 4. Armazena documento
    doc_id = db.execute(
        """INSERT INTO documents 
           (title, case_id, file_type, generated_by, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (
            f"{document_type} - {case['title']}",
            case_id,
            'docx',
            'ia',
            utc_now()
        )
    ).lastrowid
    
    return {
        "success": True,
        "document_id": doc_id,
        "content": document_content,
        "type": document_type
    }, 201
```

---

## 10. Integrações Externas

### 10.1 Integração com OpenAI

```python
"""
Arquitetura de Integração OpenAI
"""

# Configuração
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-5.4-mini")
OPENAI_API_BASE = "https://api.openai.com/v1"
OPENAI_TIMEOUT_SECONDS = 45
USE_OPENAI_AGENTS = os.environ.get("LEXFLOW_USE_OPENAI", "true").lower() in {"1", "true"}

# Requisição
{
  "model": "gpt-5.4-mini",
  "messages": [
    {
      "role": "system",
      "content": "Você é um especialista em direito trabalhista..."
    },
    {
      "role": "user",
      "content": "Analise este contrato..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}

# Resposta
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1685564645,
  "model": "gpt-5.4-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Este contrato apresenta as seguintes..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 800,
    "total_tokens": 950
  }
}

# Tratamento de Erro
├─ Timeout → Tenta fallback local
├─ API Rate Limit → Queue de requisições
├─ Invalid Key → Desabilita IA
└─ Network Error → Retry com backoff exponencial
```

### 10.2 Integração com Tribunais (DataJud/DJEN/PJE)

#### DataJud (CNJ)

```python
"""
API Pública DataJud - Consulta capas e movimentações
"""

# Provider Configuration
DATAJUD_PUBLIC_API_KEY = "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=="
DATAJUD_API_BASE = "https://api-publica.datajud.cnj.jus.br"

# Tribunals (27 TJs + STJ + STF)
STATE_TJ_COURTS = [
  {"code": "TJAC", "name": "Tribunal de Justiça do Acre", "alias": "tjac", "justice_code": "01"},
  {"code": "TJAL", "name": "Tribunal de Justiça de Alagoas", "alias": "tjal", "justice_code": "02"},
  # ... 25 outros ...
  {"code": "TJSP", "name": "Tribunal de Justiça de São Paulo", "alias": "tjsp", "justice_code": "26"},
]

# Requisição
POST /api_publica_tjsp/_search
Authorization: APIKey {key}
Content-Type: application/json

{
  "query": {
    "match": {
      "numeroProcesso": "0800000222026819000001"
    }
  },
  "size": 1
}

# Resposta
{
  "hits": {
    "total": {"value": 1},
    "hits": [
      {
        "_source": {
          "numeroProcesso": "0800000-22.2026.8.19.0001",
          "assunto": "Produto com defeito",
          "dataMovimentacao": "2026-06-03",
          "descricaoMovimentacao": "Sentença",
          "situacao": "Ativo"
        }
      }
    ]
  }
}

# Parser
def parse_datajud_response(response):
  movements = []
  for hit in response['hits']['hits']:
    source = hit['_source']
    movements.append({
      'case_number': source['numeroProcesso'],
      'date': source['dataMovimentacao'],
      'description': source['descricaoMovimentacao'],
      'status': source['situacao']
    })
  return movements
```

#### DJEN (Comunicação CNJ)

```python
"""
DJEN - Diário de Justiça Eletrônico Nacional
Para publicações de tribunais
"""

# Configuração
DJEN_BASE = "https://hcomunicaapi.cnj.jus.br/api/v1"
DJEN_RESOURCE_PATH = "/caderno/{provider}/{date}/D"

# Requisição
GET /api/v1/caderno/TJSP/2026-06-03/D
Authorization: none
Accept: application/json

# Resposta (exemplo)
{
  "data": [
    {
      "tribunal": "TJSP",
      "data": "2026-06-03",
      "sequencial": 1,
      "titulo": "Avisos",
      "conteudo": "..."
    }
  ]
}

# Polling
├─ Sincroniza diariamente
├─ Busca últimas 2-3 dias (poll_days_back)
└─ Processa novidades incrementalmente
```

#### PJE (TJMG)

```python
"""
PJE - Sistema específico TJMG
"""

# Configuração
PJE_BASE = "https://hcomunicaapi.cnj.jus.br/api/v1"
PJE_RESOURCE_PATH = "/caderno/TJMG/{date}/D"

# Habilitação
TJMG_PJE_ENABLED = True
TJMG_PJE_BASE_URL = "https://hcomunicaapi.cnj.jus.br/api/v1"

# Requisição
GET /api/v1/caderno/TJMG/2026-06-03/D

# Processamento
├─ Extrai dados de diários
├─ Associa a processos locais
└─ Cria alertas se publicação encontrada
```

### 10.3 Fluxo de Sincronização

```
┌─────────────────────────────────────────┐
│   User Action: "Atualizar Tribunal"     │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Identifica   │
        │ Tribunal por │
        │ Número CNJ   │
        └──────┬───────┘
               │
               ▼
        ┌──────────────────────┐
        │ Seleciona Conectador │
        │ DATAJUD/DJEN/PJE     │
        └──────┬───────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ Prepara Requisição   │
        │ HTTP com templates   │
        └──────┬───────────────┘
               │
               ▼
     ┌─────────────────────────┐
     │ Faz Request com Timeout │
     │ (45 segundos para API)  │
     └──────┬──────────────────┘
            │
        ┌───┴───┐
        │       │
    SUCCESS  TIMEOUT/ERROR
        │       │
        ▼       ▼
     Parse   Retry com
     Response Backoff
        │       │
        ▼       ▼
   Armazena em BD
        │
        ▼
   Atualiza last_sync_date
        │
        ▼
   Retorna para Frontend
        │
        ▼
   UI atualizada
```

---

## 11. Fluxos Principais

### 11.1 Fluxo Completo: Login → Dashboard → Novo Processo

```
PASSO 1: LOGIN
┌─────────────────────────────────┐
│ 1.1 User acessa /               │
│ 1.2 Renderiza login form        │
│ 1.3 User entra admin@lexflow... │
│ 1.4 User entra admin123         │
│ 1.5 Clica "Entrar"              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ POST /api/login                 │
│ { email, password }             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Backend:                        │
│ 1. Busca user no BD            │
│ 2. Valida HMAC-SHA256(pwd)     │
│ 3. Cria session + token        │
│ 4. Retorna token               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Frontend:                       │
│ 1. Recebe token                │
│ 2. localStorage[token] = ...   │
│ 3. state.user = user_data      │
│ 4. Navega para dashboard       │
└────────────┬────────────────────┘

PASSO 2: DASHBOARD
┌─────────────────────────────────┐
│ 1. GET /api/dashboard/metrics   │
│ 2. Renderiza cards com stats    │
│ 3. GET /api/alerts/open         │
│ 4. Mostra fila de atenção       │
│ 5. GET /api/cases?limit=30      │
│ 6. Exibe casos recentes         │
└────────────┬────────────────────┘

PASSO 3: NOVO PROCESSO
┌─────────────────────────────────┐
│ 1. User clica "Novo Processo"   │
│ 2. Modal de composição abre     │
│ 3. Preenche formulário:         │
│    - Título                     │
│    - Cliente (select)           │
│    - Número CNJ                 │
│    - Ação/Foro                  │
│ 4. Clica "Criar"                │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ POST /api/cases                 │
│ {                               │
│   title, client_id,             │
│   case_number, action_type      │
│ }                               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Backend:                        │
│ 1. Valida dados                │
│ 2. Normaliza número CNJ        │
│ 3. Identifica tribunal          │
│ 4. INSERT INTO cases            │
│ 5. Retorna case_id              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Frontend:                       │
│ 1. Recebe case_id               │
│ 2. Fecha modal                  │
│ 3. Atualiza lista de casos      │
│ 4. Mostra toast "Sucesso!"      │
│ 5. Novo caso aparece na tabela  │
└─────────────────────────────────┘
```

### 11.2 Fluxo: Sincronizar Caso com Tribunal

```
USER ACTION: Clica "Atualizar Tribunal" em caso
    │
    ▼
FRONTEND: Coleta dados
├─ case_id = 42
├─ case_number = "0800000-22.2026.8.19.0001"
└─ Envia POST /api/sync-tribunal

BACKEND STEP 1: Identifica Tribunal
├─ Extrai justice_code de case_number
├─ "19" → STATE_TJ_BY_JUSTICE_CODE["19"] = TJRJ
└─ tribunal = TJRJ

BACKEND STEP 2: Seleciona Connector
├─ Busca em environment:
│  ├─ DATAJUD_ENABLED = true
│  └─ DATAJUD_API_KEY = [chave pública CNJ]
└─ connector = DATAJUD + TJRJ

BACKEND STEP 3: Prepara Requisição
├─ Base URL: https://api-publica.datajud.cnj.jus.br
├─ Resource: /api_publica_tjrj/_search
├─ Request Body:
│  {
│    "query": {"match": {"numeroProcesso": "{case_number_digits}"}},
│    "size": 1
│  }
└─ Headers: {"Authorization": "APIKey {key}"}

BACKEND STEP 4: Faz HTTP Request
├─ urllib.request.urlopen()
├─ Timeout: 45 segundos
└─ Aguarda resposta JSON

BACKEND STEP 5: Processa Resposta
├─ JSON parse
├─ Extrai hits
├─ Mapeia para schema interno:
│  {
│    "case_number": "0800000-22.2026.8.19.0001",
│    "movement_date": "2026-06-03",
│    "description": "Sentença proferida",
│    "status": "Ativo"
│  }
└─ Valida dados

BACKEND STEP 6: Armazena em BD
├─ INSERT INTO case_movements (...)
├─ UPDATE cases SET last_sync_date = ?
└─ Commit

BACKEND STEP 7: Retorna ao Frontend
{
  "success": true,
  "movements_found": 3,
  "last_movement": "2026-06-03",
  "movements": [...]
}

FRONTEND STEP 8: Atualiza UI
├─ Fecha loading indicator
├─ Atualiza lista de movimentações
├─ Mostra últimas movimentações
└─ Toast: "Sincronizado com sucesso!"
```

---

## 12. Padrões de Design

### 12.1 Padrões Utilizados

#### 1. **Repository Pattern** (Abstração de BD)

```python
# Em vez de:
sqlite3.connect(...).execute(...)  # Tightly coupled

# LexFlow usa:
class DbRow:
    """Abstração de linha"""
    pass

class PgConnection:
    """Abstração de conexão"""
    pass

# Benefício: Fácil trocar SQLite por PostgreSQL sem mudar lógica
```

#### 2. **Adapter Pattern** (SQLite ↔ PostgreSQL)

```python
def connect():
    if DB_PROVIDER == "postgres":
        return PgConnection(DATABASE_URL)  # PostgreSQL adapter
    else:
        return sqlite3.connect(DB_PATH)    # SQLite (built-in)

# Benefício: Mesmo código funciona com ambos os BDs
```

#### 3. **Template Method Pattern** (Requisições API)

```python
def template_fill(template: str, values: dict) -> str:
    """Preenche template com variáveis"""
    result = template
    for key, value in values.items():
        result = result.replace(f"{{{key}}}", str(value))
    return result

# Uso:
template = "/caderno/{provider}/{date}/D"
filled = template_fill(template, {"provider": "TJSP", "date": "2026-06-03"})
# Result: "/caderno/TJSP/2026-06-03/D"
```

#### 4. **Strategy Pattern** (Diferentes parsers)

```python
parsers = {
    "datajud": parse_datajud_response,
    "djen": parse_djen_response,
    "pje": parse_pje_response,
}

# Uso:
parser = parsers[system_code]
data = parser(raw_response)
```

#### 5. **Context Manager Pattern** (Sessões BD)

```python
class PgConnection:
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()
        self.conn.close()

# Uso:
with PgConnection(dsn) as conn:
    cursor = conn.execute("SELECT ...")
    # Auto-commit ou rollback
```

---

## 13. Segurança

### 13.1 Mecanismos de Segurança Implementados

#### 1. **Autenticação (HMAC-SHA256)**

```python
import hmac
import hashlib
import secrets

# Senha não é armazenada em texto plano
# É armazenado como HMAC
password_hash = hmac.new(
    key=BACKEND_SECRET.encode(),
    msg=password.encode(),
    digestmod=hashlib.sha256
).hexdigest()

# Validação durante login
expected = hmac.new(
    key=BACKEND_SECRET.encode(),
    msg=provided_password.encode(),
    digestmod=hashlib.sha256
).hexdigest()

if expected != password_hash:
    # Rejeita
```

#### 2. **Session Tokens (secrets.token_urlsafe)**

```python
# Gera token seguro e aleatório
token = secrets.token_urlsafe(32)  # 256 bits de entropia

# Armazenado em BD com vencimento
INSERT INTO sessions (user_id, token, expires_at)
VALUES (?, ?, ?)

# Verificado em cada request
SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()
```

#### 3. **SQL Injection Prevention**

```python
# ❌ VULNERÁVEL:
query = f"SELECT * FROM users WHERE id = {user_id}"
conn.execute(query)

# ✅ SEGURO (LexFlow usa):
cursor = conn.execute(
    "SELECT * FROM users WHERE id = ?",  # ? placeholder
    (user_id,)                           # parâmetro separado
)
```

#### 4. **CORS (Cross-Origin Resource Sharing)**

```python
# Server retorna headers:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

#### 5. **HTTPS Recomendado em Produção**

```
# Desenvolvimento: http://127.0.0.1:8765
# Produção: https://lexflow.empresa.com.br (com TLS/SSL)
```

### 13.2 Riscos e Mitigações

| Risco | Implementado | Pendente |
|-------|---|---|
| SQL Injection | ✅ Parametrização | - |
| Session Fixation | ✅ Token aleatório | Renovação periódica |
| CSRF | ⚠️ Parcial | Tokens CSRF em forms |
| XSS | ⚠️ Parcial | Content-Security-Policy |
| Credenciais em Log | ✅ Não registra | - |
| Credential Leakage | ⚠️ .env sem versionamento | - |
| Rate Limiting | ❌ Não implementado | Necessário em produção |

---

## 14. Deployment

### 14.1 Modo Desenvolvimento

```powershell
# 1. Ambiente virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Dependências
pip install -r requirements.txt

# 3. Configuração
Copy-Item .env.example .env
# Editar .env com OPENAI_API_KEY

# 4. Execução
python server.py --host 127.0.0.1 --port 8765

# Acesso: http://127.0.0.1:8765
```

### 14.2 Modo Produção (Docker)

```bash
# 1. Build
docker compose build

# 2. Run
docker compose up -d

# 3. Services
db:     PostgreSQL 16 (lexflow_db)
app:    LexFlow App (lexflow_app, porta 8765)

# 4. Verificar
curl http://127.0.0.1:8765/api/health
```

### 14.3 Checklist de Deploy

```
Pré-deployment:
├─ [ ] .env configurado (OPENAI_API_KEY, DATABASE_URL)
├─ [ ] Database migrado (PostgreSQL em produção)
├─ [ ] Credenciais demo substituídas
├─ [ ] HTTPS/TLS configurado
├─ [ ] Backup automático ativado
├─ [ ] Logging e monitoring setado
├─ [ ] Testes executados
├─ [ ] Performance validada
└─ [ ] Segurança auditada

Pós-deployment:
├─ [ ] Health checks passando
├─ [ ] Logs sem erros
├─ [ ] Performance dentro de SLA
├─ [ ] Backup restaurável
├─ [ ] Alertas configurados
└─ [ ] Time treinado
```

---

## 🎯 Resumo da Arquitetura

### Stack Tecnológico

```
┌─────────────────────────────────────┐
│ Frontend: HTML5 + CSS3 + JS Vanilla │
│ (SPA com roteamento hash-based)     │
├─────────────────────────────────────┤
│ Backend: Python 3.14.5 monolith    │
│ (http.server.ThreadingHTTPServer)  │
├─────────────────────────────────────┤
│ Database:                           │
│ ├─ Dev: SQLite3 (local)            │
│ └─ Prod: PostgreSQL 16 (Docker)    │
├─────────────────────────────────────┤
│ Integrações:                        │
│ ├─ OpenAI API (gpt-5.4-mini)       │
│ ├─ DataJud/CNJ (27 TJs)            │
│ ├─ DJEN (Comunicação)              │
│ └─ PJE (TJMG)                      │
└─────────────────────────────────────┘
```

### Características Principais

- ✅ **Monolith Modular**: Um arquivo, múltiplos módulos
- ✅ **Zero Framework Pesado**: Apenas stdlib + 1 dependência
- ✅ **Full-Stack**: Backend + Frontend integrados
- ✅ **Database Agnóstico**: SQLite ou PostgreSQL
- ✅ **Segurança**: HMAC-SHA256, tokens, parametrização SQL
- ✅ **Escalável**: Thread-based concurrency
- ✅ **Containerizado**: Docker + Docker Compose

### Prontidão

```
Desenvolvimento:   ✅✅✅✅✅ (100%)
MVP:              ✅✅✅✅ (80%)
Produção:         ✅✅✅ (70%)
Enterprise:       ✅✅ (40%)
```

---

**Documento versão 1.0 - Gerado em 03 de junho de 2026**

Para dúvidas sobre arquitetura, consulte o código-fonte em `server.py` e `static/app.js`
