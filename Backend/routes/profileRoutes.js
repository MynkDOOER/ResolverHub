import express from 'express'
import { changePassword, getMe, updateProfile } from '../controllers/profileController.js';
import protect from '../middlewares/authMiddleware.js'

const routes = express.Router();

routes.get('/me', protect, getMe);
routes.put('/update', protect, updateProfile)
routes.put('/change-password', protect, changePassword)

export default routes