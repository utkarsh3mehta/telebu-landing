const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db");
const path = require("path");
const app = express();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: process.env.SMTP,
  auth: {
    user: "apikey",
    pass: process.env.SMTP_PASS,
  },
  secure: false,
});
app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();
const port = process.env.PORT || 5000;

function OTP_MAIL(name, otp) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>One Time Password</title>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
      body {
        font-family: Poppins;
        background: linear-gradient(
          90deg,
          rgb(53, 83, 210) 0%,
          rgb(53, 83, 210) 50%,
          rgb(124, 138, 224) 100%
        );
        margin: 0;
        padding-top: 0px;
        border-radius: 5px;
      }
      .container {
        max-width: 520px;
        margin: 30px auto;
        padding-top: 40px;
      }
      .table-container {
        background-color: #fff;
        padding: 40px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .content {
        text-align: center;
        padding: 20px;
      }
      .otp {
        font-size: 48px;
        margin: 20px 0;
        font-weight: 700;
        color: #000;
      }
      p {
        color: #000;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #fff;
        text-align: center;
      }
      .footer p {
        color: #fff;
      }
      .footer p a {
        color: #fff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <table
        class="table-container"
        cellpadding="0"
        cellspacing="0"
        width="100%"
      >
        <tr>
          <td align="center">
            <img src="cid:email" width="150" height="150" />
          </td>
        </tr>
        <tr>
          <td class="content">
            <p style="margin: 0; font-size: 20px; font-weight: 600">Hi ${name}</p>
            <p style="margin: 0; font-size: 20px; font-weight: 600">
              Welcome to TelebuSocial
            </p>
            <p>Here’s your OTP to Sign up on TelebuSocial</p>
            <div class="otp">${otp}</div>
            <p>
              If you have any questions, please contact our <br /><a
                href="mailto:support@telebusocial.com"
                style="color: #3166de; text-decoration: underline"
                >Customer Success team.</a
              >
            </p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <img src="cid:logo" width="150" height="50" />
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td class="footer">
            <p>
              <a href="#">Terms & Conditions</a> |
              <a href="https://www.telebusocial.com/contact.html">Contact Us</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
`;
}

route.get("/test", (req, res) => {
  res.status(200).send({ message: "Request submitted" });
});

route.post("/validate-otp", (req, res) => {
  const { email, otp } = req.body;
  try {
    db.each(`SELECT * from leads where email="${email}"`, (err, row) => {
      if (err) res.status(400).send({ message: "No email found" });
      if (row.otp == otp) {
        try {
          const stmt = db.prepare(
            `UPDATE leads SET otpValidated = 1 where email="${email}"`
          );
          stmt.run();
          stmt.finalize();
          const mailData = {
            from: process.env.SMTP_FROM,
            to: process.env.TO_EMAIL,
            cc: process.env.CC_EMAIL,
            subject: "New Lead on TelebuSocial",
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
                      <td>${row.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>${row.email}</td>
                    </tr>
                    <tr>
                      <td>Number</td>
                      <td>${row.country} - ${row.number}</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>${row.city}</td>
                    </tr>
                    <tr>
                      <td>Interest</td>
                      <td>${row.interest}</td>
                    </tr>
                    <tr>
                      <td>Demo</td>
                      <td>${row.demo ? "Yes" : "No"}</td>
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
      } else {
        res.status(401).send({ message: "OTP does not match" });
      }
    });
  } catch (err) {
    res.status(400).send({ message: "No email found" });
  }
});

route.post("/resend-otp", (req, res) => {
  const { email } = req.body;
  try {
    db.each(`SELECT * from leads where email="${email}"`, (err, row) => {
      if (err) res.status(400).send({ message: "No email found" });
      try {
        const mailData = {
          from: process.env.SMTP_FROM,
          to: email,
          replyTo: "noreply@telebusocial.com",
          subject: "OTP - Getting started with TelebuSocial",
          text: "OTP - Getting started with TelebuSocial",
          html: OTP_MAIL(row.name, row.otp),
          attachments: [
            {
              filename: "logo.png",
              path: path.join(__dirname, "/assets/logo.png"),
              cid: "logo", //same cid value as in the html img src
            },
            {
              filename: "email.jpg",
              path: path.join(__dirname, "/assets/email.jpg"),
              cid: "email", //same cid value as in the html img src
            },
          ],
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
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "No email found" });
  }
});

route.post("/schedule-demo", (req, res) => {
  const { name, email, country, number, city, query, interest } = req.body;
  try {
    const mailData = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      cc: process.env.CC_EMAIL,
      subject: "Demo Request | TelebuSocial",
      text: "Schedule demo",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Schedule demo</title>
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
                <td>Interest</td>
                <td>${interest}</td>
              </tr>
              <tr>
                <td>Query</td>
                <td>${query}</td>
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

route.post("/subscribe", (req, res) => {
  const { email } = req.body;
  try {
    const mailData = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      cc: process.env.CC_EMAIL,
      subject: "New Email Subscriber | TelebuSocial",
      text: "New subscriber",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New subscriber</title>
        </head>
        <body>
          <table border="">
            <tbody>
              <tr>
                <td>Email</td>
                <td>${email}</td>
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

route.post("/raise-query", (req, res) => {
  const { query, email } = req.body;
  try {
    const mailData = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      cc: process.env.CC_EMAIL,
      subject: "New FAQ | TelebuSocial",
      text: "New FAQ",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New FAQ</title>
        </head>
        <body>
          <p>Received from: ${email}
          <p>Query: ${query}</p>
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

route.post("/get-started", (req, res) => {
  const { email, name, number, country, city, demo, interest } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const stmt =
      db.prepare(`INSERT INTO leads (name, email, country, number, city, demo, otp, interest)
    VALUES ('${name}', '${email}', '${country}', '${number}', '${city}', ${demo}, ${otp}, '${interest}');`);
    stmt.run();
    stmt.finalize();
    const mailData = {
      from: process.env.SMTP_FROM,
      to: email,
      replyTo: "noreply@telebusocial.com",
      subject: "OTP - Getting started with TelebuSocial",
      text: "OTP - Getting started with TelebuSocial",
      html: OTP_MAIL(name, otp),
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "/assets/logo.png"),
          cid: "logo", //same cid value as in the html img src
        },
        {
          filename: "email.jpg",
          path: path.join(__dirname, "/assets/email.jpg"),
          cid: "email", //same cid value as in the html img src
        },
      ],
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
