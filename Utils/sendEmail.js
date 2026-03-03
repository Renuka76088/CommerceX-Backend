import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ye sabse stable hai live servers ke liye
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD, // Aapka 16-digit App Password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to: to, // Ab isme koi bhi email (anup, renuka, etc.) daal sakte hain
      subject: "OTP Verification - CommerceX",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Welcome to CommerceX</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully to:", to);
    return info;
  } catch (err) {
    console.error("❌ Nodemailer Error:", err.message);
    throw err;
  }
};