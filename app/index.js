const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: process.env.SMTP,
  auth: {
    user: "apikey",
    pass: process.env.SMTP_SECRET_KEY,
  },
  secure: false,
});
app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
const port = process.env.PORT || 5000;

route.get("/test", (req, res) => {
  res.status(200).send({ message: "Request submitted" });
});

route.post("/get-started", (req, res) => {
  const { email, name, number, country, city, demo } = req.body;
  try {
    const mailData = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      subject: "New interested user",
      text: "New interested user",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New interested user</title>
        </head>
        <body>
          <table border="">
            <tbody>
              <tr>
                <td>Name</td>
                <td>${name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>${email}</td>
              </tr>
              <tr>
                <td>Number</td>
                <td>${country} - ${number}</td>
              </tr>
              <tr>
                <td>City</td>
                <td>${city}</td>
              </tr>
              <tr>
                <td>Demo</td>
                <td>${demo}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
      `,
    };
    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      res.status(200).send({ message: "Request submitted" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});
// app.use("/v1", route);
app.use(route);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
