import express, { Request, Response } from 'express';
import { subscribeToNewsletter, updateProfile, getSubscribers } from '../controllers/newsletterController';

const router = express.Router();


// Fix: Ensure only handler functions are passed, not sub-applications
router.post('/subscribe', (req, res, next) => {
  Promise.resolve(subscribeToNewsletter(req, res)).catch(next);
});
router.post('/update-profile', (req, res, next) => {
  Promise.resolve(updateProfile(req, res)).catch(next);
});
router.get('/subscribers', (req, res, next) => {
  Promise.resolve(getSubscribers(req, res)).catch(next);
});

export default router;
