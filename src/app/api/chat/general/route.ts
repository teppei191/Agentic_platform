import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find or create the general assistant agent
  let generalAgent = await prisma.agent.findFirst({
    where: { name: "General Assistant", category: "SYSTEM" },
  });

  if (!generalAgent) {
    generalAgent = await prisma.agent.create({
      data: {
        name: "General Assistant",
        description: "汎用アシスタント",
        systemPrompt: "あなたは親切で有能なアシスタントです。ユーザーの質問に正確に、わかりやすく回答してください。",
        category: "SYSTEM",
        status: "PUBLISHED",
        isPublic: true,
        iconColor: "#1a1a1a",
        icon: "◆",
      },
    });
  }

  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      agentId: generalAgent.id,
      title: "新しい会話",
    },
  });

  return NextResponse.json({ conversationId: conversation.id, agentId: generalAgent.id });
}
