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
  name: "Tiktok Downloader",
  case: ["tiktok"],
  description: "Download video TikTok tanpa watermark.",
  hidden: false,

  owner: false,
  group: false,
  private: false,
};

export default async function handler(leni) {
  const { q, LenwyText, LenwyWait, LenwyVideo } = leni;

  const tiktokRegex = /^(https?:\/\/)?(www\.|vt\.|vm\.)?tiktok\.com\/.+/i;

  if (!q) {
    return LenwyText(
      "⚠️ <b>Mana link TikToknya?</b>\n\nContoh:\n/tiktok https://www.tiktok.com/...",
    );
  }

  if (!tiktokRegex.test(q.trim())) {
    return LenwyText("❌ <b>Link TikTok tidak valid.</b>");
  }

  await LenwyWait();

  try {
    const encodedUrl = encodeURIComponent(q.trim());

    const apiUrl = `https://api.makota.asia/api/v1/scrape/downloader/tiktok?url=${encodedUrl}`;

    const { data: response } = await axios.get(apiUrl, {
      headers: {
        accept: "application/json",
        "Makota-API": globalThis.makota,
      },
      timeout: 30000,
    });

    if (!response?.ok || !response?.data?.no_watermark) {
      return LenwyText("❌ <b>Gagal:</b> Video TikTok tidak dapat diunduh.");
    }

    const videoUrl = response.data.no_watermark;

    return LenwyVideo(
      videoUrl,
      `🎁 <b>Lenwy Tiktok Downloader</b>\n<b>[+] Powered by api.makota.asia</b>`,
    );
  } catch (error) {
    console.error("TTDL Error:", error?.response?.data || error.message);

    return LenwyText("❌ <b>Gagal mengunduh video TikTok.</b>");
  }
}
