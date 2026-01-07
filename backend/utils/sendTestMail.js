import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendTestMail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: "✅ Test gửi mail JobLink",
    html: `
      <h2>Gửi mail thành công 🎉</h2>
      <p>Nếu bạn nhận được mail này nghĩa là cấu hình Gmail OK.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📧 Test email gửi thành công");
};

sendTestMail();
