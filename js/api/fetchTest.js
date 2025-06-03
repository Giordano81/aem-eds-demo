// api/test.js
// Esempio di chiamata FETCH API di test
console.log('FETCH/GET api test.js caricato!');

function runApiFetchTest() {
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((response) => response.json())
    .then((data) => {
      console.log('Risposta FETCH API di test:', data);
      document.body.insertAdjacentHTML('beforeend', `<pre>${JSON.stringify(data, null, 2)}</pre>`);
    })
    .catch((error) => {
      console.error('Errore chiamata API di test:', error);
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runApiFetchTest);
} else {
  runApiFetchTest();
}
// Caricamento dinamico di test.js per debug
