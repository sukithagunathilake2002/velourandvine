const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// ✅ Email to user on form submission
const sendUserConfirmationEmail = async (toEmail, userName) => {
  await transporter.sendMail({
    from: `"Velour & Vine" <${process.env.SMTP_MAIL}>`,
    to: toEmail,
    subject: "Thank you for contacting us",
    html: `
      <p>Dear ${userName},</p>
      <p>Thank you for reaching out to us. Your message has been received.</p>
      <p>We will reply to your query soon.</p>
      <br>
      <p>— Velour & Vine Team</p>
    `
  });
};

// ✅ Email to user when admin replies
const sendAdminReplyEmail = async (toEmail, userName, replyMessage) => {
  await transporter.sendMail({
    from: `"Velour & Vine" <${process.env.SMTP_MAIL}>`,
    to: toEmail,
    subject: "Reply from Velour & Vine",
    html: `
      <p>Dear ${userName},</p>
      <p>We have replied to your inquiry:</p>
      <blockquote style="color: #444; border-left: 4px solid #007BFF; padding-left: 10px;">
        ${replyMessage}
      </blockquote>
      <p>If you have any more questions, feel free to contact us again.</p>
      <br>
      <p>— Velour & Vine Team</p>
    `
  });
};

module.exports = {
  sendUserConfirmationEmail,
  sendAdminReplyEmail
};
