const express = require('express')
const cron = require('node-cron')
const Axios = require('axios');
const mongoose = require('mongoose');
const Scheduler = require('./Model/Date-Time')
const moment = require('moment')

const app = express();
app.use(express.json());



const url = 'mongodb+srv://gullosheikh:Gullobutt1@cluster0.cani3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: false

})

app.get('/',(req,res)=>{
    cron.schedule("* * * * * *",()=>{

        console.log(moment(Date.now()).format('L'))
 

})
})

app.post('/date-time',async(req,res)=>{
    try{
        const{Date, Time, Status} = req.body
       

       const newSchedule = Scheduler({
           date:Date,
           time:Time,
           status:Status
       })

       console.log(newSchedule)

       const scheduled = await newSchedule.save()
       return res.send(scheduled)
    }
    catch(err){
        res.send(err.message)
    }
})

app.listen(8000,()=>{
    console.log('App is working working')
})