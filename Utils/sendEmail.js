import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Shuruat mein yahi rehne dein
      to: to,
      subject: 'OTP Verification',
      html: `<h1>Your OTP: ${otp}</h1>`,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      throw error;
    }

    console.log("✅ Email sent via Resend API:", data.id);
  } catch (err) {
    console.error("❌ Final Failure:", err.message);
    throw err;
  }
};