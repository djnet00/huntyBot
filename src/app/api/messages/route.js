import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/**
 * Get messages from database
 * @param {*} request
 * @returns
 */
export async function GET(request) {
  // Get database connection
  const prisma = new PrismaClient();

  // Get messages from database
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1000,
  });

  return NextResponse.json({ messages });
}
