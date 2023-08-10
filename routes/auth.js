const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { nume, prenume, email, localitate, password } = req.body.formData;

  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC.toString()
    ).toString();

    const newUser = new User({
      nume,
      prenume,
      email,
      localitate,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong Credentials");
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC.toString()
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Wrong Credentials");
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
