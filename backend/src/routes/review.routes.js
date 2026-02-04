import express from 'express';
import {
  getAllAdminReviews,
  deleteReviewById
} from '../controllers/review.controller.js';

const router = express.Router();

/* ADMIN – GET ALL REVIEWS */
router.get('/admin/reviews', getAllAdminReviews);

/* ADMIN – DELETE REVIEW */
router.delete('/admin/reviews/:id', deleteReviewById);

export default router;
