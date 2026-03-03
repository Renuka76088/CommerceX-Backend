import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    // smtp.gmail.com ka direct IPv4 address use kar rahe hain
    host: "74.125.130.108", 
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    // SSL/TLS issues se bachne ke liye
    tls: {
      servername: "smtp.gmail.com", // Google verify karega ki ye wahi server hai
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to,
      subject: "OTP Verification",
      html: `<h1>Your OTP: ${otp}</h1>`,
    });
    console.log("✅ Email sent successfully via IPv4 Direct");
    return info;
  } catch (err) {
    console.error("❌ Final Attempt Error:", err.message);
    throw err;
  }
};