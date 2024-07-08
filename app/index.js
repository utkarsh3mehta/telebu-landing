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
    <meta
      name="google-site-verification"
      content="q7AbFskcx5yCZpGbM5q7c_4NiFs3v3xUTKi9196tLSI"
    />
    <title>Email</title>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
      p {
        padding: 0 10px;
        font-size: 18px;
        font-family: Poppins;
        color: #000;
      }
      #copy_button {
        margin: 18px 0;
        background: #3166de;
        box-shadow: none;
        border: 0;
        color: #fff;
        padding: 10px 35px;
        border-radius: 5px;
        font-family: Poppins;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <table
      width="100%"
      style="border: 1px solid #000"
      cellpadding="0"
      cellspacing="0"
    >
      <tbody>
        <tr>
          <td align="center" style="padding: 15px 0">
            <img
              style="width: 15%"
              src="cid:logo"
            />
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="border-top: 1px solid #000; border-bottom: 1px solid #000"
          >
            <p style="font-size: 32px; font-weight: 700">Your OTP</p>
          </td>
        </tr>
        <tr>
          <td>
            <p><span style="font-weight: 600"> Dear </span>${name}</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="border-top: 1px solid #000">
            <p>Here’s your OTP to Sign up on TelebuSocial</p>
            <p class="copy_otp">${otp}</p>
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="border-top: 1px solid #000; border-bottom: 1px solid #000"
          >
            <p>
              If you have any questions, please contact our
              <a
                href="mailto:support@telebusocial.com"
                style="text-decoration: none; color: #3166de"
                >Customer Success team</a
              >.
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin-bottom: 0">Warm regards.</p>
            <p style="margin-top: 0">TelebuSocial Team.</p>
          </td>
        </tr>
        <tr>
          <td
            align="center"
            style="border-top: 1px solid #000; border-bottom: 1px solid #000"
          >
            <p>Download the latest TelebuSocial mobile app.</p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <a
              href="https://play.google.com/store/apps/details?id=com.telebusocial.mobileapp"
              style="display: inline-block; width: 12%"
            >
              <img
                width="100%"
                src="cid:google-play"
                alt="Google Play store"
              />
            </a>
            <a
              href="https://apps.apple.com/ae/app/telebu-social/id6463861190"
              style="display: inline-block; width: 12%; margin: 18px 0"
            >
              <img width="100%" 
              src="cid:app-store"
              alt="Apple Play store"
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="border-top: 1px solid #000">
            <p>
              Telebu Communications LLP, Madhapur, Hyderabad, IN 500081, India
            </p>
          </td>
        </tr>
      </tbody>
    </table>
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
              filename: "app-store.png",
              path: path.join(__dirname, "/assets/app-store.png"),
              cid: "app-store", //same cid value as in the html img src
            },
            {
              filename: "google-play.png",
              path: path.join(__dirname, "/assets/google-play.png"),
              cid: "google-play", //same cid value as in the html img src
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
  const { query } = req.body;
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
          filename: "app-store.png",
          path: path.join(__dirname, "/assets/app-store.png"),
          cid: "app-store", //same cid value as in the html img src
        },
        {
          filename: "google-play.png",
          path: path.join(__dirname, "/assets/google-play.png"),
          cid: "google-play", //same cid value as in the html img src
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
