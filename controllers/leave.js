require('dotenv').config();
const Profile = require("../model/profile");
const Leave = require('../model/leave')
const nodemailer = require('nodemailer');


const getEmails = async (req, res) => {
 

  const appliedBy = req.user.userId ;//req.user.email
 
  if(!appliedBy){
    res.status(400).json({msg:"You aren't logged in"})
  }
  const appliedByUser = await Profile.findOne({
    profileOf: appliedBy,
  });
  if (!appliedByUser) {
    return res.status(404).json({ msg: "You may not be logged in" });
  }
  let appliersTeam = appliedByUser.team;

  const appliersTeammates = await Profile.find({ team: appliersTeam });

  teammateEmails = []

  appliersTeammates.forEach(teammate =>{
    if(teammate.email != req.user.email){
      return teammateEmails.push(teammate.email);
    }
  })

  ////////----------------------------/*///////////////

let ccEmails = [req.body.to]
messageReceivers = teammateEmails.concat(ccEmails);

const requestor = req.user.email;
let leaveOf = req.body.leaveTakenBy
let subject = req.body.subject
let text = req.body.text


if(leaveOf == requestor){
  
await Leave.create({ leaveTakenBy : leaveOf, to : messageReceivers, subject : subject, text : text})
 
}












//////////--------------------///////////////
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user:process.env.GMAIL_EMAIL,
      pass:process.env.GMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from:process.env.GMAIL_EMAIL,
    to:messageReceivers,
    subject:'Sending Email using nodemailer',
    text:"Random try"
  }

  transporter.sendMail(mailOptions, function(err,info){
    if(err){
      console.log(err);
    }else{
      console.log('Email sent :' + info.response);
    }
  });
  res.status(200).json({msg:"Sent email"})

};


module.exports = {getEmails};
