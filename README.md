# API Customizada - Documentação

API REST para gerenciamento de issues e projetos com suporte a múltiplos métodos de autenticação.

## Instalação e Execução

### Execução Local

```bash
npm install
npm start
```

A API estará disponível em `http://localhost:3000`

### Deploy no Render (Produção)

Esta API está pronta para deploy no Render. Siga os passos:

1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório do Bitbucket/GitHub
4. O Render detectará automaticamente as configurações do `render.yaml`
5. Clique em "Create Web Service"

**Configurações automáticas (via `render.yaml`):**
- Build Command: `npm install`
- Start Command: `npm start`
- Node Version: 18.20.0 (detectado via `.node-version`)

**Após o deploy:**
- Sua API estará disponível em: `https://seu-app.onrender.com`
- Exemplo: `https://seu-app.onrender.com/api/issues`

**Observação:** No plano gratuito, o app hiberna após 15 minutos de inatividade. O primeiro request após hibernação pode demorar ~30 segundos.

## Autenticação

A API suporta dois métodos de autenticação para rotas protegidas:

### 1. Basic Authentication

**Credenciais:**
- Username: `admin`
- Password: `admin123`

**Exemplo de uso:**
```bash
curl -u admin:admin123 http://localhost:3000/api/issues
```

Ou com header explícito:
```bash
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:3000/api/issues
```

### 2. Bearer Token

**Token estático:** `wbr-token-2024-xyz`

**Exemplo de uso:**
```bash
curl -H "Authorization: Bearer wbr-token-2024-xyz" http://localhost:3000/api/issues
```

## Endpoints

### `GET /api/issues`

**Autenticação:** Obrigatória (Basic Auth ou Bearer Token)

**Descrição:** Retorna uma lista de issues/tickets do sistema.

**Campos retornados:**
- `issueType` (string): Tipo da issue - Bug, Task, Improvement, Story, Epic
- `assignee` (string): Responsável pela issue
- `status` (string): Status atual - Open, Closed, In Progress, In Review, Blocked
- `priority` (string): Prioridade - Critical, High, Medium, Low
- `timeSpent` (number): Tempo gasto em horas
- `storyPoints` (number): Pontos de história

**Observações:** Alguns campos podem conter valores vazios (`""`) ou `null`.

**Exemplo de resposta:**
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
]
```

**Total de registros:** ~25 issues

---

### `GET /api/public/projects`

**Autenticação:** Não requerida (rota pública)

**Descrição:** Retorna uma lista de projetos da organização.

**Campos retornados:**
- `name` (string): Nome do projeto
- `category` (string): Categoria - Frontend, Backend, Mobile, Data, Security, Infrastructure, Integration, AI
- `status` (string): Status atual - Active, Planning, Completed, On Hold
- `lead` (string): Líder do projeto
- `budget` (number): Orçamento em dólares
- `teamSize` (number): Tamanho da equipe
- `completionRate` (number): Taxa de conclusão em porcentagem (0-100)

**Observações:** Alguns campos podem conter valores vazios (`""`) ou `null`.

**Exemplo de resposta:**
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
]
```

**Total de registros:** ~15 projetos

---

## Exemplos de Uso

### Testando autenticação com Basic Auth
```bash
# Sucesso (200)
curl -u admin:admin123 http://localhost:3000/api/issues

# Falha - credenciais inválidas (401)
curl -u admin:wrongpassword http://localhost:3000/api/issues

# Falha - sem autenticação (401)
curl http://localhost:3000/api/issues
```

### Testando autenticação com Bearer Token
```bash
# Sucesso (200)
curl -H "Authorization: Bearer wbr-token-2024-xyz" http://localhost:3000/api/issues

# Falha - token inválido (401)
curl -H "Authorization: Bearer invalid-token" http://localhost:3000/api/issues
```

### Testando rota pública
```bash
# Sucesso sem autenticação (200)
curl http://localhost:3000/api/public/projects
```

## Respostas de Erro

### 401 Unauthorized

**Sem header de autenticação:**
```json
{
  "error": "Autenticação necessária"
}
```

**Credenciais Basic Auth inválidas:**
```json
{
  "error": "Credenciais inválidas"
}
```

**Bearer Token inválido:**
```json
{
  "error": "Token inválido"
}
```

**Método de autenticação inválido:**
```json
{
  "error": "Método de autenticação inválido"
}
```

## Estrutura do Projeto

```
api-customizada/
├── src/
│   ├── config/
│   │   └── auth.js           # Configurações de autenticação
│   ├── data/
│   │   ├── issues.js         # Dataset de issues
│   │   └── projects.js       # Dataset de projetos
│   ├── middleware/
│   │   └── authenticate.js   # Middleware de autenticação
│   ├── routes/
│   │   ├── health.js         # Rota de health check
│   │   ├── issues.js         # Rota de issues
│   │   └── projects.js       # Rota de projetos
│   ├── app.js                # Configuração do Express
│   └── server.js             # Inicialização do servidor
├── index.js                  # Ponto de entrada
├── package.json              # Dependências e scripts
├── README.md                 # Esta documentação
└── node_modules/             # Dependências instaladas
```

### Descrição dos Diretórios

- **src/config/** - Configurações da aplicação (credenciais, tokens)
- **src/data/** - Datasets mockados para testes
- **src/middleware/** - Middlewares customizados (autenticação, validação, etc.)
- **src/routes/** - Definição de rotas/endpoints da API
- **src/app.js** - Configuração central do Express
- **src/server.js** - Inicialização do servidor HTTP

## Tecnologias

- Node.js
- Express.js
- Autenticação Basic Auth e Bearer Token

## Notas

- A API utiliza dados mockados (não há persistência em banco de dados)
- O Bearer Token é estático e definido no código
- Alguns registros contém valores vazios ou `null` propositalmente para simular dados reais
- A rota `/health` não requer autenticação e pode ser usada para verificar se a API está rodando
