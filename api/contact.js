export const config = { runtime: 'edge' };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── helpers ──────────────────────────────────────────────────────────────────

async function sendEmail({ name, email, phone, message, requirement, source }) {
  const subject =
    source === 'NOVA Chatbot'
      ? `🤖 New Lead from NOVA Chat: ${name}`
      : `📬 New Contact Form Submission: ${name}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e0e0e0;border:1px solid #00ffcc22;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#002b1c,#00ffcc);padding:24px 32px;">
        <h1 style="margin:0;color:#000;font-size:20px;letter-spacing:2px;">CLAUDETER — NEW LEAD</h1>
        <p style="margin:4px 0 0;color:#000;font-size:12px;opacity:0.7;letter-spacing:1px;">${source}</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#00ffcc;font-size:12px;letter-spacing:1px;width:130px;">NAME</td><td style="padding:10px 0;color:#fff;font-size:15px;">${name || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#00ffcc;font-size:12px;letter-spacing:1px;">EMAIL</td><td style="padding:10px 0;"><a href="mailto:${email}" style="color:#00ffcc;">${email || '—'}</a></td></tr>
          ${phone ? `<tr><td style="padding:10px 0;color:#00ffcc;font-size:12px;letter-spacing:1px;">PHONE</td><td style="padding:10px 0;color:#fff;">${phone}</td></tr>` : ''}
          ${(message || requirement) ? `<tr><td style="padding:10px 0;color:#00ffcc;font-size:12px;letter-spacing:1px;vertical-align:top;">MESSAGE</td><td style="padding:10px 0;color:#ccc;line-height:1.6;">${message || requirement}</td></tr>` : ''}
        </table>
        <div style="margin-top:24px;padding:16px;background:#0f1a14;border-left:3px solid #00ffcc;border-radius:4px;">
          <p style="margin:0;color:#00ffcc88;font-size:11px;letter-spacing:1px;">RECEIVED AT</p>
          <p style="margin:4px 0 0;color:#aaa;font-size:13px;">${new Date().toUTCString()}</p>
        </div>
      </div>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'NOVA <leads@claudeter.ai>',
      to: [process.env.LEAD_EMAIL || 'nova@claudeter.ai'],
      subject,
      html,
      reply_to: email,
    }),
  });

  return res;
}

async function logToGoogleSheets({ name, email, phone, message, requirement, source }) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) return; // silently skip if not configured yet

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      source,
      name: name || '',
      email: email || '',
      phone: phone || '',
      message: message || requirement || '',
    }),
  });
}

// ── handler ───────────────────────────────────────────────────────────────────

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const body = await req.json();
    const { name, email, phone, message, requirement, source = 'Contact Form' } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Fire both in parallel — don't let Sheets failure block the email
    const [emailRes] = await Promise.allSettled([
      sendEmail({ name, email, phone, message, requirement, source }),
      logToGoogleSheets({ name, email, phone, message, requirement, source }),
    ]);

    if (emailRes.status === 'rejected' || (emailRes.value && !emailRes.value.ok)) {
      console.error('Email send failed:', emailRes.reason || await emailRes.value?.text());
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
}
