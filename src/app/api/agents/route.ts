import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agents = await prisma.agent.findMany({
    include: {
      createdBy: { select: { name: true, email: true } },
      _count: { select: { conversations: true, access: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, systemPrompt, category, status, isPublic, iconColor, temperature, maxTokens } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      description: description || null,
      systemPrompt: systemPrompt || null,
      category: category || "PERSONAL",
      status: status || "DRAFT",
      isPublic: isPublic || false,
      iconColor: iconColor || "#6366f1",
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 2048,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(agent, { status: 201 });
}
