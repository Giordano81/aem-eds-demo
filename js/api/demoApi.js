// js/api/demoApi.js
// Script per demo chiamate JWT, access token e coupon

const runDemoApi = async function runDemoApi() {
  const CDC_API_KEY = "4_VNEH55LEIvCyfNLs0A4P8g";
  const CDC_USER_KEY = "APvwVy2bbm2k";
  const CDC_SECRET = "2lXdEZ+qQsZxnpPCukUMLMeZQQzas5j0";
  const CDC_UID = "a922e1287b1946feb4a7ac9ab4783aaa";

  const SAP_CLIENT_ID = "gigya_aem";
  const SAP_CLIENT_SECRET = "8kta4Z2813Yp";
  const BASE_SITE = "u2";

  const output = {
    jwt: document.querySelector("#output-jwt p"),
    token: document.querySelector("#output-access-token p"),
    coupon: document.querySelector("#output-coupon p"),
  };

  try {
    // Step 1: get JWT
    const jwtForm = new URLSearchParams();
    jwtForm.append("apiKey", CDC_API_KEY);
    jwtForm.append("userKey", CDC_USER_KEY);
    jwtForm.append("secret", CDC_SECRET);
    jwtForm.append("targetUID", CDC_UID);
    jwtForm.append("expiration", "3600");

    const jwtRes = await fetch("https://accounts.eu1.gigya.com/accounts.getJWT", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: jwtForm,
    });
    const jwtData = await jwtRes.json();

    if (!jwtData.id_token) throw new Error("JWT non ricevuto");
    output.jwt.textContent = jwtData.id_token;

    // Step 2: get access token
    const tokenForm = new URLSearchParams();
    tokenForm.append("client_id", SAP_CLIENT_ID);
    tokenForm.append("client_secret", SAP_CLIENT_SECRET);
    tokenForm.append("scope", "gigya_oauth");
    tokenForm.append("grant_type", "custom");
    tokenForm.append("UID", CDC_UID);
    tokenForm.append("idToken", jwtData.id_token);
    tokenForm.append("baseSite", BASE_SITE);
    tokenForm.append("language", "it");
    tokenForm.append("currency", "EUR");

    const tokenRes = await fetch(
      "https://stagingapi-u2spesaonline.unes.it/authorizationserver/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenForm,
      }
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) throw new Error("Access token non ricevuto");
    output.token.textContent = tokenData.access_token;

    // Step 3: get coupons
    const couponRes = await fetch(
      "https://stagingapi-u2spesaonline.unes.it/rest/v2/u2/users/current/coupons?filtered=false",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );
    const couponData = await couponRes.json();
    output.coupon.textContent = JSON.stringify(couponData, null, 2);
  } catch (err) {
    output.jwt.textContent = "";
    output.token.textContent = "";
    output.coupon.textContent = "";
    output.jwt.insertAdjacentHTML(
      "afterend",
      `<span style='color:red'>Errore: ${err.message}</span>`
    );
  }
};
runDemoApi();
