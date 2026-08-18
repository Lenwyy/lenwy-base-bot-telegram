import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const commands = new Map();

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m  ${msg}`),
  ok: (msg) => console.log(`\x1b[32m[OK]\x1b[0m    ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m  ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERR]\x1b[0m   ${msg}`),
  msg: (user, text) => console.log(`\x1b[35m[MSG]\x1b[0m   @${user} → ${text}`),
  cb: (user, data) => console.log(`\x1b[34m[BTN]\x1b[0m   @${user} → ${data}`),
};

export async function loadCommands() {
  commands.clear();

  const caseDir = path.join(__dirname, "case");

  if (!fs.existsSync(caseDir)) {
    log.warn("Folder case tidak ditemukan.");
    return;
  }

  const categories = fs
    .readdirSync(caseDir)
    .filter((name) => {
      return fs.statSync(path.join(caseDir, name)).isDirectory();
    })
    .sort((a, b) => a.localeCompare(b));

  for (const category of categories) {
    const categoryDir = path.join(caseDir, category);

    const files = fs
      .readdirSync(categoryDir)
      .filter((file) => file.endsWith(".js"))
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      const filePath = path.join(categoryDir, file);

      try {
        const mod = await import(`${filePath}?t=${Date.now()}`);

        if (!mod.info || !mod.default || !Array.isArray(mod.info.case)) {
          continue;
        }

        for (const command of mod.info.case) {
          commands.set(command.toLowerCase(), {
            info: mod.info,
            handler: mod.default,
            callback: mod.callback,
            category,
            file: `${category}/${file}`,
          });
        }

        log.ok(`${category}/${file}`);
      } catch (err) {
        log.error(`Failed to load ${category}/${file} — ${err.message}`);
      }
    }
  }

  log.info(`Total commands: ${commands.size}`);
}

export function makeLeni(ctx, bot, command = "", q = "") {
  const isOwner = globalThis.tgOwner.includes(String(ctx.from.id));
  const isGroup = ["group", "supergroup"].includes(ctx.chat.type);
  const isPrivate = ctx.chat.type === "private";
  const isCallback = !!ctx.callbackQuery;

  const reply = (text, extra = {}) => {
    if (isCallback) {
      return ctx.editMessageCaption(text, {
        parse_mode: "HTML",
        ...extra,
      });
    }

    return ctx.reply(text, {
      parse_mode: "HTML",
      ...extra,
    });
  };

  return {
    ctx,
    bot,

    command,
    q,

    sender: String(ctx.from.id),
    chatId: ctx.chat.id,

    isOwner,
    isGroup,
    isPrivate,
    isCallback,

    backButton: (callback = "start:back") => ({
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: callback }]],
      },
    }),

    LenwyText: (text, extra = {}) => reply(text, extra),

    LenwyWait: () => reply(globalThis.tgMess.wait),

    LenwyImage: (url, caption = "", extra = {}) =>
      ctx.replyWithPhoto(url, {
        caption,
        parse_mode: "HTML",
        ...extra,
      }),

    LenwyVideo: (url, caption = "", extra = {}) =>
      ctx.replyWithVideo(url, {
        caption,
        parse_mode: "HTML",
        ...extra,
      }),

    LenwyAudio: (url, extra = {}) => ctx.replyWithAudio(url, extra),
  };
}

async function executeCommand(ctx, bot, command, q = "") {
  const found = commands.get(command);

  if (!found) return false;

  const { info, handler } = found;
  const leni = makeLeni(ctx, bot, command, q);

  if (info.owner && !leni.isOwner) {
    await ctx.reply(globalThis.tgMess.owner);
    return true;
  }

  if (info.group && !leni.isGroup) {
    await ctx.reply(globalThis.tgMess.group);
    return true;
  }

  if (info.private && !leni.isPrivate) {
    await ctx.reply(globalThis.tgMess.private);
    return true;
  }

  try {
    await handler(leni);
  } catch (err) {
    log.error(`/${command} — ${err.message}`);
    await ctx.reply(globalThis.tgMess.error);
  }

  return true;
}

async function executeCallback(ctx, bot, data) {
  const [command, ...actionParts] = data.split(":");
  const action = actionParts.join(":");

  const found = commands.get(command.toLowerCase());

  if (!found?.callback) {
    return false;
  }

  const leni = makeLeni(ctx, bot, command, "");

  try {
    await found.callback(leni, action);
  } catch (err) {
    log.error(`callback:${data} — ${err.message}`);
    await ctx.reply(globalThis.tgMess.error);
  }

  return true;
}

export function handleMessage(bot) {
  bot.on("text", async (ctx) => {
    const text = ctx.message?.text || "";
    const username = ctx.from.username || String(ctx.from.id);

    log.msg(username, text);

    if (!text.startsWith("/")) return;

    const [rawCommand, ...args] = text.slice(1).trim().split(/\s+/);

    if (!rawCommand) return;

    const command = rawCommand.toLowerCase().split("@")[0];
    const q = args.join(" ").trim();

    await executeCommand(ctx, bot, command, q);
  });

  bot.on("callback_query", async (ctx) => {
    const data = ctx.callbackQuery?.data;

    if (!data) return;

    const username = ctx.from.username || String(ctx.from.id);

    await ctx.answerCbQuery();
    log.cb(username, data);

    if (await executeCallback(ctx, bot, data)) {
      return;
    }

    await executeCommand(ctx, bot, data.toLowerCase());
  });

  const caseDir = path.join(__dirname, "case");

  if (fs.existsSync(caseDir)) {
    fs.watch(caseDir, { recursive: true }, async (event, filename) => {
      if (!filename?.endsWith(".js")) return;

      log.warn(`File changed: ${filename}`);

      try {
        await loadCommands();
        log.ok("Commands reloaded!");
      } catch (err) {
        log.error(`Reload failed — ${err.message}`);
      }
    });
  }
}
