import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 🔴 Validate env early (fail fast)
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env");
}

// 🔴 Create transporter with debug
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,   // shows SMTP logs
  debug: true,    // shows communication
});

// 🔴 Verify connection once at startup
export const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP is ready");
  } catch (err) {
    console.error("❌ SMTP verification failed:");
    console.error(err);
  }
};

// 🔴 Send email with proper logging + return value
export const sendEmail = async (to, subject, text) => {
  try {
    console.log("📨 Attempting to send email to:", to);

    const info = await transporter.sendMail({
      from: `"CFTracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully");
    console.log("Response:", info.response);

    return info;

  } catch (err) {
    console.error("❌ Email sending failed:");
    console.error(err);
    throw err; // important so caller knows it failed
  }
};
