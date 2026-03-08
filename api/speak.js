export const config = { runtime: 'edge' };

// eleven_flash_v2_5 — fastest ElevenLabs model, ~75ms latency
const PRIMARY_VOICE_ID  = 'Zv7P8CISODgj9wDHyyI9'; // custom voice
const FALLBACK_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah — warm natural

async function tts(voiceId, text, apiKey) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      text,
      model_id: 'eleven_flash_v2_5',
      voice_settings: {
        stability: 0.40,
        similarity_boost: 0.80,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }});
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { text } = await req.json();
    if (!text?.trim()) return new Response(JSON.stringify({ error: 'No text' }), { status: 400 });

    const apiKey = process.env.ELEVENLABS_API_KEY;
    let res = await tts(PRIMARY_VOICE_ID, text, apiKey);

    if (!res.ok) {
      console.warn(`Primary voice (${res.status}) — fallback`);
      res = await tts(FALLBACK_VOICE_ID, text, apiKey);
    }

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(res.body, {
      headers: { 'Content-Type': 'audio/mpeg', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
