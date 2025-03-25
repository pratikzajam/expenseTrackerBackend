import express from 'express';
import  {Auth}  from '../Middleware/middleware.js';
import { Register,verifyOtp,Login,addTransaction,deleteTransaction,updateTransaction,getTransactionByUserid,getStatisticsByid,getuserDeatilsByid } from '../controllers/controller.js';
const router = express.Router();



router.post('/register',Auth,Register);
router.post('/verify',verifyOtp);
router.post('/Login',Login);
router.post('/addtransaction',addTransaction);
router.post('/gettransaction',getTransactionByUserid);
router.post('/getstatistics',getStatisticsByid);
router.post('/getuserdetailsbyid',getuserDeatilsByid);
router.post('/deleteTransaction',deleteTransaction);
router.post('/updateTransaction',updateTransaction);


export default router;