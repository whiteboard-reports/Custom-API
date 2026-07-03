const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchAllPages, resolvePath, buildUrl } = require('../src/lib/paginatedFetch');

const originalFetch = global.fetch;

test.afterEach(() => {
  global.fetch = originalFetch;
});

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test('offset_limit: acumula páginas até encontrar página menor que limit_value', async () => {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url.searchParams.toString());
    const offset = Number(url.searchParams.get('start'));
    const pages = { 0: [1, 2, 3], 3: [4, 5, 6], 6: [7] }; // última página parcial
    return jsonResponse(200, { data: pages[offset] || [] });
  };

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'data',
    pagination: { type: 'offset_limit', offset_param: 'start', limit_param: 'maxResults', limit_value: 3 },
  });

  assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(calls.length, 3);
  assert.match(calls[0], /start=0/);
  assert.match(calls[0], /maxResults=3/);
  assert.match(calls[1], /start=3/);
  assert.match(calls[2], /start=6/);
});

test('offset_limit: respeita max_pages mesmo havendo mais páginas', async () => {
  global.fetch = async (url) => {
    const offset = Number(url.searchParams.get('start'));
    return jsonResponse(200, { data: [offset, offset + 1, offset + 2] }); // nunca teria fim sozinho
  };

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'data',
    pagination: { type: 'offset_limit', offset_param: 'start', limit_param: 'limit', limit_value: 3, max_pages: 2 },
  });

  assert.equal(result.length, 6);
});

test('cursor: segue o cursor da resposta e para quando vier vazio', async () => {
  let calls = 0;
  global.fetch = async (url) => {
    calls++;
    const cursor = url.searchParams.get('after');
    if (!cursor) return jsonResponse(200, { items: [1, 2], next: 'abc' });
    if (cursor === 'abc') return jsonResponse(200, { items: [3, 4], next: '' });
    throw new Error('cursor inesperado: ' + cursor);
  };

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'items',
    pagination: { type: 'cursor', cursor_param: 'after', cursor_response_path: 'next' },
  });

  assert.deepEqual(result, [1, 2, 3, 4]);
  assert.equal(calls, 2);
});

test('cursor: suporta path aninhado na resposta e envia limit quando configurado', async () => {
  global.fetch = async (url) => {
    const cursor = url.searchParams.get('cursor');
    assert.equal(url.searchParams.get('limit'), '5');
    if (!cursor) {
      return jsonResponse(200, { meta: { cursor: 'xyz' }, results: { items: [1, 2] } });
    }
    return jsonResponse(200, { meta: { cursor: null }, results: { items: [3] } });
  };

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'results.items',
    pagination: {
      type: 'cursor',
      cursor_param: 'cursor',
      cursor_response_path: 'meta.cursor',
      limit_param: 'limit',
      limit_value: 5,
    },
  });

  assert.deepEqual(result, [1, 2, 3]);
});

test('token: nome do query param é derivado do último segmento do path', async () => {
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url.searchParams.toString());
    const next = url.searchParams.get('next');
    if (!next) return jsonResponse(200, { items: [1, 2], meta: { next: 'tok1' } });
    if (next === 'tok1') return jsonResponse(200, { items: [3], meta: { next: null } });
    throw new Error('token inesperado: ' + next);
  };

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'items',
    pagination: { type: 'token', token_response_path: 'meta.next' },
  });

  assert.deepEqual(result, [1, 2, 3]);
  assert.equal(calls[0], ''); // primeira chamada não envia token
  assert.match(calls[1], /next=tok1/);
});

test('token: para quando token_response_path retorna string vazia', async () => {
  global.fetch = async () => jsonResponse(200, { items: [1], nextPageToken: '' });

  const result = await fetchAllPages('http://example.com/data', {
    data_path: 'items',
    pagination: { type: 'token', token_response_path: 'nextPageToken' },
  });

  assert.deepEqual(result, [1]);
});

test('pagination null: comportamento atual de single fetch', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return jsonResponse(200, [1, 2, 3]);
  };

  const result = await fetchAllPages('http://example.com/data', { pagination: null });

  assert.deepEqual(result, [1, 2, 3]);
  assert.equal(calls, 1);
});

test('lança erro com .status igual ao status HTTP quando a resposta não é ok', async () => {
  global.fetch = async () => jsonResponse(404, { error: 'not found' });

  await assert.rejects(
    () => fetchAllPages('http://example.com/data', { pagination: null }),
    (err) => {
      assert.equal(err.status, 404);
      return true;
    }
  );
});

test('propaga erro de página intermediária durante paginação', async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    if (calls === 1) return jsonResponse(200, { data: [1, 2, 3] });
    return jsonResponse(500, { error: 'boom' });
  };

  await assert.rejects(
    () =>
      fetchAllPages('http://example.com/data', {
        data_path: 'data',
        pagination: { type: 'offset_limit', offset_param: 'start', limit_param: 'limit', limit_value: 3 },
      }),
    (err) => {
      assert.equal(err.status, 500);
      return true;
    }
  );
});

test('buildUrl preserva query params já presentes na URL base', () => {
  const url = buildUrl('http://example.com/data?existing=1', { offset: 10 });
  assert.equal(url.searchParams.get('existing'), '1');
  assert.equal(url.searchParams.get('offset'), '10');
});

test('resolvePath resolve dot-notation aninhada', () => {
  assert.equal(resolvePath({ a: { b: { c: 42 } } }, 'a.b.c'), 42);
  assert.equal(resolvePath({ a: { b: {} } }, 'a.b.c'), undefined);
});

test('resolvePath retorna o próprio objeto quando o path é vazio/ausente', () => {
  const arr = [1, 2, 3];
  assert.deepEqual(resolvePath(arr, undefined), arr);
  assert.deepEqual(resolvePath(arr, ''), arr);
});
