import nodemailer from "nodemailer";

const sendResetPasswordEmail = async (toEmail, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "🔐 Đặt lại mật khẩu JobLink",
    html: `
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Nhấn vào link bên dưới để tạo mật khẩu mới (có hiệu lực 15 phút):</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
