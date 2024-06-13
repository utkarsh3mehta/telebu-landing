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
            <img src="http://staging.telebusocial.com/images/logo.svg"/ style="
            width: 15%; ">
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
            <a href="https://play.google.com/store/apps/details?id=com.telebusocial.mobileapp" style="display: inline-block; width: 12%">
              <div>
                <?xml version="1.0" encoding="utf-8"?>

                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <svg
                  width="80px"
                  viewBox="0 -47.5 135 135"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <style>
                    .st0 {
                      fill: #a6a6a6;
                    }

                    .st1 {
                      stroke: #ffffff;
                      stroke-width: 0.2;
                      stroke-miterlimit: 10;
                    }

                    .st1,
                    .st2 {
                      fill: #fff;
                    }

                    .st3 {
                      fill: url(#SVGID_1_);
                    }

                    .st4 {
                      fill: url(#SVGID_2_);
                    }

                    .st5 {
                      fill: url(#SVGID_3_);
                    }

                    .st6 {
                      fill: url(#SVGID_4_);
                    }

                    .st7,
                    .st8,
                    .st9 {
                      opacity: 0.2;
                      enable-background: new;
                    }

                    .st8,
                    .st9 {
                      opacity: 0.12;
                    }

                    .st9 {
                      opacity: 0.25;
                      fill: #fff;
                    }
                  </style>

                  <path
                    d="M130 40H5c-2.8 0-5-2.2-5-5V5c0-2.8 2.2-5 5-5h125c2.8 0 5 2.2 5 5v30c0 2.8-2.2 5-5 5z"
                  />

                  <path
                    class="st0"
                    d="M130 .8c2.3 0 4.2 1.9 4.2 4.2v30c0 2.3-1.9 4.2-4.2 4.2H5C2.7 39.2.8 37.3.8 35V5C.8 2.7 2.7.8 5 .8h125m0-.8H5C2.2 0 0 2.3 0 5v30c0 2.8 2.2 5 5 5h125c2.8 0 5-2.2 5-5V5c0-2.7-2.2-5-5-5z"
                  />

                  <path
                    class="st1"
                    d="M47.4 10.2c0 .8-.2 1.5-.7 2-.6.6-1.3.9-2.2.9-.9 0-1.6-.3-2.2-.9-.6-.6-.9-1.3-.9-2.2 0-.9.3-1.6.9-2.2.6-.6 1.3-.9 2.2-.9.4 0 .8.1 1.2.3.4.2.7.4.9.7l-.5.5c-.4-.5-.9-.7-1.6-.7-.6 0-1.2.2-1.6.7-.5.4-.7 1-.7 1.7s.2 1.3.7 1.7c.5.4 1 .7 1.6.7.7 0 1.2-.2 1.7-.7.3-.3.5-.7.5-1.2h-2.2v-.8h2.9v.4zM52 7.7h-2.7v1.9h2.5v.7h-2.5v1.9H52v.8h-3.5V7H52v.7zM55.3 13h-.8V7.7h-1.7V7H57v.7h-1.7V13zM59.9 13V7h.8v6h-.8zM64.1 13h-.8V7.7h-1.7V7h4.1v.7H64V13zM73.6 12.2c-.6.6-1.3.9-2.2.9-.9 0-1.6-.3-2.2-.9-.6-.6-.9-1.3-.9-2.2s.3-1.6.9-2.2c.6-.6 1.3-.9 2.2-.9.9 0 1.6.3 2.2.9.6.6.9 1.3.9 2.2 0 .9-.3 1.6-.9 2.2zm-3.8-.5c.4.4 1 .7 1.6.7.6 0 1.2-.2 1.6-.7.4-.4.7-1 .7-1.7s-.2-1.3-.7-1.7c-.4-.4-1-.7-1.6-.7-.6 0-1.2.2-1.6.7-.4.4-.7 1-.7 1.7s.2 1.3.7 1.7zM75.6 13V7h.9l2.9 4.7V7h.8v6h-.8l-3.1-4.9V13h-.7z"
                  />

                  <path
                    class="st2"
                    d="M68.1 21.8c-2.4 0-4.3 1.8-4.3 4.3 0 2.4 1.9 4.3 4.3 4.3s4.3-1.8 4.3-4.3c0-2.6-1.9-4.3-4.3-4.3zm0 6.8c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6c1.3 0 2.4 1 2.4 2.6 0 1.5-1.1 2.6-2.4 2.6zm-9.3-6.8c-2.4 0-4.3 1.8-4.3 4.3 0 2.4 1.9 4.3 4.3 4.3s4.3-1.8 4.3-4.3c0-2.6-1.9-4.3-4.3-4.3zm0 6.8c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6c1.3 0 2.4 1 2.4 2.6 0 1.5-1.1 2.6-2.4 2.6zm-11.1-5.5v1.8H52c-.1 1-.5 1.8-1 2.3-.6.6-1.6 1.3-3.3 1.3-2.7 0-4.7-2.1-4.7-4.8s2.1-4.8 4.7-4.8c1.4 0 2.5.6 3.3 1.3l1.3-1.3c-1.1-1-2.5-1.8-4.5-1.8-3.6 0-6.7 3-6.7 6.6 0 3.6 3.1 6.6 6.7 6.6 2 0 3.4-.6 4.6-1.9 1.2-1.2 1.6-2.9 1.6-4.2 0-.4 0-.8-.1-1.1h-6.2zm45.4 1.4c-.4-1-1.4-2.7-3.6-2.7s-4 1.7-4 4.3c0 2.4 1.8 4.3 4.2 4.3 1.9 0 3.1-1.2 3.5-1.9l-1.4-1c-.5.7-1.1 1.2-2.1 1.2s-1.6-.4-2.1-1.3l5.7-2.4-.2-.5zm-5.8 1.4c0-1.6 1.3-2.5 2.2-2.5.7 0 1.4.4 1.6.9l-3.8 1.6zM82.6 30h1.9V17.5h-1.9V30zm-3-7.3c-.5-.5-1.3-1-2.3-1-2.1 0-4.1 1.9-4.1 4.3s1.9 4.2 4.1 4.2c1 0 1.8-.5 2.2-1h.1v.6c0 1.6-.9 2.5-2.3 2.5-1.1 0-1.9-.8-2.1-1.5l-1.6.7c.5 1.1 1.7 2.5 3.8 2.5 2.2 0 4-1.3 4-4.4V22h-1.8v.7zm-2.2 5.9c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6c1.3 0 2.3 1.1 2.3 2.6s-1 2.6-2.3 2.6zm24.4-11.1h-4.5V30h1.9v-4.7h2.6c2.1 0 4.1-1.5 4.1-3.9s-2-3.9-4.1-3.9zm.1 6h-2.7v-4.3h2.7c1.4 0 2.2 1.2 2.2 2.1-.1 1.1-.9 2.2-2.2 2.2zm11.5-1.8c-1.4 0-2.8.6-3.3 1.9l1.7.7c.4-.7 1-.9 1.7-.9 1 0 1.9.6 2 1.6v.1c-.3-.2-1.1-.5-1.9-.5-1.8 0-3.6 1-3.6 2.8 0 1.7 1.5 2.8 3.1 2.8 1.3 0 1.9-.6 2.4-1.2h.1v1h1.8v-4.8c-.2-2.2-1.9-3.5-4-3.5zm-.2 6.9c-.6 0-1.5-.3-1.5-1.1 0-1 1.1-1.3 2-1.3.8 0 1.2.2 1.7.4-.2 1.2-1.2 2-2.2 2zm10.5-6.6l-2.1 5.4h-.1l-2.2-5.4h-2l3.3 7.6-1.9 4.2h1.9l5.1-11.8h-2zm-16.8 8h1.9V17.5h-1.9V30z"
                  />

                  <g>
                    <linearGradient
                      id="SVGID_1_"
                      gradientUnits="userSpaceOnUse"
                      x1="21.8"
                      y1="33.29"
                      x2="5.017"
                      y2="16.508"
                      gradientTransform="matrix(1 0 0 -1 0 42)"
                    >
                      <stop offset="0" stop-color="#00a0ff" />

                      <stop offset=".007" stop-color="#00a1ff" />

                      <stop offset=".26" stop-color="#00beff" />

                      <stop offset=".512" stop-color="#00d2ff" />

                      <stop offset=".76" stop-color="#00dfff" />

                      <stop offset="1" stop-color="#00e3ff" />
                    </linearGradient>

                    <path
                      class="st3"
                      d="M10.4 7.5c-.3.3-.4.8-.4 1.4V31c0 .6.2 1.1.5 1.4l.1.1L23 20.1v-.2L10.4 7.5z"
                    />

                    <linearGradient
                      id="SVGID_2_"
                      gradientUnits="userSpaceOnUse"
                      x1="33.834"
                      y1="21.999"
                      x2="9.637"
                      y2="21.999"
                      gradientTransform="matrix(1 0 0 -1 0 42)"
                    >
                      <stop offset="0" stop-color="#ffe000" />

                      <stop offset=".409" stop-color="#ffbd00" />

                      <stop offset=".775" stop-color="orange" />

                      <stop offset="1" stop-color="#ff9c00" />
                    </linearGradient>

                    <path
                      class="st4"
                      d="M27 24.3l-4.1-4.1V19.9l4.1-4.1.1.1 4.9 2.8c1.4.8 1.4 2.1 0 2.9l-5 2.7z"
                    />

                    <linearGradient
                      id="SVGID_3_"
                      gradientUnits="userSpaceOnUse"
                      x1="24.827"
                      y1="19.704"
                      x2="2.069"
                      y2="-3.054"
                      gradientTransform="matrix(1 0 0 -1 0 42)"
                    >
                      <stop offset="0" stop-color="#ff3a44" />

                      <stop offset="1" stop-color="#c31162" />
                    </linearGradient>

                    <path
                      class="st5"
                      d="M27.1 24.2L22.9 20 10.4 32.5c.5.5 1.2.5 2.1.1l14.6-8.4"
                    />

                    <linearGradient
                      id="SVGID_4_"
                      gradientUnits="userSpaceOnUse"
                      x1="7.297"
                      y1="41.824"
                      x2="17.46"
                      y2="31.661"
                      gradientTransform="matrix(1 0 0 -1 0 42)"
                    >
                      <stop offset="0" stop-color="#32a071" />

                      <stop offset=".069" stop-color="#2da771" />

                      <stop offset=".476" stop-color="#15cf74" />

                      <stop offset=".801" stop-color="#06e775" />

                      <stop offset="1" stop-color="#00f076" />
                    </linearGradient>

                    <path
                      class="st6"
                      d="M27.1 15.8L12.5 7.5c-.9-.5-1.6-.4-2.1.1L22.9 20l4.2-4.2z"
                    />

                    <path
                      class="st7"
                      d="M27 24.1l-14.5 8.2c-.8.5-1.5.4-2 0l-.1.1.1.1c.5.4 1.2.5 2 0L27 24.1z"
                    />

                    <path
                      class="st8"
                      d="M10.4 32.3c-.3-.3-.4-.8-.4-1.4v.1c0 .6.2 1.1.5 1.4v-.1h-.1zM32 21.3l-5 2.8.1.1 4.9-2.8c.7-.4 1-.9 1-1.4 0 .5-.4.9-1 1.3z"
                    />

                    <path
                      class="st9"
                      d="M12.5 7.6L32 18.7c.6.4 1 .8 1 1.3 0-.5-.3-1-1-1.4L12.5 7.5c-1.4-.8-2.5-.2-2.5 1.4V9c0-1.5 1.1-2.2 2.5-1.4z"
                    />
                  </g>
                </svg>
              </div>
            </a>
            <a
              href="https://apps.apple.com/ae/app/telebu-social/id6463861190"
              style="display: inline-block; width: 12%; margin: 18px 0"
            >
              <div>
                <?xml version="1.0" encoding="utf-8"?>

                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <svg
                  width="80px"
                  viewBox="0 -189.93 539.856 539.856"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="scale(4.00216 4.0011)">
                    <path
                      fill="#FFF"
                      d="M134.032 35.268a3.83 3.83 0 0 1-3.834 3.83H4.729a3.835 3.835 0 0 1-3.839-3.83V4.725A3.84 3.84 0 0 1 4.729.89h125.468a3.834 3.834 0 0 1 3.834 3.835l.001 30.543z"
                    />

                    <path
                      fill="#A6A6A6"
                      d="M130.198 39.989H4.729A4.73 4.73 0 0 1 0 35.268V4.726A4.733 4.733 0 0 1 4.729 0h125.468a4.735 4.735 0 0 1 4.729 4.726v30.542c.002 2.604-2.123 4.721-4.728 4.721z"
                    />

                    <path
                      d="M134.032 35.268a3.83 3.83 0 0 1-3.834 3.83H4.729a3.835 3.835 0 0 1-3.839-3.83V4.725A3.84 3.84 0 0 1 4.729.89h125.468a3.834 3.834 0 0 1 3.834 3.835l.001 30.543z"
                    />

                    <path
                      fill="#FFF"
                      d="M30.128 19.784c-.029-3.223 2.639-4.791 2.761-4.864-1.511-2.203-3.853-2.504-4.676-2.528-1.967-.207-3.875 1.177-4.877 1.177-1.022 0-2.565-1.157-4.228-1.123-2.14.033-4.142 1.272-5.24 3.196-2.266 3.923-.576 9.688 1.595 12.859 1.086 1.554 2.355 3.287 4.016 3.226 1.625-.066 2.232-1.035 4.193-1.035 1.943 0 2.513 1.035 4.207.996 1.744-.027 2.842-1.56 3.89-3.127 1.255-1.779 1.759-3.533 1.779-3.623-.04-.014-3.386-1.292-3.42-5.154zM26.928 10.306c.874-1.093 1.472-2.58 1.306-4.089-1.265.056-2.847.875-3.758 1.944-.806.942-1.526 2.486-1.34 3.938 1.421.106 2.88-.717 3.792-1.793z"
                    />

                    <linearGradient
                      id="a"
                      gradientUnits="userSpaceOnUse"
                      x1="-23.235"
                      y1="97.431"
                      x2="-23.235"
                      y2="61.386"
                      gradientTransform="matrix(4.0022 0 0 4.0011 191.95 -349.736)"
                    >
                      <stop offset="0" stop-color="#1a1a1a" stop-opacity=".1" />

                      <stop
                        offset=".123"
                        stop-color="#212121"
                        stop-opacity=".151"
                      />

                      <stop
                        offset=".308"
                        stop-color="#353535"
                        stop-opacity=".227"
                      />

                      <stop
                        offset=".532"
                        stop-color="#575757"
                        stop-opacity=".318"
                      />

                      <stop
                        offset=".783"
                        stop-color="#858585"
                        stop-opacity=".421"
                      />

                      <stop
                        offset="1"
                        stop-color="#b3b3b3"
                        stop-opacity=".51"
                      />
                    </linearGradient>

                    <path
                      fill="url(#a)"
                      d="M130.198 0H62.993l26.323 39.989h40.882a4.733 4.733 0 0 0 4.729-4.724V4.726A4.734 4.734 0 0 0 130.198 0z"
                    />

                    <g fill="#FFF">
                      <path
                        d="M53.665 31.504h-2.271l-1.244-3.909h-4.324l-1.185 3.909H42.43l4.285-13.308h2.646l4.304 13.308zm-3.89-5.549L48.65 22.48c-.119-.355-.343-1.191-.671-2.507h-.04c-.132.566-.343 1.402-.632 2.507l-1.106 3.475h3.574zM64.663 26.588c0 1.632-.443 2.922-1.33 3.869-.794.843-1.781 1.264-2.958 1.264-1.271 0-2.185-.453-2.74-1.361v5.035h-2.132V25.062c0-1.025-.027-2.076-.079-3.154h1.875l.119 1.521h.04c.711-1.146 1.79-1.719 3.238-1.719 1.132 0 2.077.447 2.833 1.342.755.897 1.134 2.075 1.134 3.536zm-2.172.078c0-.934-.21-1.704-.632-2.311-.461-.631-1.08-.947-1.856-.947-.526 0-1.004.176-1.431.523-.428.35-.708.807-.839 1.373a2.784 2.784 0 0 0-.099.649v1.601c0 .697.214 1.286.642 1.768.428.48.984.721 1.668.721.803 0 1.428-.311 1.875-.928.448-.619.672-1.435.672-2.449zM75.7 26.588c0 1.632-.443 2.922-1.33 3.869-.795.843-1.781 1.264-2.959 1.264-1.271 0-2.185-.453-2.74-1.361v5.035h-2.132V25.062c0-1.025-.027-2.076-.079-3.154h1.875l.119 1.521h.04c.71-1.146 1.789-1.719 3.238-1.719 1.131 0 2.076.447 2.834 1.342.754.897 1.134 2.075 1.134 3.536zm-2.173.078c0-.934-.211-1.704-.633-2.311-.461-.631-1.078-.947-1.854-.947-.526 0-1.004.176-1.433.523-.428.35-.707.807-.838 1.373-.065.264-.1.479-.1.649v1.601c0 .697.215 1.286.641 1.768.428.479.984.721 1.67.721.804 0 1.429-.311 1.875-.928.448-.619.672-1.435.672-2.449zM88.04 27.771c0 1.133-.396 2.054-1.183 2.765-.866.776-2.075 1.165-3.625 1.165-1.432 0-2.58-.276-3.446-.829l.493-1.777c.935.554 1.962.83 3.08.83.804 0 1.429-.182 1.875-.543.447-.362.673-.846.673-1.45 0-.541-.187-.994-.554-1.363-.369-.368-.979-.711-1.836-1.026-2.33-.869-3.496-2.14-3.496-3.812 0-1.092.412-1.986 1.234-2.685.822-.698 1.912-1.047 3.268-1.047 1.211 0 2.22.211 3.021.632l-.535 1.738c-.754-.408-1.605-.612-2.557-.612-.752 0-1.342.185-1.764.553-.355.329-.535.73-.535 1.206 0 .525.205.961.613 1.303.354.315 1 .658 1.934 1.026 1.146.462 1.988 1 2.527 1.618.543.618.813 1.389.813 2.308zM95.107 23.508h-2.35v4.659c0 1.185.414 1.776 1.244 1.776.381 0 .697-.032.947-.099l.059 1.619c-.42.157-.973.236-1.658.236-.842 0-1.5-.257-1.975-.771-.473-.514-.711-1.375-.711-2.587v-4.837h-1.4v-1.6h1.4v-1.757l2.094-.632v2.389h2.35v1.604zM105.689 26.627c0 1.475-.422 2.686-1.264 3.633-.881.975-2.053 1.461-3.514 1.461-1.41 0-2.531-.467-3.367-1.4-.836-.935-1.254-2.113-1.254-3.534 0-1.487.432-2.705 1.293-3.652.863-.948 2.025-1.422 3.486-1.422 1.408 0 2.539.468 3.395 1.402.818.906 1.225 2.076 1.225 3.512zm-2.21.049c0-.879-.19-1.633-.571-2.264-.447-.762-1.087-1.143-1.916-1.143-.854 0-1.509.381-1.955 1.143-.382.631-.572 1.398-.572 2.304 0 .88.19 1.636.572 2.265.461.762 1.104 1.143 1.937 1.143.815 0 1.454-.389 1.916-1.162.392-.646.589-1.405.589-2.286zM112.622 23.783a3.71 3.71 0 0 0-.672-.059c-.75 0-1.33.282-1.738.85-.354.5-.532 1.132-.532 1.895v5.035h-2.132V24.93a67.43 67.43 0 0 0-.062-3.021h1.857l.078 1.836h.059c.226-.631.58-1.14 1.066-1.521a2.578 2.578 0 0 1 1.541-.514c.197 0 .375.014.533.039l.002 2.034zM122.157 26.252a5 5 0 0 1-.078.967h-6.396c.024.948.334 1.674.928 2.174.539.446 1.236.67 2.092.67.947 0 1.811-.15 2.588-.453l.334 1.479c-.908.396-1.98.593-3.217.593-1.488 0-2.656-.438-3.506-1.312-.848-.875-1.273-2.051-1.273-3.524 0-1.446.395-2.651 1.186-3.612.828-1.026 1.947-1.539 3.355-1.539 1.383 0 2.43.513 3.141 1.539.563.813.846 1.821.846 3.018zm-2.033-.553c.015-.633-.125-1.178-.414-1.639-.369-.594-.937-.89-1.698-.89-.697 0-1.265.289-1.697.869-.355.461-.566 1.015-.631 1.658l4.44.002z"
                      />
                    </g>

                    <g fill="#FFF">
                      <path
                        d="M45.211 13.491c-.593 0-1.106-.029-1.533-.078V6.979a11.606 11.606 0 0 1 1.805-.136c2.445 0 3.571 1.203 3.571 3.164 0 2.262-1.33 3.484-3.843 3.484zm.358-5.823c-.33 0-.611.02-.844.068v4.891c.126.02.368.029.708.029 1.602 0 2.514-.912 2.514-2.62 0-1.523-.825-2.368-2.378-2.368zM52.563 13.54c-1.378 0-2.271-1.029-2.271-2.426 0-1.456.912-2.494 2.349-2.494 1.358 0 2.271.98 2.271 2.417 0 1.474-.941 2.503-2.349 2.503zm.04-4.154c-.757 0-1.242.708-1.242 1.698 0 .971.495 1.679 1.232 1.679s1.232-.757 1.232-1.699c0-.96-.485-1.678-1.222-1.678zM62.77 8.717l-1.475 4.716h-.961l-.611-2.048a15.53 15.53 0 0 1-.379-1.523h-.02c-.077.514-.223 1.029-.378 1.523l-.65 2.048h-.971l-1.388-4.716h1.077l.534 2.242c.126.534.232 1.038.32 1.514h.02c.077-.397.203-.893.388-1.504l.67-2.251h.854l.641 2.203c.155.534.281 1.058.379 1.553h.028c.068-.485.175-1 .32-1.553l.573-2.203 1.029-.001zM68.2 13.433h-1.048v-2.708c0-.834-.32-1.252-.951-1.252-.621 0-1.048.534-1.048 1.155v2.805h-1.048v-3.368c0-.417-.01-.864-.039-1.349h.922l.049.728h.029c.282-.504.854-.824 1.495-.824.99 0 1.64.757 1.64 1.989l-.001 2.824zM71.09 13.433h-1.049v-6.88h1.049v6.88zM74.911 13.54c-1.377 0-2.271-1.029-2.271-2.426 0-1.456.912-2.494 2.348-2.494 1.359 0 2.271.98 2.271 2.417.001 1.474-.941 2.503-2.348 2.503zm.039-4.154c-.757 0-1.242.708-1.242 1.698 0 .971.496 1.679 1.231 1.679.738 0 1.232-.757 1.232-1.699.001-.96-.483-1.678-1.221-1.678zM81.391 13.433l-.076-.543h-.028c-.32.437-.787.65-1.379.65-.845 0-1.445-.592-1.445-1.388 0-1.164 1.009-1.766 2.756-1.766v-.087c0-.621-.329-.932-.979-.932-.465 0-.873.117-1.232.35l-.213-.689c.436-.272.98-.408 1.619-.408 1.232 0 1.854.65 1.854 1.951v1.737c0 .476.021.845.068 1.126l-.945-.001zm-.144-2.349c-1.164 0-1.748.282-1.748.951 0 .495.301.737.719.737.533 0 1.029-.407 1.029-.96v-.728zM87.357 13.433l-.049-.757h-.029c-.301.572-.807.864-1.514.864-1.137 0-1.979-1-1.979-2.407 0-1.475.873-2.514 2.065-2.514.631 0 1.078.213 1.33.641h.021V6.553h1.049v5.609c0 .456.011.883.039 1.271h-.933zm-.155-2.775c0-.66-.437-1.223-1.104-1.223-.777 0-1.252.689-1.252 1.659 0 .951.493 1.602 1.231 1.602.659 0 1.125-.573 1.125-1.252v-.786zM94.902 13.54c-1.377 0-2.27-1.029-2.27-2.426 0-1.456.912-2.494 2.348-2.494 1.359 0 2.271.98 2.271 2.417.001 1.474-.94 2.503-2.349 2.503zm.039-4.154c-.756 0-1.241.708-1.241 1.698 0 .971.495 1.679 1.231 1.679.738 0 1.232-.757 1.232-1.699.002-.96-.483-1.678-1.222-1.678zM102.887 13.433h-1.049v-2.708c0-.834-.32-1.252-.951-1.252-.621 0-1.047.534-1.047 1.155v2.805h-1.049v-3.368c0-.417-.01-.864-.039-1.349h.922l.049.728h.029c.281-.504.854-.825 1.494-.825.99 0 1.641.757 1.641 1.989v2.825zM109.938 9.503h-1.153v2.29c0 .583.202.874.61.874.185 0 .34-.02.465-.049l.029.796c-.203.078-.475.117-.813.117-.826 0-1.32-.456-1.32-1.65V9.503h-.688v-.786h.688v-.864l1.029-.311v1.174h1.153v.787zM115.486 13.433h-1.047v-2.688c0-.844-.319-1.271-.951-1.271-.543 0-1.049.369-1.049 1.116v2.843h-1.047v-6.88h1.047v2.833h.021c.33-.514.808-.767 1.418-.767.998 0 1.608.776 1.608 2.009v2.805zM121.17 11.327h-3.145c.02.893.611 1.397 1.486 1.397.465 0 .893-.078 1.271-.223l.163.728c-.446.194-.971.291-1.582.291-1.475 0-2.348-.932-2.348-2.377 0-1.446.894-2.533 2.23-2.533 1.205 0 1.961.893 1.961 2.242a2.02 2.02 0 0 1-.036.475zm-.961-.747c0-.728-.367-1.242-1.037-1.242-.602 0-1.078.524-1.146 1.242h2.183z"
                      />
                    </g>
                  </g>
                </svg>
              </div>
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
