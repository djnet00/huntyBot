import { NextResponse } from "next/server";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  await bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/webhook");

  return NextResponse.json({ message: "Webhook setted" });
}
