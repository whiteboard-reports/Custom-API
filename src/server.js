const app = require('./app');
const authConfig = require('./config/auth');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`  GET /health - Health check (sem autenticação)`);
  console.log(`  GET /api/issues - Lista de issues (requer autenticação)`);
  console.log(`  GET /api/public/projects - Lista de projetos (sem autenticação)`);
  console.log(`\nAutenticação:`);
  console.log(`  Basic Auth: ${authConfig.basicAuth.username} / ${authConfig.basicAuth.password}`);
  console.log(`  Bearer Token: ${authConfig.bearerToken}`);
});
