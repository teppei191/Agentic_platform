import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [userCount, agentCount, conversationCount, messageCount] = await Promise.all([
    prisma.user.count(),
    prisma.agent.count(),
    prisma.conversation.count(),
    prisma.message.count(),
  ]);

  const stats = [
    { name: "ユーザー数", value: userCount, href: "/admin/users", color: "bg-blue-500" },
    { name: "エージェント数", value: agentCount, href: "/admin/agents", color: "bg-indigo-500" },
    { name: "会話数", value: conversationCount, href: "#", color: "bg-green-500" },
    { name: "メッセージ数", value: messageCount, href: "#", color: "bg-amber-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">管理ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} text-white mb-3`}>
              <span className="text-lg font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h2>
          <div className="space-y-3">
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">ユーザーを追加</span>
            </Link>
            <Link href="/admin/agents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">エージェントを管理</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
