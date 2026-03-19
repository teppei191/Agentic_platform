import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const info: Record<string, string> = {
    TURSO_DATABASE_URL: url ? `${url.substring(0, 50)}...` : "NOT SET",
    TURSO_AUTH_TOKEN: token ? "SET (length: " + token.length + ")" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "unknown",
  };

  // Test direct libsql connection
  try {
    const client = createClient({ url: url!, authToken: token });
    const result = await client.execute("SELECT count(*) as cnt FROM User");
    info.direct_libsql = "OK";
    info.user_count = String(result.rows[0]?.cnt);
  } catch (e: unknown) {
    info.direct_libsql = "FAILED";
    info.direct_error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  // Test prisma
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    info.prisma_connection = "OK";
    info.prisma_user_count = String(count);
  } catch (e: unknown) {
    info.prisma_connection = "FAILED";
    info.prisma_error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json(info);
}
