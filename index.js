const express = require('express')
const cron = require('node-cron')
const Axios = require('axios');
const mongoose = require('mongoose');
const Scheduler = require('./Model/Date-Time')
const moment = require('moment');
const { $where } = require('./Model/Date-Time');

const app = express();
app.use(express.json());



const url = 'mongodb+srv://gullosheikh:Gullobutt1@cluster0.cani3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: false

})

app.get('/',async(req,res)=>{
    
 cron.schedule("*/1 * * * *",async()=>{

    const schedule = await Scheduler.findOne({
        $and:[{"date":moment(Date.now()).format('L')},{"time":{$eq:moment(Date.now()).format('LT').toString()}},{"status":"pending"}]
    })
   // date:moment(Date.now()).format('L'),
   //time:moment().format('LT').toString()}


    if(schedule){
        console.log("It worked")
        console.log(moment(Date.now()).format('LT').toString())
       
        const updateStatus = await Scheduler.findByIdAndUpdate(schedule._id, {status:"complete"},{new:true})
        console.log(updateStatus)
        console.log("This is payload");
        console.log(updateStatus.payload[0])
        Axios.post("http://localhost:8000/get-data",updateStatus.payload[0])
        res.send(updateStatus)
    }
 

 })
})

app.post('/date-time',async(req,res)=>{
    try{
        const{Date, Time, Status, payload} = req.body
       

       const newSchedule = Scheduler({
           date:Date,
           time:Time,
           status:Status,
           payload:payload
       })

       console.log(newSchedule)

       const scheduled = await newSchedule.save()
       return res.send(scheduled)
    }
    catch(err){
        res.send(err.message)
    }
})

app.post('/get-data',(req,res)=>{
    console.log("This is data from scheduler API")
    console.log(req.body)
})

app.listen(8000,()=>{
    console.log('App is working working')
})