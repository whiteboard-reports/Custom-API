const express = require('express');
const app = express();

// Credenciais Basic Auth
const USERNAME = 'admin';
const PASSWORD = 'admin123';

// Middleware de Basic Auth
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  if (username === USERNAME && password === PASSWORD) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
}

// Dados mockados
const issues = [
  { "issueType": "Bug", "assignee": "John", "status": "Open", "timeSpent": 8, "storyPoints": 5 },
  { "issueType": "Bug", "assignee": "Mary", "status": "Closed", "timeSpent": 12, "storyPoints": 8 },
  { "issueType": "Task", "assignee": "Peter", "status": "Open", "timeSpent": 6, "storyPoints": 3 },
  { "issueType": "Improvement", "assignee": "Anna", "status": "In Progress", "timeSpent": 4, "storyPoints": 2 },
  { "issueType": "", "assignee": "Lucas", "status": "Open", "timeSpent": 10, "storyPoints": 5 },
  { "issueType": null, "assignee": "Sarah", "status": "Closed", "timeSpent": 7, "storyPoints": 3 }
];

// Rota protegida
app.get('/api/issues', basicAuth, (req, res) => {
  res.json(issues);
});

// Rota de health check (sem auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`Endpoint: GET /api/issues`);
  console.log(`Credenciais: admin / admin123`);
});
