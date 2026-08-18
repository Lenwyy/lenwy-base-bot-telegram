import { commands } from "../../handler.js";

export const info = {
  name: "Start",
  case: ["start"],
  description: "Halaman utama bot",
  hidden: false,
  owner: false,
  group: false,
  private: false,
};

function getCaption(leni) {
  const { ctx, isOwner } = leni;
  const name = ctx.from.first_name || "User";

  return `<blockquote>☘️ <b>Lenwy SCM
Telegram Bot To Solve Your Problems</b>

Halo, <b>${name}</b>
<b>[+] Role : ${isOwner ? "Owner" : "User"}</b>

📑 <b>Information Bot
Developer : Shannyiee
Owner : Lenwy
Contact : wa.me/6283829814737
Youtube Channel : Lenwy</b></blockquote>`;
}

function getStartKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "Menu",
          callback_data: "start:menu",
        },
      ],
    ],
  };
}

function getMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "Back",
          callback_data: "start:back",
        },
      ],
    ],
  };
}

function getMenuText() {
  const categories = new Map();

  for (const [, command] of commands) {
    const { info, category } = command;

    if (info.hidden) continue;

    if (!categories.has(category)) {
      categories.set(category, []);
    }

    categories.get(category).push(info);
  }

  const sortedCategories = [...categories.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  let text = "<b>Daftar Menu</b>\n";

  for (const [category, infos] of sortedCategories) {
    const sortedCommands = [...infos].sort((a, b) => {
      return a.case[0].localeCompare(b.case[0]);
    });

    text += `\n<b>[${category}]</b>\n`;

    for (const info of sortedCommands) {
      text += `/${info.case[0]}\n`;
    }
  }

  return text;
}

export default async function handler(leni) {
  const caption = getCaption(leni);

  if (leni.isCallback) {
    return leni.ctx.editMessageCaption(caption, {
      parse_mode: "HTML",
      reply_markup: getStartKeyboard(),
    });
  }

  return leni.ctx.replyWithPhoto(
    { url: "https://files.catbox.moe/qwtejb.jpg" },
    {
      caption,
      parse_mode: "HTML",
      reply_parameters: {
        message_id: leni.ctx.message.message_id,
        quote: leni.ctx.message.text,
      },
      reply_markup: getStartKeyboard(),
    },
  );
}

export async function callback(leni, action) {
  if (action === "menu") {
    return leni.ctx.editMessageCaption(getMenuText(), {
      parse_mode: "HTML",
      reply_markup: getMenuKeyboard(),
    });
  }

  if (action === "back") {
    return handler(leni);
  }
}
