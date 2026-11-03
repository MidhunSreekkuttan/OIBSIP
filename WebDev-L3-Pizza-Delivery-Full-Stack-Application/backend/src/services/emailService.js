import { sendEmail } from '../config/mailer.js';

export const sendVerificationEmail = async (user, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">🍕</span>
        <h1 style="color: #ea580c; margin: 8px 0 0; font-size: 28px;">Welcome to PizzaCraft!</h1>
        <p style="color: #78716c; font-size: 15px;">Handcrafted Artisanal Pizzas Delivered Fresh</p>
      </div>

      <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #ea580c; margin-bottom: 24px;">
        <h2 style="color: #9a3412; margin: 0 0 8px; font-size: 18px;">Hello, ${user.name}!</h2>
        <p style="color: #44403c; line-height: 1.5; margin: 0;">
          Thank you for registering your PizzaCraft account. Please verify your email address to unlock seamless pizza ordering, custom pizza builds, and live tracking.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #ea580c; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Verify My Email Address
        </a>
      </div>

      <p style="color: #78716c; font-size: 13px; line-height: 1.4; margin-bottom: 12px;">
        Or copy and paste this verification URL into your browser:
      </p>
      <p style="background-color: #f5f5f4; padding: 10px; border-radius: 6px; word-break: break-all; font-size: 12px; color: #44403c;">
        ${verificationUrl}
      </p>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e7e5e4; text-align: center; color: #a8a29e; font-size: 12px;">
        This link expires in 24 hours. If you did not create this account, please disregard this email.
      </div>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: '🍕 Verify Your PizzaCraft Account',
    html,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">🔐</span>
        <h1 style="color: #ea580c; margin: 8px 0 0; font-size: 26px;">Password Reset Request</h1>
        <p style="color: #78716c; font-size: 15px;">PizzaCraft Account Security</p>
      </div>

      <p style="color: #44403c; line-height: 1.5; font-size: 15px;">
        Hi <strong>${user.name}</strong>,
      </p>
      <p style="color: #44403c; line-height: 1.5; font-size: 15px;">
        We received a request to reset the password for your PizzaCraft account. Click the button below to set a new password.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #ea580c; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Reset My Password
        </a>
      </div>

      <p style="color: #78716c; font-size: 13px; line-height: 1.4;">
        Direct link: <a href="${resetUrl}" style="color: #ea580c;">${resetUrl}</a>
      </p>

      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e7e5e4; text-align: center; color: #a8a29e; font-size: 12px;">
        This link is valid for 1 hour. If you didn't request this reset, you can safely ignore this email.
      </div>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: '🔑 Reset Your PizzaCraft Password',
    html,
  });
};

export const sendLowStockAlertEmail = async (lowStockItems, adminEmail) => {
  const recipient = adminEmail || process.env.ADMIN_EMAIL || 'admin@pizzacraft.com';

  const rows = lowStockItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #fecdd3;">
        <td style="padding: 12px; font-weight: 600; color: #881337;">${item.name}</td>
        <td style="padding: 12px; text-transform: capitalize; color: #4c0519;">${item.category}</td>
        <td style="padding: 12px; color: #e11d48; font-weight: bold; font-size: 16px;">${item.stockQuantity} ${item.unit || 'units'}</td>
        <td style="padding: 12px; color: #71717a;">${item.threshold}</td>
        <td style="padding: 12px;">
          <span style="background-color: #ffe4e6; color: #e11d48; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
            ${item.stockQuantity === 0 ? 'OUT OF STOCK' : 'CRITICAL LOW'}
          </span>
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #fecdd3; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #fff1f2; padding: 18px 24px; border-radius: 8px; border-left: 5px solid #e11d48; margin-bottom: 24px;">
        <h2 style="color: #9f1239; margin: 0 0 6px; font-size: 22px;">⚠️ Low Stock Inventory Alert</h2>
        <p style="color: #881337; margin: 0; font-size: 14px;">
          Automated PizzaCraft inventory monitor detected <strong>${lowStockItems.length}</strong> ingredient(s) below safety threshold.
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #fdf2f8; border-bottom: 2px solid #fbcfe8;">
            <th style="padding: 10px 12px; color: #831843;">Ingredient</th>
            <th style="padding: 10px 12px; color: #831843;">Category</th>
            <th style="padding: 10px 12px; color: #831843;">Current Stock</th>
            <th style="padding: 10px 12px; color: #831843;">Threshold</th>
            <th style="padding: 10px 12px; color: #831843;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/inventory" style="background-color: #e11d48; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
          Open Admin Inventory Manager
        </a>
      </div>

      <div style="border-top: 1px solid #fecdd3; padding-top: 16px; color: #71717a; font-size: 12px; text-align: center;">
        Sent automatically by PizzaCraft Inventory Monitoring Service at ${new Date().toLocaleString()}
      </div>
    </div>
  `;

  return await sendEmail({
    to: recipient,
    subject: `🚨 Urgent: PizzaCraft Inventory Alert (${lowStockItems.length} items low in stock)`,
    html,
  });
};

