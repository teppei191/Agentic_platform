import { NextResponse } from "next/server";

export async function GET() {
  const info: Record<string, unknown> = {};

  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.user.count();
    info.connection = "OK";
    info.user_count = count;
  } catch (e: unknown) {
    info.connection = "FAILED";
    info.error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(info);
}
