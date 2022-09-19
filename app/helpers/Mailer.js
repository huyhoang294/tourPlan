import nodemailer from "nodemailer";
import _ from "lodash";
import * as dotenv from 'dotenv';
dotenv.config();
var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: true,
  auth: {
    user: "huyhoang29497@gmail.com",
    pass: "ziucdxbnycgafmvr"
  }
});

var defaultMail = {
  from: 'huyhoang29497@gmail.com',
  text: 'test'
}

export const send = (to, subject, html) => {
  var mail = _.merge({html}, defaultMail, to)

  transport.sendMail(mail, function(error, info) {
    if (error) return console.log(error);
    console.log("Mail sent", info.response);
  })
}