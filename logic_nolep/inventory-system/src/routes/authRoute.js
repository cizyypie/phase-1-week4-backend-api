import express from 'express';
import validate from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import { authValidation } from '../validations/index.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', auth(), authController.logout);

export default router;
