const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db");

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
              src="data:image/png; base64, 
              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"
              style="width: 15%"
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
                src="data:image/png;base64,
              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"
                alt="Google Play store"
              />
            </a>
            <a
              href="https://apps.apple.com/ae/app/telebu-social/id6463861190"
              style="display: inline-block; width: 12%; margin: 18px 0"
            >
              <img width="100%" src="data:image/jpg;base64,
              iVBORw0KGgoAAAANSUhEUgAAAQAAAABUCAYAAABtGukzAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAFqFJREFUeJztnQW0VUUUhp+FYgsIdjcqdnd3Y2Nj1wLFQBEDxcQAxe7uDrA7sbG7sFtR8Pi+0X3X3H1P3nfOmaPMv9a/1ntz5s6dM3dmz8zee/a0tHh4eHh4eHh4eHh4jONYoJWntfL1Vv7eysDT0/M/S8YwY5kxzdiORLtWDm7l2ApU2tPTM38ytoe2sn2LAoN/WAUq6OnpWTyHt/wz5msYUoFKeXp6lkdW+wZdWzmmAhXy9PQsj4x5xn7LoApUxtPTs3wy9ltGVqAinp6e5ZOx3zK6AhXx9PQsn4x955Xw9PR0R+cV8PT0dEfnFfD09HRH5xXw9PR0R+cV8PT0dEfnFWia8803X3DooYcG1157bbDSSis5r89/nZ07dw7mmGOOYMopp3RWh8knn9zUYbrppnPeHllJu1H3Tp06Oa9LBjqvQGbSyLfeemvw119/BYJNNtnESV3WXXfdoG/fvsHAgQODIUOGBCeeeGLQq1cvI5DGH398522VhVdeeaVpy7322stZHbbddltThzvuuMN5e2Ql7QbOPvts53XJQOcVyMR99903+OWXXwKNJZdc0kl9Hn300Ya6CD744INggw02cN5maekFQDpOMMEEwbTTTtuQ7gVAwTz11FNDB9rvv/9ulo4u6iQCoEePHsHEE09sloHLLLNMcOGFF5oVCtxmm22ct10aegGQzO7duwdffvllcMIJJzQ88wKgQO62226RM+29997rrF4iANZff/2GZwcccIB59vXXXwdTTTVV6OcnmWSSYNZZZy1FgDFzzTzzzEH79u1DnycJALY0M8wwQ6r9+dRTT222apNOOmliXmbT6aef3vzdrABo165dMMsss5jvTfuZLl26BB06dMj0PeicQBoBQDvPNttspt3jypxwwglNHwhbVZTA0r8wM2eaaabg559/jhQAW2yxhbO6xQkABsybb75pnu+44451z2acccbguuuuC0aPHm2ejx07NnjooYeCBRdcsC7fs88+G3z77bfBEkssUUtbZ511TNrQoUPr8r7wwgsmnUHK/4suuqj5f9CgQcHuu+9uZi7AFqp3794N9Y0SAOONN15wyCGH1D4v25udd965oYzNNtsseOutt2r5xowZE1x//fWhArBbt27BM888U8v72muvBccdd1wmATDFFFMEF1xwQd22kDZbfvnlG/JSZ9po6aWXDl555RWTlxUa751GUD322GPBr7/+aj7322+/mba96667as9FAJxzzjnB8ccfX8v78ccfB6uttlpo/zjyyCOD7777rlb3J598MphnnnnK7MPuBnZannvuuZGDnx/SpbItTgBAFIPgjDPOqKWxTZBBctVVVwU77bST6cSAzjDnnHPW8vI5YA9YZhgwatSo2rszs4Pnn3++lm+hhRYyaZ9++qnpsAiMSy65xAxKsOGGG9bVNUoAIECkrffYY4+gT58+pvOH5UXQXXrppWZLtP322wcPPPCAyceWyM6HUP/mm2/Ms9tuuy04/PDDg3vuuadWtzQCYKKJJgoef/xxk//uu+82Aom6UgbbwqWWWqou/+eff24EBXW/5ZZbgjPPPNOszsBZZ52V+H39+vULnn76aZN/xIgRpl8efPDBteciAPgNEfynnXZarX98//33QceOHevKGzBggHl28803B2uvvXZw2GGHmbq/8847ZmVYUh92P8DjyBKNHzMMNNZyyy3ntH5JAqB///7m+RVXXNGQxg9v573ssstMOgNI0tZaa62GvB9++GEwcuRIk85sRhpCBDCjSL5555231lZYKyT95JNPNmnXXHNN3feHCYD555/fzJI//fRT3RIV4SGdfbLJJotsn2mmmcbk++GHH+rSRbDZ78pKAyGQVgDsuuuuJi+rCHuZzewLED52ftoNnHTSSbW0VVZZxaQhCNL83mm2AJ988kltxUO9WNkAhKLkRWD/+eefwXPPPWfeW9IRSqBEvZG7wZOGsifUoFPuueeezuuXJABksA0ePLiWxjI07DMrr7yySWdmlzQUiwy+r776ynQUmdW322470wbHHHOMyXf55Zeb9IUXXrj2WfbEgKW7/T0IA0Dd7fQwAcBsDy6++OK6vNSFjg5WX331umfsrbHWMOszu9PRge1fICsgbb3ZZZddUgsAZnHAqsROn3322U06E4St7xABYK8M0B2IOTmNHiaNALjooovq0mUVeMQRR9TSRKfF9gjFolDynnLKKWX1YbcDKIk0hAazCQPAdd1gkgAYPny4eb7//vvX0mQvzexq50URJLDTmf0lPx3wjz/+MLPuq6++Gjz11FMmz0cf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"
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
                      <td>Demo</td>
                      <td>${row.demo}</td>
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
          subject: "OTP - Getting started with TelebuSocial",
          text: "OTP - Getting started with TelebuSocial",
          html: OTP_MAIL(row.name, row.otp),
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
  const { name, email, country, number, city, query } = req.body;
  try {
    const mailData = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      subject: "Schedule demo",
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
      subject: "New subscriber",
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

route.post("/get-started", (req, res) => {
  const { email, name, number, country, city, demo } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const stmt =
      db.prepare(`INSERT INTO leads (name, email, country, number, city, demo, otp)
    VALUES ('${name}', '${email}', '${country}', '${number}', '${city}', ${demo}, ${otp});`);
    stmt.run();
    stmt.finalize();
    const mailData = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "OTP - Getting started with TelebuSocial",
      text: "OTP - Getting started with TelebuSocial",
      html: OTP_MAIL(name, otp),
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
