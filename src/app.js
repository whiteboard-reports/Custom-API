const express = require('express');
const healthRoutes = require('./routes/health');
const issuesRoutes = require('./routes/issues');
const projectsRoutes = require('./routes/projects');

const app = express();

// Middleware para parsing de JSON (caso necessário no futuro)
app.use(express.json());

// Registro de rotas
app.use('/health', healthRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/public/projects', projectsRoutes);

module.exports = app;
