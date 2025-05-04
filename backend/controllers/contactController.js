const ContactMessage = require('../models/ContactMessage');
const {
  sendUserConfirmationEmail,
  sendAdminReplyEmail
} = require('../utils/mailer'); // ✅ Import both email functions

// CREATE
exports.createMessage = async (req, res) => {
  try {
    const newMessage = new ContactMessage(req.body);
    const saved = await newMessage.save();

    // ✅ Send confirmation email to the user
    await sendUserConfirmationEmail(saved.email, saved.name);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE (Used for reply by admin)
exports.updateMessage = async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // ✅ Send reply email if `reply` is provided
    if (req.body.reply && updated.email) {
      await sendAdminReplyEmail(updated.email, updated.name, req.body.reply);
    }

    res.json(updated);
  } catch (err) {
    console.error("Failed to send reply email:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
