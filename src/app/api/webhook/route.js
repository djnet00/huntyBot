import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");

export async function GET(request) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));

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
  bot.on(message("text"), async (ctx) => {
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

  // Start webhook via launch method (preferred)
  bot.launch({
    webhook: {
      // Public domain for webhook; e.g.: example.com
      domain: "https://hunty-bot.vercel.app",
      hookPath: "/api/webhook",
      secretToken: "",
    },
  });

  return NextResponse.json({ message: null });
}
