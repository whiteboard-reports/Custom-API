// Cliente HTTP com suporte a paginação completa (offset_limit, cursor, token).
// Usa o fetch global do Node (>=18, ver package.json) — sem dependências novas.

/**
 * @typedef {Object} PaginationConfig
 * @property {'offset_limit'|'cursor'|'token'} type
 * @property {number} [max_pages] - interrompe após N páginas mesmo havendo mais
 * @property {string} [offset_param] - offset_limit: nome do query param de posição
 * @property {string} [limit_param] - offset_limit/cursor: nome do query param de limite
 * @property {number} [limit_value] - offset_limit/cursor: itens por página
 * @property {string} [cursor_param] - cursor: nome do query param onde o cursor é enviado
 * @property {string} [cursor_response_path] - cursor: dot-path do próximo cursor na resposta
 * @property {string} [token_response_path] - token: dot-path do próximo token na resposta
 */

const SAFETY_MAX_PAGES = 10000; // trava contra config malformada que nunca termina

/**
 * Resolve um caminho em dot-notation dentro de um objeto (ex: "meta.cursor").
 * Path vazio/undefined retorna o próprio objeto.
 */
function resolvePath(obj, path) {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/** null, undefined ou string vazia contam como "sem próxima página". */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Monta a URL da próxima requisição a partir de uma base, preservando
 * quaisquer query params já presentes nela.
 */
function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url;
}

/** Erro de página com `.status` igual ao status HTTP da resposta. */
function httpError(status) {
  const err = new Error(`Pagination request failed with status ${status}`);
  err.status = status;
  return err;
}

/**
 * Busca todas as páginas de um endpoint e acumula os itens em um único array.
 *
 * @param {string} baseUrl - URL absoluta do endpoint (pode já conter query params)
 * @param {Object} config
 * @param {string} [config.data_path] - dot-path do array de itens em cada página
 * @param {PaginationConfig|null} [config.pagination] - null = single fetch (sem paginar)
 * @param {RequestInit} [config.requestInit] - repassado ao fetch (headers, etc.)
 * @returns {Promise<any[]>}
 */
async function fetchAllPages(baseUrl, config = {}) {
  const { data_path, pagination, requestInit = {} } = config;

  const items = [];
  let page = 0;
  let params = {};

  if (pagination && pagination.type === 'offset_limit') {
    params = {
      [pagination.offset_param]: 0,
      [pagination.limit_param]: pagination.limit_value,
    };
  } else if (pagination && pagination.type === 'cursor' && pagination.limit_param) {
    params = { [pagination.limit_param]: pagination.limit_value };
  }
  // cursor (sem limit_param) e token: primeira chamada não leva nenhum param de paginação.

  for (;;) {
    const url = buildUrl(baseUrl, params);
    const res = await fetch(url, requestInit);
    if (!res.ok) {
      throw httpError(res.status);
    }
    const body = await res.json();
    const pageItems = resolvePath(body, data_path);
    if (!Array.isArray(pageItems)) {
      throw new Error(
        `data_path "${data_path || ''}" não resolveu para um array na resposta da página`
      );
    }
    items.push(...pageItems);
    page++;

    if (!pagination) break; // comportamento atual: single fetch

    if (pagination.max_pages && page >= pagination.max_pages) break;

    if (pagination.type === 'offset_limit') {
      if (pageItems.length < pagination.limit_value) break; // última página
      const nextOffset = Number(params[pagination.offset_param]) + pagination.limit_value;
      params = {
        [pagination.offset_param]: nextOffset,
        [pagination.limit_param]: pagination.limit_value,
      };
    } else if (pagination.type === 'cursor') {
      const next = resolvePath(body, pagination.cursor_response_path);
      if (isEmpty(next)) break;
      params = { [pagination.cursor_param]: next };
      if (pagination.limit_param) {
        params[pagination.limit_param] = pagination.limit_value;
      }
    } else if (pagination.type === 'token') {
      const next = resolvePath(body, pagination.token_response_path);
      if (isEmpty(next)) break;
      const segments = pagination.token_response_path.split('.');
      const paramName = segments[segments.length - 1];
      params = { [paramName]: next };
    } else {
      throw new Error(`Tipo de paginação desconhecido: ${pagination.type}`);
    }

    if (page >= SAFETY_MAX_PAGES) {
      throw new Error(
        `Limite de segurança de ${SAFETY_MAX_PAGES} páginas excedido — verifique a configuração de paginação (loop sem condição de parada?)`
      );
    }
  }

  return items;
}

module.exports = { fetchAllPages, resolvePath, isEmpty, buildUrl, httpError };
