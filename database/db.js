const mongoose=require('mongoose')
require('dotenv').config()

//connection
const uri=process.env.MONGO_URI
const connectToDB= async ()=>{
    try{
    await  mongoose.connect(uri)
    console.log("Database Connected Successgully")
    }catch(err){
        console.log("Database connection failed:",err)
    }
}
module.exports=connectToDB

