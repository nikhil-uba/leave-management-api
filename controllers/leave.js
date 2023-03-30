require("dotenv").config();
const Leave = require("../model/Leave");
const nodemailer = require("nodemailer");

const getLeaves = async (req, res) => {
  const page = req.query.page || 0;
  const leaves = await Leave.find({})
    .populate({ path: "userId", select: `-password` })
    .sort({ updatedAt: -1 })
    .skip(0)
    // .skip(2 * page)
    .limit(null)
    .select("");
  const totalCounts = await Leave.countDocuments({});

  if (!leaves) {
    return res.status(404).json({ msg: "No Leaves match was found" });
  }
  return res.status(200).json({ leaves, totalCounts });
};

const takeLeave = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const userId = req.user.userId;
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

  const appliedByUser = await Leave.findOne({
    _id: userId,
  });
  if (!appliedByUser.hasProfile) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "User Profile doesn't exist" });
  }

  let totalLeavesRemaining = appliedByUser.leavesRemaining;
  let totalLeavesTaken = appliedByUser.leavesTaken;

  if (totalLeavesRemaining > 0) {
    let applierSquad = appliedByUser.squad;

    const applierSquadMates = await Leave.find(
      { squad: applierSquad },
      "email"
    );

    let squadMateEmails = [];
    applierSquadMates.forEach((squadMate) => {
      if (squadMate.email != req.user.email) {
        return squadMateEmails.push(squadMate.email);
      }
    });

    let ccEmails = [req.body.to];
    messageReceivers = squadMateEmails.concat(ccEmails);

    const leave = await Leave.create({
      userId,
      leaveType,
      leaveStart,
      fromDate,
      toDate,
      leaveDetail,
      sendEmail,
      attachment,
    });

    await Leave.findByIdAndUpdate(
      userId,
      {
        leavesRemaining: Number(totalLeavesRemaining - 1),
        leavesTaken: Number(totalLeavesTaken + 1),
      },
      {
        new: true,
      }
    );

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
      return res.status(201).json({ message: "Leave Email Sent with success" });
    } else {
      return res.status(201).json({ message: "Leave taken successfully." });
    }
  } else {
    return res
      .status(403)
      .json({ error: "403 Forbidden", message: "Leaves Exhausted" });
  }
};

const getLeavesRemaining = async (req, res) => {
  const userId = req.user.userId;

  const user = await Leave.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "User not Found" });
  }

  return res.status(200).json({ leavesRemaining: user.leavesRemaining });
};

const getLeavesTaken = async (req, res) => {
  const userId = req.user.userId;

  const user = await Leave.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "User not Found" });
  }

  return res.status(200).json({ leavesRemaining: user.leavesTaken });
};

const getUserLeaves = async (req, res) => {
  const leaves = await Leave.find({ userId: req.user.userId });

  if (!leaves) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "No Leaves Found" });
  }

  return res.status(200).json({ leaves });
};

const getLeave = async (req, res) => {
  const leave = await Leave.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!leave) {
    return res
      .status(404)
      .json({ error: "404 Not Found", message: "Leave not Found" });
  }

  return res.status(200).json({ leave });
};

const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!leave) {
      return res
        .status(404)
        .json({ error: "404 Not Found", message: "Leave not found" });
    }
    return res.status(200).json({ leave });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const leave = Leave.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!leave) {
      return res
        .status(404)
        .json({ error: "404 Not Found", message: "Leave not found" });
    }
    await Leave.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Leave Successfully Deleted" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

const deleteLeaves = async (req, res) => {
  try {
    await Leave.deleteMany({ _id: { $in: req.body } });
    return res.status(200).json({ message: "Leaves Successfully Deleted" });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "400 Bad Request", message: err.message });
  }
};

module.exports = {
  getLeaves,
  getUserLeaves,
  getLeave,
  takeLeave,
  getLeavesRemaining,
  getLeavesTaken,
  updateLeave,
  deleteLeave,
  deleteLeaves,
};
