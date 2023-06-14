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

  bot.start((ctx) => ctx.reply("Bievenidos al bot de Hunty!"));
  bot.help((ctx) =>
    ctx.reply("Escribe el nombre de un departamento (Ejemplo: Antioquia)")
  );
  bot.on("text", (ctx) => {
    const depto = ctx.message.text;

    const result = data.find((row) => row.name === depto);

    if (!result) {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `No se encontraron resultados para *${depto}*, verifica que esté bien escrito.`
      );
    } else {
      bot.telegram.sendMessage(
        ctx.message.chat.id,
        `Excelente, aquí tienes la información de ${result.name}:`
      );

      bot.telegram.sendMessage(ctx.message.chat.id, result.description);
    }

    /*ctx.telegram.sendMessage(
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
    //ctx.reply(`Hello ${ctx.state.role}`);*/
  });

  bot.launch();

  //return NextResponse.json({ data });
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
