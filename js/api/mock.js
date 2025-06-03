// Test chiamata mock API prodotto
console.log('MOCK api test.js caricato!');
fetch('/api/product.js?sku=1')
  .then((r) => r.json())
  .then((data) => console.log('Risposta da /api/product.js:', data));
