require("dotenv").config();
const User = require("../model/User");
const Leave = require("../model/Leave");
const nodemailer = require("nodemailer");

const getLeaves = async (req, res) => {
  const {
    filter = {},
    offset = 0,
    limit = null,
    projection = "",
    sort = { updatedAt: -1 },
    populate = "userId",
    projPopulate = "",
    inverse = false,
  } = req.body.config;
  const leaves = await Leave.find(filter)
    .populate({ path: populate, select: `-password ${projPopulate}` })
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .select(projection);

  if (!leaves) {
    return res.status(404).json({ msg: "No Leaves match was found" });
  }
  res.status(200).json({ leaves: leaves });
};

const takeLeave = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const userId = req.user.userId;
  const email = req.user.email;
  const squad = data.squad;
  const leaveType = data.leaveType;
  const leaveStart = data.leaveStart;
  const fromDate = data.fromDate;
  const toDate = data.toDate;
  const leaveDetail = data.leaveDetail;
  const sendEmail = data.sendEmail;
  let attachment = data.attachment;
  const files = req.files;

  if (files) {
    attachment = files.map((file) => ({ filepath: file.path }));
  }

  if (!userId) {
    res.status(400).json({ msg: "You aren't logged in" });
  }
  const appliedByUser = await User.findOne({
    _id: userId,
  });
  if (!appliedByUser.hasProfile) {
    return res
      .status(404)
      .json({ msg: "Profile not found, you sure you made one?" });
  }

  let totalLeavesRemaining = appliedByUser.leavesRemaining;
  let totalLeavesTaken = appliedByUser.leavesTaken;

  if (totalLeavesRemaining > 0) {
    let applierSquad = appliedByUser.squad;

    const applierSquadMates = await User.find({ squad: applierSquad }, "email");

    let squadMateEmails = [];
    applierSquadMates.forEach((squadMate) => {
      if (squadMate.email != req.user.email) {
        return squadMateEmails.push(squadMate.email);
      }
    });

    ////////----------------------------/*///////////////

    let ccEmails = [req.body.to];
    messageReceivers = squadMateEmails.concat(ccEmails);

    const leave = await Leave.create({
      userId,
      squad,
      leaveType,
      leaveStart,
      fromDate,
      toDate,
      leaveDetail,
      sendEmail,
      attachment,
    });

    await User.findOneAndUpdate(
      { email: email },
      {
        leavesRemaining: Number(totalLeavesRemaining - 1),
        leavesTaken: Number(totalLeavesTaken + 1),
      },
      {
        new: true,
      }
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

  const validRequest = await User.findOne({ email: requestor });

  if (!validRequest) {
    return res.status(500).send("something went wrong. Try again");
  }

  const leavesRemaining = validRequest.leavesRemaining;

  res
    .status(200)
    .json({ msg: `your remaining leaves are ${leavesRemaining} days` });
};

const viewMyLeaveDetails = async (req, res) => {
  const myLeaves = await Leave.find({ userId: req.user.userId });

  if (!myLeaves) {
    return res.status(400).send("You have not taken any leaves yet");
  }

  res.status(200).json({ myLeaves, count: myLeaves.length });
};

const viewEmployeesLeave = async (req, res) => {
  const id = req.user.userId;
  const userFound = await User.findOne({ _id: id, isAdmin: true });

  if (!userFound) {
    return res.status(404).json({ msg: `You are not an admin` });
  }

  const employeesLeaveDetails = await Leave.find({
    leaveTakenBy: req.body.email,
  });
  if (!employeesLeaveDetails) {
    return res.status(400).send("The employee has not taken any leaves yet");
  }
  res
    .status(200)
    .json({ employeesLeaveDetails, count: employeesLeaveDetails.length });
};
module.exports = {
  getLeaves,
  takeLeave,
  getRemainingLeaves,
  viewMyLeaveDetails,
  viewEmployeesLeave,
};
