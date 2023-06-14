import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const prisma = new PrismaClient();

  let messageText = "";

  const bot = new Telegraf(process.env.BOT_TOKEN);

  //await bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/messages");

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

    await prisma.message.create({
      data: {
        username: ctx.from.username,
        messageId: ctx.message.message_id,
        chatId: ctx.message.chat.id,
        message: depto,
        type: "USER",
      },
    });

    const result = await data.find((row) => row.name === depto);

    if (!result) {
      messageText = `❌ No se encontraron resultados para el departamento *${depto}*, verifica que esté bien escrito.`;
      bot.telegram.sendMessage(ctx.message.chat.id, message);
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `ℹ️ Si necesitas ayuda puedes solicitarla escribiendo /help.`
      );
    } else {
      messageText = `✅ Excelente, aquí tienes la información de ${result.name}:`;
      await bot.telegram.sendMessage(ctx.message.chat.id, message);

      await bot.telegram.sendMessage(ctx.message.chat.id, result.description);
    }

    await prisma.message.create({
      data: {
        username: ctx.from.username,
        messageId: ctx.message.message_id,
        chatId: ctx.message.chat.id,
        message: messageText,
        type: "BOT",
      },
    });
  });

  await bot.launch();

  const messages = await prisma.message.findMany();

  return NextResponse.json({ messages });
}
