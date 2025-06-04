// mock-api.js
const http = require('http');
const url = require('url');
// Mock API server per test locali
// Questo server mock risponde a richieste per /api/product.js con dati fittizi
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/api/product.js') {
    const { sku } = parsedUrl.query;
    if (!sku) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'SKU mancante' }));
      return;
    }
    // Risposta mock
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      id: sku,
      name: `Prodotto mock ${sku}`,
      price: 99.99,
      description: 'Questo è un prodotto mockato per test locali.',
    }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(3001, () => {
  console.log('Mock API server running on http://localhost:3001');
});
