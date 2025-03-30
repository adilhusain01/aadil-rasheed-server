const express = require('express');
const {
  createSubscription,
  getSubscriptions,
  unsubscribe,
  deleteSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

router
  .route('/')
  .get(getSubscriptions)
  .post(createSubscription);

router
  .route('/unsubscribe')
  .put(unsubscribe);

router
  .route('/:id')
  .delete(deleteSubscription);

module.exports = router;
