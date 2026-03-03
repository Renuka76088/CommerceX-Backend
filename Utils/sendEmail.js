import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Port 465 ke liye true
  pool: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
  // IPv6 ko bypass karne ke liye specific family configuration
  family: 4, 
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000, 
});

export const sendEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to: to,
      subject: "OTP Verification - CommerceX",
      html: `<b>Your OTP is: ${otp}</b>`,
    });
    console.log("✅ Actual Delivery Success:", info.response);
  } catch (err) {
    console.error("❌ Final Debug Error:", err.message);
    // Is error message ko dhyan se dekhna agar abhi bhi IPv6 wala lamba address dikhe
  }
};