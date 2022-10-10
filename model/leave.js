const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    leaveTakenBy:{
        type:String,
        required:[true,'Please enter your email']
    },
    to:{
        type:Array
    },
    subject:{
        type:String,
        default:"About taking a day off."
    },
    text:{
        type:String,
        default:"I will not be able to come to work today. Sorry for the inconvenience"
    }
},
{timestamps:true}
)

module.exports = mongoose.model("leave", LeaveSchema);