import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"CommerceX" <${process.env.EMAIL_USER}>`,
    to,
    subject: "CommerceX OTP Verification",
    html: `
      <div style="font-family: Arial; padding:20px">
        <h2>CommerceX Login</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:3px">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
  });
};