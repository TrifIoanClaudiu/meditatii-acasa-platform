const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require('cors');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const teacherRoute = require("./routes/profesor");
const mailerRoute = require("./routes/mailer");

const app = express();

app.use(cors());
dotenv.config();

mongoose
  .connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("DB Connection Succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/teachers", teacherRoute);
app.use("/mailer", mailerRoute);

app.listen(4000, function () {
  console.log("Server is running on port 4000");
});
