import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  pool: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
  // 🔥 YE DO LINES SABSE ZAROORI HAIN 🔥
  family: 4, // Sirf IPv4 use karne ke liye force karega
  address: "0.0.0.0", 
  
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
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Welcome to CommerceX</h2>
          <p>Your verification code is: <strong style="color: #4CAF50; font-size: 24px;">${otp}</strong></p>
          <p>This code is valid for 5 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email Delivered Successfully:", info.response);
    return info;
  } catch (err) {
    // Ab yahan ENETUNREACH nahi aana chahiye
    console.error("❌ Final Debug Error:", err.message);
  }
};