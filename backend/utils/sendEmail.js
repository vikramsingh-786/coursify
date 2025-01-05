const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  
  if (!email) {
    throw new Error('Recipient email is required');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `FROM EDUTECH LEARNING <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,  
    subject: subject,
    text: message,
  });
};


module.exports = sendEmail;
