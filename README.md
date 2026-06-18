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

**Endpoint:** `GET /health`

**Descrição:** Verifica se a API está online.

**Autenticação:** ❌ Não requerida

**Exemplo de Request:**
```bash
GET https://custom-api-o7rz.onrender.com/health
```

**Resposta (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 2. Issues (Com Autenticação)

**Endpoint:** `GET /api/issues`

**Descrição:** Retorna lista de 25 issues para testes de gráficos.

**Autenticação:** ✅ Obrigatória (Basic Auth ou Bearer Token)

**Exemplo de Request (Basic Auth):**
```bash
GET https://custom-api-o7rz.onrender.com/api/issues
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

**Exemplo de Request (Bearer Token):**
```bash
GET https://custom-api-o7rz.onrender.com/api/issues
Authorization: Bearer wbr-token-2024-xyz
```

**Campos Retornados:**

| Campo | Tipo | Valores Possíveis | Descrição |
|-------|------|-------------------|-----------|
| `issueType` | string | Bug, Task, Improvement, Story, Epic, "", null | Tipo da issue |
| `assignee` | string | Nome da pessoa, "", null | Responsável |
| `status` | string | Open, Closed, In Progress, In Review, Blocked, "", null | Status atual |
| `priority` | string | Critical, High, Medium, Low, null | Prioridade |
| `timeSpent` | number | 0-20, null | Horas gastas |
| `storyPoints` | number | 1-21, null | Pontos de história |

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

**Endpoint:** `GET /api/public/projects`

**Descrição:** Retorna lista de 15 projetos para testes de gráficos.

**Autenticação:** ❌ Não requerida (endpoint público)

**Exemplo de Request:**
```bash
GET https://custom-api-o7rz.onrender.com/api/public/projects
```

**Campos Retornados:**

| Campo | Tipo | Valores Possíveis | Descrição |
|-------|------|-------------------|-----------|
| `name` | string | Nome do projeto, "", null | Nome do projeto |
| `category` | string | Frontend, Backend, Mobile, Data, Security, Infrastructure, Integration, AI | Categoria |
| `status` | string | Active, Planning, Completed, On Hold | Status atual |
| `lead` | string | Nome da pessoa, "", null | Líder do projeto |
| `budget` | number | 25000-200000, null | Orçamento em dólares |
| `teamSize` | number | 2-12, null | Tamanho da equipe |
| `completionRate` | number | 0-100, null | % de conclusão |

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

## 🔗 Links Rápidos

- **Health Check:** https://custom-api-o7rz.onrender.com/health
- **Issues:** https://custom-api-o7rz.onrender.com/api/issues
- **Projects:** https://custom-api-o7rz.onrender.com/api/public/projects


**Credenciais para testes:**
- Username: `admin`
- Password: `admin123`
- Token: `wbr-token-2024-xyz`
