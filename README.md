# API Customizada - Documentação

API REST para testes de gráficos e dashboards com dados mockados de issues e projetos.

**URL Base:** `https://custom-api-o7rz.onrender.com`

---

## 🔐 Autenticação

A API suporta **dois métodos de autenticação** (para rotas protegidas):

### Método 1: Basic Authentication

- **Username:** `admin`
- **Password:** `admin123`

### Método 2: Bearer Token

- **Token:** `wbr-token-2024-xyz`

---

## 📡 Endpoints Disponíveis

### 1. Health Check (Sem Autenticação)

**Endpoint:** `/health`

**Descrição:** Verifica se a API está online.

**Autenticação:** ❌ Não requerida

**Exemplo de Request:**

```bash
https://custom-api-o7rz.onrender.com/health
```

**Resposta (200 OK):**

```json
{
  "status": "ok"
}
```

---

### 2. Issues (Com Autenticação)

**Endpoint:** `/api/issues`

**Descrição:** Retorna lista de 25 issues para testes de gráficos.

**Autenticação:** ✅ Obrigatória (Basic Auth ou Bearer Token)

**Exemplo de Request (Basic Auth):**

```bash
https://custom-api-o7rz.onrender.com/api/issues
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Exemplo de Request (Bearer Token):**

```bash
https://custom-api-o7rz.onrender.com/api/issues
Authorization: Bearer wbr-token-2024-xyz
```

**Campos Retornados:**

| Campo         | Tipo   | Valores Possíveis                                       | Descrição          |
| ------------- | ------ | ------------------------------------------------------- | ------------------ |
| `issueType`   | string | Bug, Task, Improvement, Story, Epic, "", null           | Tipo da issue      |
| `assignee`    | string | Nome da pessoa, "", null                                | Responsável        |
| `status`      | string | Open, Closed, In Progress, In Review, Blocked, "", null | Status atual       |
| `priority`    | string | Critical, High, Medium, Low, null                       | Prioridade         |
| `timeSpent`   | number | 0-20, null                                              | Horas gastas       |
| `storyPoints` | number | 1-21, null                                              | Pontos de história |

**Resposta (200 OK):**

```json
[
  {
    "issueType": "Bug",
    "assignee": "John",
    "status": "Open",
    "priority": "Critical",
    "timeSpent": 8,
    "storyPoints": 5
  },
  {
    "issueType": "Story",
    "assignee": "Lucas",
    "status": "In Review",
    "priority": "High",
    "timeSpent": 10,
    "storyPoints": 5
  },
  {
    "issueType": "",
    "assignee": "Amelia",
    "status": "In Review",
    "priority": "High",
    "timeSpent": null,
    "storyPoints": 5
  }
  // ... mais 22 issues
]
```

**Resposta (401 Unauthorized) - Sem autenticação:**

```json
{
  "error": "Autenticação necessária"
}
```

**Resposta (401 Unauthorized) - Credenciais inválidas:**

```json
{
  "error": "Credenciais inválidas"
}
```

**Total de registros:** 25 issues

---

### 3. Projects (Sem Autenticação)

**Endpoint:** `/api/public/projects`

**Descrição:** Retorna lista de 15 projetos para testes de gráficos.

**Autenticação:** ❌ Não requerida (endpoint público)

**Exemplo de Request:**

```bash
https://custom-api-o7rz.onrender.com/api/public/projects
```

**Campos Retornados:**

| Campo            | Tipo   | Valores Possíveis                                                          | Descrição            |
| ---------------- | ------ | -------------------------------------------------------------------------- | -------------------- |
| `name`           | string | Nome do projeto, "", null                                                  | Nome do projeto      |
| `category`       | string | Frontend, Backend, Mobile, Data, Security, Infrastructure, Integration, AI | Categoria            |
| `status`         | string | Active, Planning, Completed, On Hold                                       | Status atual         |
| `lead`           | string | Nome da pessoa, "", null                                                   | Líder do projeto     |
| `budget`         | number | 25000-200000, null                                                         | Orçamento em dólares |
| `teamSize`       | number | 2-12, null                                                                 | Tamanho da equipe    |
| `completionRate` | number | 0-100, null                                                                | % de conclusão       |

**Resposta (200 OK):**

```json
[
  {
    "name": "Website Redesign",
    "category": "Frontend",
    "status": "Active",
    "lead": "Alice Brown",
    "budget": 45000,
    "teamSize": 5,
    "completionRate": 68
  },
  {
    "name": "Mobile App",
    "category": "Mobile",
    "status": "Planning",
    "lead": "Bob Smith",
    "budget": 120000,
    "teamSize": 8,
    "completionRate": 15
  },
  {
    "name": "Machine Learning Model",
    "category": "AI",
    "status": "Completed",
    "lead": "Henry Davis",
    "budget": null,
    "teamSize": 4,
    "completionRate": 100
  }
  // ... mais 12 projetos
]
```

**Total de registros:** 15 projetos

---

## 🧪 Como Testar

### Opção 1: Navegador

**Rota pública (Projects):**

```
https://custom-api-o7rz.onrender.com/api/public/projects
```

Cole no navegador e veja o JSON.

**Rota protegida (Issues):**
O navegador pedirá usuário e senha:

- Username: `admin`
- Password: `admin123`

---

### Opção 2: Postman/Insomnia

**1. Health Check:**

```
https://custom-api-o7rz.onrender.com/health
```

**2. Issues com Basic Auth:**

```
https://custom-api-o7rz.onrender.com/api/issues

