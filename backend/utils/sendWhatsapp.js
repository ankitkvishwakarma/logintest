import axios from "axios";

export async function sendWhatsappMessage(message) {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: process.env.GROUP_ID,   // Group JID
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.log("WhatsApp Error:", error.response?.data || error);
  }
}
