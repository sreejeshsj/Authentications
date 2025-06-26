const express=require('express')
const {registerUser,loginUser,changePassword} =require('../controllers/auth-controller')
const authMiddlerware=require('../middleware/auth-middleware')
const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/change-password',authMiddlerware,changePassword)

module.exports=router