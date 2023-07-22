const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

//POST /tours/23fad4/reviews
//POST /reviews
//GET /tours/23fad4/reviews
//GET /tours/23fad4/reviews/92367f

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
