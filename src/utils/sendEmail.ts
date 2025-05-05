import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/env";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  const subject = "Your One-Time Password (OTP)";

  const plainText = `
Hello,

Your One-Time Password (OTP) is: ${otp}

This OTP is valid for 5 minutes. Please do not share it with anyone.

If you didn't request this email, you can ignore it.

Thank you,
Team MCG
  `;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #2c3e50;">🔐 Login OTP</h2>
    <p>Hello,</p>
    <p>Use the following One-Time Password (OTP) to complete your login:</p>
    <div style="font-size: 24px; font-weight: bold; color: #1a73e8; margin: 20px 0;">
      ${otp}
    </div>
    <p>This OTP is valid for <strong>5 minutes</strong>. Please keep it confidential.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
    <p style="font-size: 12px; color: #888;">This is a one-time email for verification purposes. No further action is required.</p>
    <p style="color: #555;">Thank you,<br/>Team MCG</p>
  </div>
  `;

  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject,
    text: plainText,
    html: htmlContent,
    headers: {
      "X-Priority": "3",
    },
  });
}
