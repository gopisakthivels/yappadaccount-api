// utils/email.js
import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      'Email is not configured. Set SMTP_USER/SMTP_PASSWORD or EMAIL_USER/EMAIL_PASS in yappadaccount-api/.env, then restart the backend.'
    );
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });

  return transporter;
}

const sendInviteEmail = async (email, name, inviteUrl) => {
  try {
    const from = process.env.SMTP_FROM || process.env.EMAIL_USER || 'noreply@yapproom.com';
    await getTransporter().sendMail({
      from,
      to: email,
      subject: "You're invited to join our YappRoom Advertiser platform",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome${name ? `, ${name}` : ''}!</h1>
            <p>You've been invited to join our YappRoom Advertiser platform.</p>
            <p>Click the button below to set your password and activate your account:</p>
            <a href="${inviteUrl}" class="button text-white">Set Your Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${inviteUrl}</p>
            <div class="footer">
              <p>This link will expire in 7 days.</p>
              <p>If you didn't expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Invite email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { sendInviteEmail };