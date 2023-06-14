import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");

/**
 * Say hello from webhook bot
 * @param {*} request
 * @returns
 */
export async function GET(request) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));

  return NextResponse.json({ message: "Webhook setted" });
}

/**
 * POST request from webhook bot, save message in database
 * @param {*} request
 * @returns
 */
export async function POST(request) {
  // Get departments from API
  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  // Get database connection
  const prisma = new PrismaClient();

  let messageText = "";

  // Create bot instance
  const bot = new Telegraf(process.env.BOT_TOKEN);

  // Set commands
  await bot.telegram.setMyCommands([
    { command: "/start", description: "Iniciar el bot" },
    { command: "/help", description: "Solicitar ayuda" },
  ]);

  // Set start command
  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));

  // Set help command
  bot.help((ctx) =>
    ctx.reply("ℹ️ Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );

  // Set message command
  bot.on(message("text"), async (ctx) => {
    const depto = ctx.message.text;

    let chatId = 0;

    if (ctx.message.chat?.id > 0) {
      chatId = ctx.message.chat.id;
    } else {
      chatId = ctx.from.id;
    }

    // Save initial message in database
    await prisma.message.create({
      data: {
        username: ctx.from.username,
        messageId: ctx.message.message_id,
        chatId: chatId,
        message: depto,
        type: "USER",
      },
    });

    // Find department in API
    const result = data.find((row) => row.name === depto);

    // If department not found
    if (!result) {
      messageText = `❌ No se encontraron resultados para el departamento *${depto}*, verifica que esté bien escrito.`;
      ctx.reply(messageText);
      ctx.reply(`ℹ️ Si necesitas ayuda puedes solicitarla escribiendo /help.`);
    }
    // If department found
    else {
      messageText = `✅ Excelente, aquí tienes la información de ${result.name}:`;
      ctx.reply(messageText);

      ctx.reply(result.description);
    }

    // Save response message in database
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
  await bot.launch();

  // Start webhook via startPolling method
  return NextResponse.json({ message: null });
}
