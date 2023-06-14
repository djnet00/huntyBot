import { NextResponse } from "next/server";
const { Telegraf } = require("telegraf");

export async function GET(request) {
  const bot = new Telegraf("6158245428:AAFdpU5fqscxDJQ4J6907TgxWyooqXioXvU");
  bot.telegram.setWebhook("https://localhost:3000/api/messages");

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
