const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
  markAsRead,
  markAsUnread
} = require('../controllers/contactController');

const router = express.Router();

router
  .route('/')
  .get(protect, getContacts)
  .post(createContact);

router
  .route('/:id')
  .get(protect, getContactById)
  .delete(protect, deleteContact);

// Routes for marking messages as read/unread
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id/unread').put(protect, markAsUnread);

module.exports = router;
