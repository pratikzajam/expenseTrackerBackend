import express from 'express';
import  {Auth}  from '../Middleware/middleware.js';
import { Register,verifyOtp,Login } from '../controllers/controller.js';
const router = express.Router();



router.post('/register',Auth,Register);
router.post('/verify',verifyOtp);
router.post('/Login',Login);

export default router;