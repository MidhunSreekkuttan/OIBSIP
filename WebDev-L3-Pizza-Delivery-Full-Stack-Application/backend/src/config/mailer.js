import nodemailer from 'nodemailer';

let transporter = null;
let testAccount = null;

export const getMailerTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log(`✉️ [Mailer] Configured SMTP via ${SMTP_HOST}`);
    return transporter;
  }

  // Fallback: Create ethereal test account for local development
  try {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`✉️ [Mailer] Ethereal test mailer initialized (${testAccount.user})`);
  } catch (err) {
    console.warn(`⚠️ [Mailer] Could not create Ethereal account: ${err.message}. Using JSON fallback.`);
    transporter = {
      sendMail: async (options) => {
        console.log('📬 [Simulated Email Log]:', {
          to: options.to,
          subject: options.subject,
          text: options.text,
        });
        return { messageId: 'simulated-' + Date.now(), previewUrl: null };
      },
    };
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailTransporter = await getMailerTransporter();
  const from = `"${process.env.FROM_NAME || 'PizzaCraft'}" <${process.env.FROM_EMAIL || 'no-reply@pizzacraft.com'}>`;

  const mailOptions = {
    from,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  };

  const info = await mailTransporter.sendMail(mailOptions);
  let previewUrl = null;
  if (nodemailer.getTestMessageUrl && info) {
    previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [Mailer Preview URL]: ${previewUrl}`);
    }
  }

  return {
    success: true,
    messageId: info?.messageId,
    previewUrl,
  };
};

