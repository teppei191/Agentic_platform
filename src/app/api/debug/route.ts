import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const info: Record<string, string> = {
    TURSO_DATABASE_URL: url ? `${url.substring(0, 40)}...` : "NOT SET",
    TURSO_AUTH_TOKEN: token ? "SET (length: " + token.length + ")" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "unknown",
  };

  // Try to connect
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    info.db_connection = "OK";
    info.user_count = String(count);
  } catch (e: unknown) {
    info.db_connection = "FAILED";
    info.db_error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(info);
}
