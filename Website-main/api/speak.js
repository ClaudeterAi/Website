export const config = { runtime: 'edge' };

// Primary: your custom voice from ElevenLabs library
// To activate it: elevenlabs.io/app/voice-library?voiceId=Zv7P8CISODgj9wDHyyI9 → click "Add to My Voices"
// Fallback: "Adam" — deep authoritative male, available on all ElevenLabs accounts
const PRIMARY_VOICE_ID = 'Zv7P8CISODgj9wDHyyI9';
const FALLBACK_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam

async function generateSpeech(voiceId, text, apiKey) {
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
    }),
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { text } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Try primary voice first
    let ttsRes = await generateSpeech(PRIMARY_VOICE_ID, text, apiKey);

    // If primary fails (voice not added to account yet), fall back to Adam
    if (!ttsRes.ok) {
      const errText = await ttsRes.text();
      console.warn(`Primary voice failed (${ttsRes.status}): ${errText} — using fallback`);
      ttsRes = await generateSpeech(FALLBACK_VOICE_ID, text, apiKey);
    }

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      return new Response(JSON.stringify({ error: err }), {
        status: ttsRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(ttsRes.body, {
      headers: { 'Content-Type': 'audio/mpeg', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