Authorization:
  Type: Basic Auth
  Username: admin
  Password: admin123
```

**3. Issues com Bearer Token:**

```
https://custom-api-o7rz.onrender.com/api/issues

Authorization:
  Type: Bearer Token
  Token: wbr-token-2024-xyz
```

**4. Projects (sem auth):**

```
https://custom-api-o7rz.onrender.com/api/public/projects
```

---

### Opção 3: cURL (Terminal)

```bash
# Health check
curl https://custom-api-o7rz.onrender.com/health

# Issues com Basic Auth
curl -u admin:admin123 https://custom-api-o7rz.onrender.com/api/issues

# Issues com Bearer Token
curl -H "Authorization: Bearer wbr-token-2024-xyz" https://custom-api-o7rz.onrender.com/api/issues

# Projects (sem auth)
curl https://custom-api-o7rz.onrender.com/api/public/projects

# Testar falha de autenticação (deve retornar 401)
curl https://custom-api-o7rz.onrender.com/api/issues
```

---

### Opção 4: JavaScript/Fetch

```javascript
// Health check
fetch(
  "https://custom-api-o7rz.onrender.com/health",
)
  .then((res) => res.json())
  .then((data) => console.log(data));

// Issues com Basic Auth
fetch(
  "https://custom-api-o7rz.onrender.com/api/issues",
  {
    headers: {
      Authorization:
        "Basic " + btoa("admin:admin123"),
    },
  },
)
  .then((res) => res.json())
  .then((data) => console.log(data));

// Issues com Bearer Token
fetch(
  "https://custom-api-o7rz.onrender.com/api/issues",
  {
    headers: {
      Authorization: "Bearer wbr-token-2024-xyz",
    },
  },
)
  .then((res) => res.json())
  .then((data) => console.log(data));

// Projects (sem auth)
fetch(
  "https://custom-api-o7rz.onrender.com/api/public/projects",
)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## ⚠️ Observações Importantes

### Valores Nulos/Vazios

- Alguns campos contêm valores vazios (`""`) ou `null` **propositalmente**
- Isso simula dados reais e ajuda a testar edge cases

### Hibernação (Plano Free)

- A API hiberna após 15 minutos sem uso
- **Primeiro request após hibernação demora ~30 segundos**
- Requests subsequentes são rápidos

### CORS

- A API aceita requests de qualquer origem
- Pode ser usada diretamente em aplicações frontend

---

## 📊 Casos de Uso para Testes

### Para Gráficos de Pizza (Pie Charts)

```javascript
// Distribuição por status
/api/issues
Agrupe por: status
Valores: Open, Closed, In Progress, In Review, Blocked

// Distribuição por prioridade
/api/issues
Agrupe por: priority
Valores: Critical, High, Medium, Low

// Distribuição por tipo
/api/issues
Agrupe por: issueType
Valores: Bug, Task, Improvement, Story, Epic

// Projetos por categoria
/api/public/projects
Agrupe por: category
Valores: Frontend, Backend, Mobile, Data, etc.

// Projetos por status
/api/public/projects
Agrupe por: status
Valores: Active, Planning, Completed, On Hold
```

### Para Gráficos de Barra

```javascript
// Story points por assignee
/api/issues
X: assignee, Y: sum(storyPoints)

// Budget por categoria de projeto
/api/public/projects
X: category, Y: sum(budget)

// Completion rate por projeto
/api/public/projects
X: name, Y: completionRate
```

---

## 📄 Paginação (alvo de teste dedicado)

Os endpoints principais (`/api/issues`, `/api/public/projects`) **não paginam** — sempre retornam o array completo, propositalmente, para não quebrar integrações existentes.

Para testar fluxos de **paginação real** — como a feature "Enable Pagination" de uma aplicação consumidora de dashboards/relatórios — use os endpoints abaixo, que fatiam o mesmo dataset de 25 issues em páginas de verdade. Importante: a lógica de checkbox/modal/iteração-até-Max-Pages é responsabilidade **da aplicação consumidora**; esta API só precisa ser um alvo que pagina corretamente.

### 1. Fonte paginada (Sem Autenticação)

**Endpoint:** `/api/source/issues`

**Descrição:** Retorna uma página do dataset de issues, respeitando `offset`/`limit` (ou `cursor`/`nextPageToken`, para testar as outras estratégias de paginação).

**Query params:**

