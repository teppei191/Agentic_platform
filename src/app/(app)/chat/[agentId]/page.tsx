import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

export default async function ChatPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  });

  if (!agent) redirect("/");

  // Find or create conversation
  let conversation = await prisma.conversation.findFirst({
    where: { userId: session.user.id, agentId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        agentId,
        title: `${agent.name}との会話`,
      },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  return (
    <ChatClient
      agent={{
        id: agent.id,
        name: agent.name,
        description: agent.description,
        icon: agent.icon,
        iconColor: agent.iconColor,
      }}
      conversationId={conversation.id}
      initialMessages={conversation.messages.map((m) => ({
        id: m.id,
        content: m.content,
        role: m.role as "user" | "assistant",
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
