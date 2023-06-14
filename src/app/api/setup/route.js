import { NextResponse } from "next/server";
const { Telegraf } = require("telegraf");

/**
 * Setup webhook
 * @param {*} request
 * @returns
 */
export async function GET(request) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  //await bot.telegram.deleteWebhook();

  // Set webhook
  await bot.telegram.setWebhook("https://hunty-bot.vercel.app/api/webhook");

  // Get webhook info
  await bot.telegram.getWebhookInfo().then(console.log);

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  // Send response
  return NextResponse.json({ message: "Webhook setted" });
}
