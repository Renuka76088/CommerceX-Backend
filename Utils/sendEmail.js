import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 ke liye true
  pool: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
  // Railway/Cloud environment ke liye ye settings bohot zaroori hain
  tls: {
    rejectUnauthorized: false, // SSL verification issues bypass karne ke liye
    minVersion: 'TLSv1.2'
  },
  connectionTimeout: 10000, // 10 seconds tak wait karega connection ka
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
          <p>Your verification code is: <strong style="color: #4CAF50;">${otp}</strong></p>
        </div>
      `,
    });
    console.log("✅ Actual Delivery Success:", info.response);
    return info;
  } catch (err) {
    // Ye error aapko Railway ke "Logs" tab mein dikhega
    console.error("❌ REAL ERROR IN BACKGROUND:", err.message);
  }
};