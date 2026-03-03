import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL use karein
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    // 🔥 YE SABSE IMPORTANT HAI: IPv4 force karne ke liye
    family: 4, 
    connectionTimeout: 20000,
    greetingTimeout: 20000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to,
      subject: "OTP Verification",
      html: `<h1>Your OTP: ${otp}</h1>`,
    });
    console.log("✅ Email sent successfully using IPv4");
    return info;
  } catch (err) {
    // Agar 465 fail ho, toh logs mein details dikhegi
    console.error("❌ Email Error:", err.message);
    throw err;
  }
};