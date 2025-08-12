// api/send-email.js
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const emailData = {
      from: 'Keyskeeper Website <noreply@keyskeeper.co.nz>',
      to: ['contact@keyskeeper.co.nz'],
      subject: 'New Early Access Signup - Keyskeeper',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🔑 New Early Access Signup</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone just signed up for Keyskeeper updates!</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Contact Details</h2>
              <p style="margin: 8px 0; color: #475569;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>Signed up:</strong> ${new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })}</p>
            </div>
          </div>
        </div>
      `
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for signing up! We\'ll keep you updated on our launch.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}