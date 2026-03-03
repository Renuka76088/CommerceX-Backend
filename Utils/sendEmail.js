import nodemailer from "nodemailer";

export const sendEmail = async (to, otp) => {
  // Debugging: Sirf logs check karne ke liye
  console.log("Attempting to send email to:", to);
  console.log("Using Gmail User:", process.env.GMAIL);

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Port aur Host ki jhanjhat khatam
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
    // Production ke liye optimized timeouts
    connectionTimeout: 20000, 
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"CommerceX" <${process.env.GMAIL}>`,
      to,
      subject: "OTP Verification",
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>CommerceX Verification</h2>
          <p>Your OTP for login is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Nodemailer Error:", err.message);
    throw err; 
  }
};