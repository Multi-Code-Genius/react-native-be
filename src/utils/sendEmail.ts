import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `Jay <${EMAIL_USER}>`,
    to: email,
    subject: "Your One-Time Password (OTP) for Login",
    text: `Your OTP is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2c3e50;">🔐 Your Login OTP</h2>
        <p>Hello,</p>
        <p>Use the following One-Time Password (OTP) to verify your login:</p>
        <div style="font-size: 24px; font-weight: bold; color: #1a73e8; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <br />
        <p style="color: #555;">Thank you,<br/>Team MCG</p>
      </div>
    `,
    headers: {
      "X-Priority": "1 (Highest)",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
  });
}
