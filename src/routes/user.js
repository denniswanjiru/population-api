import express from 'express';

import UserController from '../controllers/user';
import UserValidator from '../middlewares/userValidator';

const router = express.Router();

router.post(
  '/signup',
  UserValidator.passwordMatch,
  UserValidator.uniqEmail,
  UserController.signup
);

router.post(
  '/signin',
  UserValidator.correctCreds,
  UserController.signin
);

export default router;