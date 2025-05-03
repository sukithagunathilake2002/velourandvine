const nodemailer = require("nodemailer");

// ✅ Debug logging to confirm .env is loaded
console.log("📦 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📦 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ MISSING");
const transporter = nodemailer.createTransport({
  service: "gmail", // use Mailtrap, SendGrid or Amazon SES in production
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendStatusUpdateEmail = async (to, name, status, reservation) => {
  const mailOptions = {
    from: `"Velour & Vine" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Reservation Status Has Been Updated",
    html: `
      <p>Dear ${name},</p>
      <p>Your reservation has been <strong>${status.toUpperCase()}</strong>.</p>
      <ul>
        <li><strong>Date:</strong> ${reservation.date}</li>
        <li><strong>Time:</strong> ${reservation.timeSlot}</li>
        <li><strong>Table Number:</strong> ${reservation.tableId?.number || "N/A"}</li>
      </ul>
      <p>Thank you for choosing Velour & Vine.</p>
      <p style="margin-top: 10px; color: #D4AF37;">- The Velour & Vine Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};
