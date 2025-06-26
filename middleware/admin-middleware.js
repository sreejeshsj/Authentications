
const adminMiddlerware=(req,res,next)=>{
    const role=req.userinfo.role
    if (role=="admin"){
        next()
    }else{
        res.status(400).json("Only admin can allowed")

    }
    
}

module.exports=adminMiddlerware