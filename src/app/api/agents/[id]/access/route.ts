import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userIds } = await req.json();

  if (!Array.isArray(userIds)) {
    return NextResponse.json({ error: "userIds must be an array" }, { status: 400 });
  }

  // Remove existing access
  await prisma.agentAccess.deleteMany({ where: { agentId } });

  // Create new access entries
  if (userIds.length > 0) {
    await prisma.agentAccess.createMany({
      data: userIds.map((userId: string) => ({ userId, agentId })),
    });
  }

  return NextResponse.json({ success: true });
}
