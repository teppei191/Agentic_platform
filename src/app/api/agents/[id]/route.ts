import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agent = await prisma.agent.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      access: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(agent);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      systemPrompt: body.systemPrompt,
      category: body.category,
      status: body.status,
      isPublic: body.isPublic,
      iconColor: body.iconColor,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    },
  });

  return NextResponse.json(agent);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.agent.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
