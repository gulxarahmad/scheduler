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
    
 //cron.schedule("*/1 * * * *",async()=>{

   // const schedule = await Scheduler.findOne({date:moment(Date.now()).format('L'), time:moment().format('LT').toString()})

    const schedule = await Scheduler.findOne({
        $where : function(){
        return (this.date ==moment(Date.now()).format('L').toString())
    }
    }) 
    console.log("It worked")
    console.log(moment().format('LT').toString())
    console.log(schedule)
    res.send(schedule)
 

// })
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