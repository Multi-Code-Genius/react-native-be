import { ULTRAMSG_INSTANCE_ID, ULTRAMSG_TOKEN } from "./env";

const axios = require("axios");

const sendWhatsAppMessage = async (to: string, message: string) => {
  if (!ULTRAMSG_INSTANCE_ID || !ULTRAMSG_TOKEN) {
    throw new Error("ULTRAMSG_INSTANCE_ID and ULTRAMSG_TOKEN are required");
  }

  try {
    const response = await axios.post(
      `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`,
      {
        token: ULTRAMSG_TOKEN,
        to: `91${to}`,
        body: message,
        priority: 10,
        referenceId: "auto-booking-msg",
      }
    );
    console.log(`Message sent to ${to}`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to send message to ${to}`,
      (error as any).response?.data || (error as any).message
    );
  }
};

export default sendWhatsAppMessage;
