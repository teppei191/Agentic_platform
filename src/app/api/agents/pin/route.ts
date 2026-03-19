import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: ピン留めエージェント一覧
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const pinned = await prisma.pinnedAgent.findMany({
    where: { userId: session.user.id },
    include: {
      agent: { select: { id: true, name: true, icon: true, iconColor: true, status: true, category: true } },
    },
  });

  return NextResponse.json(pinned.map((p) => p.agent));
}

// POST: ピン留め追加/解除 (toggle)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { agentId } = await req.json();
  if (!agentId) return NextResponse.json({ error: "Missing agentId" }, { status: 400 });

  const existing = await prisma.pinnedAgent.findUnique({
    where: { userId_agentId: { userId: session.user.id, agentId } },
  });

  if (existing) {
    await prisma.pinnedAgent.delete({ where: { id: existing.id } });
    return NextResponse.json({ pinned: false });
  } else {
    await prisma.pinnedAgent.create({
      data: { userId: session.user.id, agentId },
    });
    return NextResponse.json({ pinned: true });
  }
}
