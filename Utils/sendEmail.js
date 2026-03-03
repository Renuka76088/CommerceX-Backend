import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    // Method A: Direct SMTP Host with Port 465 (More stable for cloud)
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    // Timeout handling
    connectionTimeout: 15000, 
    socketTimeout: 15000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to,
      subject: "Your Verification Code",
      html: `<h1>OTP: ${otp}</h1>`,
    });
    console.log("✅ Mail Sent!");
    return info;
  } catch (err) {
    console.error("❌ Email Failed:", err.message);
    
    // Agar 465 fail ho, toh backup ke liye 587 try karega (Sirf debug ke liye)
    throw err;
  }
};