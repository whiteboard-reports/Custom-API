const express = require('express');
const healthRoutes = require('./routes/health');
const issuesRoutes = require('./routes/issues');
const projectsRoutes = require('./routes/projects');
const sourceRoutes = require('./routes/source');
const demoRoutes = require('./routes/demo');

const app = express();

// Middleware para parsing de JSON (caso necessário no futuro)
app.use(express.json());

// Registro de rotas
app.use('/health', healthRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/public/projects', projectsRoutes);
app.use('/api/source/issues', sourceRoutes);
app.use('/api/demo/issues', demoRoutes);

module.exports = app;
