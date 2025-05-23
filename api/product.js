export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const sku = searchParams.get("sku");

  if (!sku) {
    return new Response(JSON.stringify({ error: "SKU mancante" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const sapResponse = await fetch(`https://dummyjson.com/products/${sku}`, {
      headers: {
        
        Accept: "application/json"
      }
    });

    if (!sapResponse.ok) {
      return new Response(JSON.stringify({ error: "Errore da SAP API" }), {
        status: sapResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const product = await sapResponse.json();
    return new Response(JSON.stringify(product), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: "Errore interno", details: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
