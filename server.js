require('dotenv').config()
const express = require('express')
const toconnectDB=require('./database/db')
const authRouter=require('./routes/auth-route')

const app=express()

const port = process.env.PORT || 3000

//connecting database
toconnectDB()

//middleware
app.use(express.json())

//router
app.use('/api/auth',authRouter)

app.listen(port,()=>{
    console.log("Server Started on Port:",port)
})