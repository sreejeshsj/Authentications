const express=require('express')
const router = express.Router()
const adminMiddlerware=require('../middleware/admin-middleware')
const authMiddleware=require('../middleware/auth-middleware')

router.get('/welcome',authMiddleware,adminMiddlerware,(req,res)=>{
    res.json({
        message:"Welcome to admin page"
    })
})

module.exports=router