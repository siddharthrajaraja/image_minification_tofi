const express=require('express')
const app=new express()
const dotenv=require('dotenv').config()
const cors=require('cors')
const bodyParser=require('body-parser')
require('./rabbitMQ/producer')
const jsonParser=bodyParser.json()


app.use(cors())
app.use(bodyParser.json())

var {producer}=require('./rabbitMQ/producer')

app.post('/postRMQ',jsonParser,async(req,res)=>{
    console.log("Result :",producer(req.body))
    
    res.json({flag:"OK"})

});




app.listen(7000 || process.env.PORT ,()=>{
    console.log(`Running WORKER RMQ AT ${process.env.PORT} for IMAGE MINIFICATION!!`)
})