const authConfig = require('../config/auth');

/**
 * Middleware de autenticação unificado
 * Aceita Basic Auth ou Bearer Token
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  // Verifica Bearer Token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === authConfig.bearerToken) {
      return next();
    }
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Verifica Basic Auth
  if (authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');

    if (username === authConfig.basicAuth.username &&
        password === authConfig.basicAuth.password) {
      return next();
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="API"');
  return res.status(401).json({ error: 'Método de autenticação inválido' });
}

module.exports = authenticate;
