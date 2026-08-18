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

import chalk from "chalk";
import figlet from "figlet";

const logo = figlet.textSync("Lenwy", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: Math.min(process.stdout.columns || 80, 50),
  whitespaceBreak: false,
});

console.log(chalk.blue.bold(logo));

console.log(
  chalk.white.bold(`
${chalk.green.bold("📃  Informasi :")}
✉️  Script Lenwy Rebuild
✉️  Author : Lenwy
✉️  Gmail : ilenwyy@gmail.com
✉️  Instagram : Ilenwy_
✉️  Youtube : Lenwy
🎁  Base : Lenwy

${chalk.green.bold("🎁  Subscribe Lenwy :D")}
`),
);

try {
  console.log(chalk.green.bold("🎁  Menjalankan Bot Telegram\n"));

  const { default: startTelegram } = await import("./Telegram/index.js");

  await startTelegram();
} catch (err) {
  console.error(chalk.red.bold(`\n⚠️  Terjadi Kesalahan: ${err.message}\n`));
}
