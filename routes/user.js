const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./tokenMiddleware");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

//Get user by id
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User has not been found");
      }

      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(400).json(err);
    }
});

//Update user details
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updates = {};
    for (const key in req.body) {
      if (req.body[key] !== "") {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updates,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});


//Delete user
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User succesfully deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

//Update user password
router.put("/password/:id", verifyTokenAndAuthorization, async (req, res) => {
  const { newPassword } = req.body;
  if (req.body.newPassword) {
    updatedPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.PASS_SEC
    ).toString();
  } else {
    return res.status(400).json("New password not provided");
  }
  try {
    const user = await User.findById(req.params.id);
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC.toString()
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.oldPassword) {
      return res.status(401).json("Wrong Credentials");
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { password: updatedPassword },
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
