const mongoose = require('mongoose');

const Schedule = new mongoose.Schema({

    date:{
        type:String,
    },
    time:{
        type:String
    },
    status:{
        type:String
    },
    payload:[]

})

module.exports = Scheduler = mongoose.model('schedulers', Schedule)