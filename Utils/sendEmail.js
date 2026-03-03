import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // Pool use karne se connection open rehta hai aur fast response milta hai
    pool: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    // TLS settings production ke liye
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Timeout handle karne ke liye hum ise wrap kar sakte hain
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to,
      subject: "Verification Code",
      text: `Your OTP is ${otp}`,
      html: `<b>Your OTP: ${otp}</b>`,
    });
    
    console.log("✅ Mail Sent Success!");
    return info;
  } catch (err) {
    console.error("❌ Mail Error:", err.message);
    throw err;
  }
};