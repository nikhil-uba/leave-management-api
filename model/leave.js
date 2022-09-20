const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    leaveTakenBy:{
        type:String,
        required:[true,'Please specify your profileID']
    },
    from:{
        //it will be mine account for now
        //later we can create account called ubaleavesupport
        type:String
    },
    to:{
        type:String,
    },
    subject:{
        type:String,
        default:"About taking a day off."
    },
    text:{
        type:String,
        required:[true,'Please explain your reason'],
        maxlength:200
    }
},
{timestamps:true}
)

module.exports = mongoose.model("leave", LeaveSchema);