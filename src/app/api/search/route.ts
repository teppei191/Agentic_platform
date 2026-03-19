import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json([]);
  }

  const messages = await prisma.message.findMany({
    where: {
      content: { contains: q },
      conversation: { userId: session.user.id },
    },
    include: {
      conversation: {
        select: {
          id: true,
          agentId: true,
          agent: { select: { name: true, iconColor: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(messages);
}
