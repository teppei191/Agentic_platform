import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AgentListClient from "../AgentListClient";

export default async function AgentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const systemAgents = await prisma.agent.findMany({
    where: { category: "SYSTEM", status: "PUBLISHED" },
    include: { createdBy: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const orgAgents = await prisma.agent.findMany({
    where: {
      category: "ORGANIZATION",
      status: "PUBLISHED",
      OR: [
        { isPublic: true },
        { access: { some: { userId } } },
        ...(isAdmin ? [{}] : []),
      ],
    },
    include: { createdBy: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  const personalAgents = await prisma.agent.findMany({
    where: { createdById: userId, category: "PERSONAL" },
    include: { createdBy: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AgentListClient
      systemAgents={systemAgents.map((a) => ({
        ...a,
        createdByName: a.createdBy?.name || null,
      }))}
      orgAgents={orgAgents.map((a) => ({
        ...a,
        createdByName: a.createdBy?.name || null,
      }))}
      personalAgents={personalAgents.map((a) => ({
        ...a,
        createdByName: a.createdBy?.name || null,
      }))}
    />
  );
}
