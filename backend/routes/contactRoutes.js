const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createMessage);
router.get('/', contactController.getMessages);
router.put('/:id', contactController.updateMessage);
router.delete('/:id', contactController.deleteMessage);

module.exports = router;
