const User = require("../model/User");
const { clearImage } = require("../util/file/fileHelper");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ error: "404 Not Found", message: "User not Found" });
    } else {
      return res.status(200).json({ user });
    }
  } catch (err) {
    if (!(err instanceof Error)) {
      err = new Error(err);
      err.status = 500;
    }

    if (!err.status) {
      err.status = 500;
    }

    return res.status(err.status).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    let profileImage;

    const file = req.file;
    if (file) {
      profileImage = { filepath: file.path };
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: "404 Not Found", message: "User not Found" });
    }

    if (user.profileImage) {
      if (user.profileImage.filepath !== profileImage.filepath) {
        clearImage(user.profileImage.filepath);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { ...data, hasProfile: true, profileImage },
      { new: true, runValidators: true, select: "-password" }
    );

    return res.status(200).json({ updatedUser });
  } catch (err) {
    if (!(err instanceof Error)) {
      err = new Error(err);
      err.status = 500;
    }

    if (!err.status) {
      err.status = 500;
    }

    return res.status(err.status).json({ error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
