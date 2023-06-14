import { NextResponse } from "next/server";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const bot = new Telegraf("6158245428:AAFdpU5fqscxDJQ4J6907TgxWyooqXioXvU");
  bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/messages");

  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));
  bot.help((ctx) =>
    ctx.reply("ℹ️ Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );
  bot.on("text", (ctx) => {
    const depto = ctx.message.text;

    const result = data.find((row) => row.name === depto);

    if (!result) {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `❌ No se encontraron resultados para el departamento *${depto}*, verifica que esté bien escrito.`
      );
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `ℹ️ Si necesitas ayuda puedes solicitarla escribiendo /help.`
      );
    } else {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `✅ Excelente, aquí tienes la información de ${result.name}:`
      );

      bot.telegram.sendMessage(ctx.message.chat.id, result.description);
    }
  });

  bot.launch();

  return NextResponse.json({ message: "ok" });
}

export async function POST(request) {
  const res = await fetch("https://api-colombia.com/api/v1/Department", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  const bot = new Telegraf("6158245428:AAFdpU5fqscxDJQ4J6907TgxWyooqXioXvU");
  bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/messages");

  bot.telegram.setMyCommands([
    { command: "/start", description: "Iniciar el bot" },
    { command: "/help", description: "Solicitar ayuda" },
  ]);

  bot.start((ctx) => ctx.reply("ℹ️ Bienvenidos al bot de Hunty!"));
  bot.help((ctx) =>
    ctx.reply("ℹ️ Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );
  bot.on("text", (ctx) => {
    const depto = ctx.message.text;

    const result = data.find((row) => row.name === depto);

    if (!result) {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `❌ No se encontraron resultados para el departamento *${depto}*, verifica que esté bien escrito.`
      );
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `ℹ️ Si necesitas ayuda puedes solicitarla escribiendo /help.`
      );
    } else {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `✅ Excelente, aquí tienes la información de ${result.name}:`
      );

      bot.telegram.sendMessage(ctx.message.chat.id, result.description);
    }
  });

  bot.launch();

  return NextResponse.json({ message: "ok" });
}
