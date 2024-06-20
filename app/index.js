const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db");
// const path = require("path");
const app = express();
var AWS = require("aws-sdk");
const crypto = require("crypto");
const axios = require('axios');

AWS.config.update({ region: "us-east-1" });

function sign(key, msg) {
  return crypto.createHmac("sha256", key).update(msg).digest();
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = sign("AWS4" + key, dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, "aws4_request");
  return kSigning;
}

// Replace with your own values
const access_key = process.env.AWS_ACCESS_KEY_ID;
const secret_key = process.env.AWS_SECRET_ACCESS_KEY;
const region = "us-east-1";
const service = "ses";
const host = "email.us-east-1.amazonaws.com";
const endpoint = "https://email.us-east-1.amazonaws.com/";

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
          const params = {
            Destination: {
              ToAddresses: [process.env.TO_EMAIL],
            },
            Source: process.env.SMTP_FROM,
            Message: {
              Body: {
                Html: {
                  Charset: "UTF-8",
                  Data: `<!DOCTYPE html>
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
            </html>`,
                },
                Text: {
                  Charset: "UTF-8",
                  Data: "New interested user",
                },
              },
              Subject: {
                Charset: "UTF-8",
                Data: "New Lead on TelebuSocial",
              },
            },
          };
          let mail = new AWS.SES({ apiVersion: "2010-12-01" })
            .sendEmail(params)
            .promise();
          mail
            .then(function () {
              res.status(200).send({ message: "Request submitted" });
            })
            .catch(function (err) {
              console.error(err, err.stack);
              res.status(400).send(err);
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
        const params = {
          Destination: {
            ToAddresses: [email],
          },
          Source: process.env.SMTP_FROM,
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: OTP_MAIL(row.name, row.otp),
              },
              Text: {
                Charset: "UTF-8",
                Data: "OTP - Getting started with TelebuSocial",
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "OTP - Getting started with TelebuSocial",
            },
          },
        };
        let mail = new AWS.SES({ apiVersion: "2010-12-01" })
          .sendEmail(params)
          .promise();
        mail
          .then(function () {
            res.status(200).send({ message: "Request submitted" });
          })
          .catch(function (err) {
            console.error(err, err.stack);
            res.status(400).send(err);
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

route.post("/schedule-demo", async (req, res) => {
  const { name, email, country, number, city, query, interest } = req.body;
  try {
    const amz_date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
    const date_stamp = amz_date.slice(0, 8);

    const canonical_uri = "/";
    const canonical_querystring = "";
    const canonical_headers =
      "content-type:application/x-www-form-urlencoded\nhost:" +
      host +
      "\nx-amz-date:" +
      amz_date +
      "\n";
    const signed_headers = "content-type;host;x-amz-date";
    const payload_hash = crypto.createHash("sha256").update("").digest("hex");

    const canonical_request =
      "POST\n" +
      canonical_uri +
      "\n" +
      canonical_querystring +
      "\n" +
      canonical_headers +
      "\n" +
      signed_headers +
      "\n" +
      payload_hash;
    const algorithm = "AWS4-HMAC-SHA256";
    const credential_scope =
      date_stamp + "/" + region + "/" + service + "/" + "aws4_request";
    const string_to_sign =
      algorithm +
      "\n" +
      amz_date +
      "\n" +
      credential_scope +
      "\n" +
      crypto.createHash("sha256").update(canonical_request).digest("hex");

    const signing_key = getSignatureKey(
      secret_key,
      date_stamp,
      region,
      service
    );
    const signature = crypto
      .createHmac("sha256", signing_key)
      .update(string_to_sign)
      .digest("hex");

    const authorization_header = `AWS4-HMAC-SHA256 Credential=${access_key}/${credential_scope}, SignedHeaders=${signed_headers}, Signature=${signature}`;

    const postData = new URLSearchParams();
    postData.append("Action", "SendEmail");
    postData.append("Source", process.env.SMTP_FROM);
    postData.append("Destination.ToAddresses.member.1", process.env.TO_EMAIL);
    postData.append("Message.Subject.Data", "Demo Request | TelebuSocial");
    postData.append(
      "Message.Body.Html.Data",
      `<!DOCTYPE html>
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
      </html>`
    );
    const response = await axios.post(endpoint, postData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Amz-Date": amz_date,
        Authorization: authorization_header,
      },
    });
    res.status(200).send({ message: "Request submitted" });
    // let mail = new AWS.SES({ apiVersion: "2010-12-01" })
    //   .sendEmail(params)
    //   .promise();
    // mail
    //   .then(function () {
    //     res.status(200).send({ message: "Request submitted" });
    //   })
    //   .catch(function (err) {
    //     console.error(err, err.stack);
    //     res.status(400).send(err);
    //   });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

route.post("/subscribe", (req, res) => {
  const { email } = req.body;
  try {
    const params = {
      Destination: {
        ToAddresses: [process.env.TO_EMAIL],
      },
      Source: process.env.SMTP_FROM,
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<!DOCTYPE html>
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
      </html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "New Email Subscriber | TelebuSocial",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New Email Subscriber | TelebuSocial",
        },
      },
    };
    let mail = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();
    mail
      .then(function () {
        res.status(200).send({ message: "Request submitted" });
      })
      .catch(function (err) {
        console.error(err, err.stack);
        res.status(400).send(err);
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
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Source: process.env.SMTP_FROM,
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: OTP_MAIL(name, otp),
          },
          Text: {
            Charset: "UTF-8",
            Data: "OTP - Getting started with TelebuSocial",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "OTP - Getting started with TelebuSocial",
        },
      },
    };

    
    let mail = new AWS.SES({ apiVersion: "2010-12-01" })
      .sendEmail(params)
      .promise();
    mail
      .then(function () {
        res.status(200).send({ message: "Request submitted" });
      })
      .catch(function (err) {
        console.error(err, err.stack);
        res.status(400).send(err);
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
