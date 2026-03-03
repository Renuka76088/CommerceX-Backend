import nodemailer from "nodemailer";

// Transporter ko bahar banayein taaki baar-baar naya connection na banana pade
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true, // Speed badhane ke liye
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
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
    console.log("✅ Email sent successfully to:", to);
    return info;
  } catch (err) {
    console.error("❌ Nodemailer Error Inside sendEmail:", err.message);
    // Yahan throw mat kariyega agar background mein bhej rahe hain
  }
};