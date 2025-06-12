/**
 * Questo file permette di estendere il comportamento del blocco
 * header senza toccare il file originale header.js.
 *
 * - Hai accesso diretto al DOM del blocco tramite il parametro `block`.
 * - Puoi aggiungere, modificare o rimuovere elementi, gestire eventi, fare chiamate API, ecc.
 * - Puoi interagire con dati provenienti da AEM (es: fetch verso endpoint AEM,
 *   manipolazione di contenuti dinamici, ecc.).
 * - Il codice custom viene eseguito dopo quello di header.js,
 *   quindi puoi estendere o sovrascrivere comportamenti senza conflitti.
 *
 * In pratica: è come “toccare” il file JS del blocco, ma in modo separato, sicuro e aggiornabile,
 * senza rischiare conflitti con aggiornamenti futuri del core.
 *
 * Esempi:
 *   // Aggiungere un bottone custom:
 *   const btn = document.createElement('button');
 *   btn.textContent = 'Cliccami!';
 *   btn.onclick = () => alert('Hai cliccato il bottone custom!');
 *   block.appendChild(btn);
 *
 *   // Modificare il testo di un elemento:
 *   const title = block.querySelector('h1');
 *   if (title) title.textContent = 'Nuovo titolo dinamico!';
 *
 *   // Comunicare con AEM:
 *   const resp = await fetch('/api/product.js');
 *   const data = await resp.json();
 *   block.innerHTML += `<div>Prodotto: ${data.name}</div>`;
 */

export default function decorate(block) {
  // JS custom solo per il blocco header
  console.log("Header custom JS attivo!", block);
}

// 1.Aggiungere un bottone custom solo nell’header:
// export default function decorate(block) {
//   const btn = document.createElement('button');
//   btn.textContent = 'Cliccami!';
//   btn.onclick = () => alert('Hai cliccato il bottone custom!');
//   block.appendChild(btn);
// }

// 2.Modificare il testo di un elemento solo nell header:
// export default function decorate(block) {
//   const title = block.querySelector('h1');
//   if (title) title.textContent = 'Nuovo titolo dinamico!';
// }

// 3 Aggiungere una classe o uno stile custom:
// export default function decorate(block) {
//   block.classList.add('header-custom-active');
//   block.style.background = 'yellow';
// }

// 4. Comunicare con AEM (es. fetch dati da API AEM):
// export default async function decorate(block) {
//   const resp = await fetch('/api/product.js');
//   const data = await resp.json();
//   // Usa i dati per popolare il blocco header
//   block.innerHTML += `<div>Prodotto: ${data.name}</div>`;
// }