| Param | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| `offset` | number | `0` | Posição inicial da página (estratégia offset/limit) |
| `limit` | number | `10` | Itens por página |
| `cursor` | string | — | Alternativa opaca a `offset` (estratégia cursor) |
| `nextPageToken` | string | — | Alternativa opaca a `offset` (estratégia token) |

**Resposta (200 OK):**

```json
{
  "items": [ /* até "limit" issues */ ],
  "total": 25,
  "nextCursor": "NQ==",
  "nextPageToken": "NQ=="
}
```

`nextCursor`/`nextPageToken` vêm `null` quando não há mais páginas.

---

### 2. Demo de consumo (Sem Autenticação)

**Endpoint:** `/api/demo/issues?type=offset_limit|cursor|token&pageSize=`

**Descrição:** Consome `/api/source/issues` usando o módulo [`src/lib/paginatedFetch.js`](src/lib/paginatedFetch.js), percorrendo todas as páginas e devolvendo os itens já consolidados num único array. Serve como referência de implementação do loop de paginação — equivalente ao que a aplicação consumidora deve fazer ao renderizar relatórios com "Enable Pagination" marcado.

**Resposta (200 OK):**

```json
{
  "type": "offset_limit",
  "pageSize": 5,
  "count": 25,
  "items": [ /* as 25 issues, consolidadas de 5 páginas */ ]
}
```

`type` aceita `offset_limit`, `cursor` ou `token` — todos devolvem as mesmas 25 issues, apenas percorridas de forma diferente.

---

### Como Testar a Paginação

Como o dataset tem só 25 itens, use um `pageSize`/`Limit Value` **menor que 25** (ex: `5` ou `10`) para observar múltiplas páginas sendo consolidadas. O default sugerido pela história de "Enable Pagination" (`Limit Value = 100`) já cobre o dataset inteiro numa página só e não vai exercitar o loop — reduza o valor durante o teste.

#### Opção 1: Navegador

Cole direto no navegador e veja o JSON consolidado:

```
https://custom-api-o7rz.onrender.com/api/demo/issues?type=offset_limit&pageSize=5
```

#### Opção 2: cURL (Terminal)

```bash
# Fonte paginada — uma página crua, para inspecionar offset/cursor/token
curl "https://custom-api-o7rz.onrender.com/api/source/issues?offset=0&limit=5"

# Demo — estratégia offset/limit (equivalente ao tipo "Offset / Limit" da história)
curl "https://custom-api-o7rz.onrender.com/api/demo/issues?type=offset_limit&pageSize=5"

# Demo — estratégia cursor
curl "https://custom-api-o7rz.onrender.com/api/demo/issues?type=cursor&pageSize=5"

# Demo — estratégia token
curl "https://custom-api-o7rz.onrender.com/api/demo/issues?type=token&pageSize=5"
```

Todas as três chamadas de `/api/demo/issues` devem retornar `"count": 25`, confirmando que todas as páginas foram percorridas e consolidadas.

#### Opção 3: JavaScript/Fetch

```javascript
// Uma página crua da fonte
fetch('https://custom-api-o7rz.onrender.com/api/source/issues?offset=0&limit=5')
  .then(res => res.json())
  .then(data => console.log(data));

// Consolidado de todas as páginas (estratégia offset/limit)
fetch('https://custom-api-o7rz.onrender.com/api/demo/issues?type=offset_limit&pageSize=5')
  .then(res => res.json())
  .then(data => console.log(data.count, data.items));
```

#### Opção 4: Uso direto do módulo (em código Node)

```javascript
const { fetchAllPages } = require('./src/lib/paginatedFetch');

const items = await fetchAllPages('https://custom-api-o7rz.onrender.com/api/source/issues', {
  data_path: 'items',
  pagination: {
    type: 'offset_limit',
    offset_param: 'offset',
    limit_param: 'limit',
    limit_value: 5,
    max_pages: 50,
  },
});

console.log(items.length); // 25
```

#### Opção 5: Suíte automatizada

```bash
npm test
```

Roda a suíte `node:test` em [`test/paginatedFetch.test.js`](test/paginatedFetch.test.js), cobrindo as 3 estratégias, dot-notation aninhada, `max_pages`, `pagination: null` (single fetch) e propagação de erro com `.status`.

---

## 🔗 Links Rápidos

- **Health Check:** https://custom-api-o7rz.onrender.com/health
- **Issues:** https://custom-api-o7rz.onrender.com/api/issues
- **Projects:** https://custom-api-o7rz.onrender.com/api/public/projects
- **Fonte paginada:** https://custom-api-o7rz.onrender.com/api/source/issues
- **Demo de paginação:** https://custom-api-o7rz.onrender.com/api/demo/issues?type=offset_limit

---

## 📞 Suporte

Problemas com a API? Entre em contato com o time de desenvolvimento.

**Credenciais para testes:**

- Username: `admin`
- Password: `admin123`
- Token: `wbr-token-2024-xyz`
