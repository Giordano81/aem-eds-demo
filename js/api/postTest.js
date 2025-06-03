// api/postTest.js
// Esempio di chiamata POST API
console.log('POST api test.js caricato!');

function runApiPostTest() {
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Risposta POST API di test:', data);
      document.body.insertAdjacentHTML('beforeend', `<pre>${JSON.stringify(data, null, 2)}</pre>`);
    })
    .catch((error) => {
      console.error('Errore chiamata POST API di test:', error);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runApiPostTest);
} else {
  runApiPostTest();
}
// Caricamento dinamico di postTest.js per debug
