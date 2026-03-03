import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  // Debugging: Console mein check karein values aa rahi hain ya nahi
  console.log("Email User:", process.env.GMAIL); 
  console.log("Pass exists:", !!process.env.PASSWORD); 

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Skinnveda" <${process.env.GMAIL}>`,
      to,
      subject: "OTP Verification",
      html: `<h1>Your OTP: ${otp}</h1>`,
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Nodemailer Error Inside sendEmail:", err);
    throw err; 
  }
};