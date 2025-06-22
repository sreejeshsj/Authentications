require('dotenv').config()
const express = require('express')
const toconnectDB=require('./database/db')
const app=express()

const port = process.env.PORT || 3000

//connecting database
toconnectDB()

//middleware
app.use(express.json())


app.listen(port,()=>{
    console.log("Server Started on Port:",port)
})