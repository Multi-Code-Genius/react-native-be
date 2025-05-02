// utils/sendSmsOtp.js
const axios = require("axios");

const GATEWAY_URL = "http://192.168.1.11:8082/v1/sms/send";
const AUTH_TOKEN =
  "f2-tkDsuR6a_P5FWk1EUNS:APA91bEtb2GjLqwtty5jmazfGZ8rpBfJXHW8x2bNk7nPELKFKHwX5UtWtVLR7McSIzl6JQf3_gRX6Aj22cFGKn3AOREHMXXhe07KFFPtNRzMZQ32PzO86B8"; // Replace with your actual token

export async function sendSmsOtp(toPhone: any, message: any) {
  try {
    const res = await axios.post(
      GATEWAY_URL,
      {
        phone_number: toPhone,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("Failed to send SMS:", err.message);
    throw err;
  }
}

module.exports = sendSmsOtp;
