// functions/submitForm.js

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const API_URL = process.env.INGESTION_ENDPOINT;
  const API_KEY = process.env.INGESTION_API_KEY;

  try {
    // use the built-in fetch, no imports needed
    const apiResp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!apiResp.ok) {
      const text = await apiResp.text();
      console.error("Upstream error:", text);
      return { statusCode: 502, body: "Upstream error" };
    }

    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal error" };
  }
};
