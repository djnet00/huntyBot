import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  await bot.telegram.deleteWebhook();
  await bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/webhook");
  await bot.telegram.getWebhookInfo().then(console.log);

  return NextResponse.json({ message: "Webhook setted" });
}

export async function POST(request) {
  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const prisma = new PrismaClient();

  let messageText = "";

  const bot = new Telegraf(process.env.BOT_TOKEN);

  //return NextResponse.json({ message: "Webhook setted" });

  /*await bot.telegram.setMyCommands([
    { command: "/start", description: "Iniciar el bot" },
    { command: "/help", description: "Solicitar ayuda" },
  ]);*/

  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));

  bot.help((ctx) =>
    ctx.reply("ℹ️ Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );
  bot.on("text", async (ctx) => {
    const depto = ctx.message.text;

    let chatId = 0;

    if (ctx.message.chat?.id > 0) {
      chatId = ctx.message.chat.id;
    } else {
      chatId = ctx.from.id;
    }

    await prisma.message.create({
      data: {
        username: ctx.from.username,
        messageId: ctx.message.message_id,
        chatId: chatId,
        message: depto,
        type: "USER",
      },
    });

    const result = data.find((row) => row.name === depto);

    if (!result) {
      messageText = `❌ No se encontraron resultados para el departamento *${depto}*, verifica que esté bien escrito.`;
      ctx.reply(messageText);
      ctx.reply(`ℹ️ Si necesitas ayuda puedes solicitarla escribiendo /help.`);
    } else {
      messageText = `✅ Excelente, aquí tienes la información de ${result.name}:`;
      ctx.reply(messageText);

      ctx.reply(result.description);
    }

    await prisma.message.create({
      data: {
        username: ctx.from.username,
        messageId: ctx.message.message_id,
        chatId: chatId,
        message: messageText,
        type: "BOT",
      },
    });
  });

  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  return NextResponse.json({ message: null });
}
