/*
  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini
*/

import axios from "axios";

export const info = {
  name: "AI Chat",
  case: ["ai"],
  description: "Chat dengan AI untuk bertanya atau meminta penjelasan.",
  hidden: false,

  owner: false,
  group: false,
  private: false,
};

export default async function handler(leni) {
  const { q, LenwyText, LenwyWait } = leni;

  if (!q) {
    return LenwyText("☘️ <b>Contoh:</b>\n/ai Apa itu JavaScript?");
  }

  await LenwyWait();

  try {
    const prompt = q.trim();

    const endpoint = `https://api.makota.asia/api/v1/scrape/ai/hotbot?prompt=${encodeURIComponent(prompt)}`;

    const { data: response } = await axios.get(endpoint, {
      headers: {
        accept: "application/json",
        "Makota-API": globalThis.makota,
      },
      timeout: 20000,
    });

    if (!response?.ok || !response.data?.result) {
      return LenwyText("❌ <b>Gagal:</b> AI tidak memberikan balasan.");
    }

    const aiResult = response.data.result;

    return LenwyText(`☘️ <b>Lenwy AI</b>\n\n${aiResult}`);
  } catch (error) {
    console.error("AI Error:", error?.response?.data || error.message);

    return LenwyText("❌ <b>Terjadi kesalahan saat menghubungi AI.</b>");
  }
}
