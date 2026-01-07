const mailOptions = {
  from: `JobLink <${process.env.EMAIL_FROM}>`,
  to: email,
  subject,
  html,
};
