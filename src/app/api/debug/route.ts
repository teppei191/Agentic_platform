import { NextResponse } from "next/server";
import { createClient } from "@libsql/client/web";

export async function GET() {
  let url = process.env.TURSO_DATABASE_URL || "";
  const token = process.env.TURSO_AUTH_TOKEN;

  // Convert libsql:// to https:// for web client
  if (url.startsWith("libsql://")) {
    url = url.replace("libsql://", "https://");
  }

  const info: Record<string, string> = {
    TURSO_DATABASE_URL_CONVERTED: url ? `${url.substring(0, 50)}...` : "NOT SET",
    TURSO_AUTH_TOKEN: token ? "SET (length: " + token.length + ")" : "NOT SET",
  };

  try {
    const client = createClient({ url, authToken: token });
    const result = await client.execute("SELECT count(*) as cnt FROM User");
    info.connection = "OK";
    info.user_count = String(result.rows[0]?.cnt);
  } catch (e: unknown) {
    info.connection = "FAILED";
    info.error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json(info);
}
