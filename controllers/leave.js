require("dotenv").config();
const Profile = require("../model/Profile");
const Admins = require("../model/Admin");
const Leave = require("../model/Leave");
const nodemailer = require("nodemailer");

const takeLeave = async (req, res) => {
  const userId = req.user.userId;
  const email = req.user.email;
  const squad = req.body.squad;
  const leaveType = req.body.leaveType;
  const leaveStart = req.body.leaveStart;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const leaveDetail = req.body.leaveDetail;
  const sendEmail = req.body.sendEmail;

  console.log({
    userId,
    email,
    squad,
    leaveType,
    leaveStart,
    fromDate,
    toDate,
    leaveDetail,
    emailSent: sendEmail,
  });

  if (!userId) {
    res.status(400).json({ msg: "You aren't logged in" });
  }
  const appliedByUser = await Profile.findOne({
    profileOf: userId,
  });
  if (!appliedByUser) {
    return res
      .status(404)
      .json({ msg: "Profile not found, you sure you made one?" });
  }

  let totalLeaveRemaining = appliedByUser.LeavesRemaining;

  if (totalLeaveRemaining > 0) {
    let appliersTeam = appliedByUser.team;

    const appliersTeammates = await Profile.find(
      { team: appliersTeam },
      "email"
    );

    console.log(appliersTeammates);

    let teammateEmails = [];
    appliersTeammates.forEach((teammate) => {
      if (teammate.email != req.user.email) {
        return teammateEmails.push(teammate.email);
      }
    });

    ////////----------------------------/*///////////////

    let ccEmails = [req.body.to];
    messageReceivers = teammateEmails.concat(ccEmails);

    const leave = await Leave.create({
      userId,
      email,
      squad,
      leaveType,
      leaveStart,
      fromDate,
      toDate,
      leaveDetail,
      emailSent: sendEmail,
    });

    await Profile.findOneAndUpdate(
      { email: email },
      { LeavesRemaining: Number(totalLeaveRemaining - 1) }
    );

    ///updateOne garda 1st ma bhako ko hatdo raixa
    //use findOneAndUpdate.

    //////////--------------------///////////////
    if (sendEmail) {
      let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      let mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: messageReceivers,
        subject: `${leaveStart}:${leaveType} Leave from ${new Date(
          fromDate
        )} to ${Date(toDate)} `,
        text: leaveDetail,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent :" + info.response);
        }
      });
      res.status(200).json({ msg: "Leave Email Sent with success" });
    } else {
      res.status(200).json({ msg: "Leave taken successfully." });
    }
  } else {
    res.status(400).send(`You've already used all your leaves`);
  }
};

const getRemainingLeaves = async (req, res) => {
  const requestor = req.user.email;

  const validRequest = await Profile.findOne({ email: requestor });

  if (!validRequest) {
    return res.status(500).send("something went wrong. Try again");
  }

  const LeaveRemaining = validRequest.LeavesRemaining;

  res
    .status(200)
    .json({ msg: `your remaining leaves are ${LeaveRemaining} days` });
};

const viewMyLeaveDetails = async (req, res) => {
  const myLeaves = await Leave.find({ leaveTakenBy: req.user.email });

  if (!myLeaves) {
    return res.status(400).send("You have not taken any leaves yet");
  }

  res.status(200).json({ myLeaves, count: myLeaves.length });
};

const viewEmployeesLeave = async (req, res) => {
  const ID = req.user.userId;
  const userFound = await Admins.findOne({ userID: ID });

  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  }

  const employeesLevaeDetails = await Leave.find({
    leaveTakenBy: req.body.email,
  });
  if (!employeesLevaeDetails) {
    return res.status(400).send("The employee has not taken any leaves yet");
  }
  res
    .status(200)
    .json({ employeesLevaeDetails, count: employeesLevaeDetails.length });
};
module.exports = {
  takeLeave,
  getRemainingLeaves,
  viewMyLeaveDetails,
  viewEmployeesLeave,
};
