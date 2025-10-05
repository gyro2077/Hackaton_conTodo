import express from 'express';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();
const controller = new AuthController();

// Login
router.post('/login', (req, res) => controller.login(req, res));

export default router;
