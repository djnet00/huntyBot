import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  const prisma = new PrismaClient();
  const messages = await prisma.message.findMany();

  return NextResponse.json({ messages });
}
