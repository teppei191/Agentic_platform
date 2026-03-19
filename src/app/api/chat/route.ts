import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { conversationId, agentId, message } = await req.json();

  if (!conversationId || !agentId || !message) {
    return new Response("Missing fields", { status: 400 });
  }

  // Save user message
  await prisma.message.create({
    data: {
      content: message,
      role: "user",
      conversationId,
      userId: session.user.id,
    },
  });

  // Get agent config
  let agent;
  if (agentId === "general") {
    agent = await prisma.agent.findFirst({
      where: { name: "General Assistant", category: "SYSTEM" },
    });
  } else {
    agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });
  }

  if (!agent) {
    return new Response("Agent not found", { status: 404 });
  }

  // Get conversation history for context
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  // Simulate streaming AI response
  // In production, replace with actual LLM API call
  const systemPrompt = agent.systemPrompt || `あなたは「${agent.name}」というアシスタントです。${agent.description || ""}`;

  const responseText = generateDemoResponse(message, agent.name, history.length);

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Stream response word by word
      const words = responseText.split("");
      for (let i = 0; i < words.length; i++) {
        const chunk = JSON.stringify({ content: words[i] });
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();

      // Save assistant message
      await prisma.message.create({
        data: {
          content: responseText,
          role: "assistant",
          conversationId,
        },
      });

      // Update conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function generateDemoResponse(message: string, agentName: string, messageCount: number): string {
  // Demo responses - replace with actual LLM integration
  const responses = [
    `こんにちは！${agentName}です。ご質問ありがとうございます。「${message}」について、お手伝いいたします。\n\n具体的にどのような情報が必要ですか？`,
    `なるほど、「${message}」についてですね。\n\nこちらについていくつかポイントをお伝えします：\n\n1. まず基本的な概要として...\n2. 次に重要な点として...\n3. 最後に注意すべき点として...\n\n詳しく知りたい項目があればお知らせください。`,
    `ありがとうございます。「${message}」について詳しくお答えします。\n\nこの件については、いくつかのアプローチが考えられます。お客様の状況に最適な方法を一緒に見つけていきましょう。`,
  ];

  return responses[messageCount % responses.length];
}
