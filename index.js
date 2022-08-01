require('dotenv').config()
const ps=require('./queries')
const express = require('express')
const bodyParser = require('body-parser')
const app=express()
const port=5030
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',(req, res) => {res.json({info:'htools-db reporting'})})
// app.get('/',(req, res) => {res.send("Hii ni hujuma")})
app.get('/sensordata',ps.getSensorData)
app.get('/nodesensorids',ps.getNodeSensorIds)
app.listen(port,()=>{console.log(`listening on port ${port}`)})
