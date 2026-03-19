import { NextResponse } from "next/server";

export async function GET() {
  const rawUrl = process.env.TURSO_DATABASE_URL || "";
  const token = process.env.TURSO_AUTH_TOKEN || "";

  const info: Record<string, unknown> = {
    raw_url: rawUrl,
    raw_url_length: rawUrl.length,
    raw_url_chars: JSON.stringify([...rawUrl].map(c => c.charCodeAt(0)).slice(0, 20)),
    token_length: token.length,
  };

  // Test URL parsing
  try {
    const httpsUrl = rawUrl.replace("libsql://", "https://");
    info.https_url = httpsUrl;
    const parsed = new URL(httpsUrl);
    info.url_parse = "OK";
    info.hostname = parsed.hostname;
  } catch (e: unknown) {
    info.url_parse = "FAILED";
    info.url_error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(info);
}
