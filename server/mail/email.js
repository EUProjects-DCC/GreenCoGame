const nodemailer = require("nodemailer");
const { log, saveEvent } = require("../utils/logger");
require('dotenv').config();

// SMTP server connection configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER, // SMTP server
  port: process.env.SMTP_PORT, // SMTP connection port
  secure: true , //SSL/TLS
  auth: {
    user: process.env.EMAIL_USER, // Email address
    pass: process.env.EMAIL_PASSWORD // Password
  }
});

// Define the e-mail you want to send
const sendEmail = (user_id, user_email, email_subject, message, start_date, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // email sender
    to: user_email, // email receiver
    subject: email_subject, // Email subject
    html: message, // Email text in HTML format
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      log('emain/sendMail Error', error)
      res.status(400).json({
        error: 'Error while sending email',
      });
    } 
    else {
      const end_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      saveEvent(user_id, start_date, end_date, "reset password_email");
      res.status(200).json({
        message: 'Email sent successfully',
      });
    }
  });
};

module.exports = { sendEmail };