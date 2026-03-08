export const config = { runtime: 'edge' };

// Creates a short-lived Deepgram API KEY (not JWT token).
// The ['token', key] WebSocket subprotocol only works with API keys.
// JWT access tokens from /v1/auth/grant DON'T work with browser WebSockets.
export default async function handler(req) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    // Get project ID first
    const projRes = await fetch('https://api.deepgram.com/v1/projects', {
      headers: { 'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}` },
    });
    if (!projRes.ok) {
      const err = await projRes.text();
      return new Response(JSON.stringify({ error: 'projects: ' + err }), {
        status: projRes.status, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
    const projData = await projRes.json();
    const projectId = projData.projects?.[0]?.project_id;
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'No project found' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Create a short-lived API key (10s TTL — only needed for WS handshake)
    const keyRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
      body: JSON.stringify({
        comment: 'nova-temp',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 60,
      }),
    });
    if (!keyRes.ok) {
      const err = await keyRes.text();
      return new Response(JSON.stringify({ error: 'key create: ' + err }), {
        status: keyRes.status, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
    const keyData = await keyRes.json();
    return new Response(JSON.stringify({ key: keyData.key }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
}
