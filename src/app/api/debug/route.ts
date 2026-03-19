import { NextResponse } from "next/server";
import { createClient } from "@libsql/client/web";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  const info: Record<string, string> = {
    TURSO_DATABASE_URL: url ? `${url.substring(0, 50)}...` : "NOT SET",
    TURSO_AUTH_TOKEN: token ? "SET (length: " + token.length + ")" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "unknown",
  };

  // Test direct libsql/web connection
  try {
    const client = createClient({ url: url!, authToken: token });
    const result = await client.execute("SELECT count(*) as cnt FROM User");
    info.direct_libsql_web = "OK";
    info.user_count = String(result.rows[0]?.cnt);
  } catch (e: unknown) {
    info.direct_libsql_web = "FAILED";
    info.direct_error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json(info);
}
