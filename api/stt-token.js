export const config = { runtime: 'edge' };

// Issues a short-lived Deepgram token so the browser can open
// a WebSocket directly to Deepgram without exposing the master key.
export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const res = await fetch('https://api.deepgram.com/v1/auth/grant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
      body: JSON.stringify({
        ttl_seconds: 30,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Deepgram token error:', err);
      return new Response(JSON.stringify({ error: err }), {
        status: res.status, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const data = await res.json();
    // Deepgram may return { key: "..." } or { access_token: "..." }
    const token = data.key || data.access_token;
    if (!token) {
      console.error('Deepgram token response missing key:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'No token in response', raw: data }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
    return new Response(JSON.stringify({ key: token }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
}
