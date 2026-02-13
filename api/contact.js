export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, email, empresa, cargo, telefono, tipo_consulta, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const tipoLabels = {
    demo: 'Agendar Demo',
    consulta: 'Consulta General',
    partner: 'Programa de Partners',
    soporte: 'Soporte Técnico',
    otro: 'Otro'
  };

  const tipoLabel = tipoLabels[tipo_consulta] || tipo_consulta || 'Sin especificar';

  const html = `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;color:#0F112A;">
      <div style="background:#0F112A;padding:32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#E4E6F3;font-size:20px;font-weight:600;margin:0;">Nueva consulta desde novanexus.cl</h1>
        <p style="color:rgba(228,230,243,0.6);font-size:14px;margin:8px 0 0;">${tipoLabel}</p>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #E5E5E5;border-top:none;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;width:140px;font-size:14px;">Nombre</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;font-size:14px;">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;"><a href="mailto:${email}" style="color:#2B40F5;">${email}</a></td>
          </tr>
          ${empresa ? `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;font-size:14px;">Empresa</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;">${empresa}</td>
          </tr>` : ''}
          ${cargo ? `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;font-size:14px;">Cargo</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;">${cargo}</td>
          </tr>` : ''}
          ${telefono ? `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;font-size:14px;">Teléfono</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;">${telefono}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;color:#0F112A;font-weight:600;font-size:14px;">Tipo</td>
            <td style="padding:12px 0;border-bottom:1px solid #E5E5E5;font-size:14px;">${tipoLabel}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#F5F5F7;border-radius:8px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#2B40F5;">Mensaje</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#0F112A;white-space:pre-wrap;">${mensaje}</p>
        </div>
        <p style="margin:24px 0 0;font-size:12px;color:rgba(15,17,42,0.4);">Puedes responder directamente a este email para contactar a ${nombre}.</p>
      </div>
    </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Nova Nexus <novanexus@mail.displace.agency>',
        to: [
          'rodrigolobo1959@gmail.com',
          'fdo.decastro@gmail.com',
          'hello@displace.agency'
        ],
        reply_to: email,
        subject: `Nueva consulta — ${tipoLabel} — ${nombre}`,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Error al enviar el mensaje' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
