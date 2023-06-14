import { NextResponse } from "next/server";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const bot = new Telegraf("6158245428:AAFdpU5fqscxDJQ4J6907TgxWyooqXioXvU");
  bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/messages");
  bot.start((ctx) => ctx.reply("Welcome"));
  bot.help((ctx) =>
    ctx.reply("Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );
  bot.on("sticker", (ctx) => ctx.reply("👍"));
  bot.on("text", (ctx) => {
    // Explicit usage
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Has elegido ${ctx.message.text}`
    );

    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `El ChatId es: ${ctx.message.chat.id}`
    );

    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `El FromId es: ${ctx.message.from.id}`
    );

    // Using context shortcut
    //ctx.reply(`Hello ${ctx.state.role}`);
  });

  bot.on("text", (ctx) => {
    // Explicit usage
    ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

    // Using context shortcut
    ctx.reply(`Hello ${ctx.state.role}`);
  });

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return NextResponse.json({ data });
}
/*export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const result = await fetch("https://api-colombia.com/api/v1/Department");
      res.status(200).json(result.json());
    } else {
      const result = await fetch("https://api-colombia.com/api/v1/Department");
      res.status(200).json(result.json());
    }
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}*/
