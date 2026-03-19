"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const userNav = [
  { name: "新しいチャット", href: "/", icon: "pencil" },
  { name: "検索", href: "/search", icon: "search" },
  { name: "スター付き", href: "/starred", icon: "star" },
  { name: "ライブラリ", href: "/library", icon: "library" },
];

const adminNav = [
  { name: "ダッシュボード", href: "/admin", icon: "dashboard" },
  { name: "ユーザー管理", href: "/admin/users", icon: "users" },
  { name: "エージェント管理", href: "/admin/agents", icon: "agents" },
];

interface PinnedAgent {
  id: string;
  name: string;
  icon: string | null;
  iconColor: string;
}

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const cn = className || "h-5 w-5";
  switch (icon) {
    case "pencil":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
    case "search":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
    case "star":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
    case "library":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
    case "agents":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>;
    case "dashboard":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" /></svg>;
    case "users":
      return <svg className={cn} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const [pinnedAgents, setPinnedAgents] = useState<PinnedAgent[]>([]);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetch("/api/agents/pin")
      .then((res) => res.ok ? res.json() : [])
      .then(setPinnedAgents)
      .catch(() => {});
  }, []);

  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} bg-[#1a1a1a] flex flex-col h-screen transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#333]">
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-[#333] rounded-lg transition">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#C3002F] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="font-semibold text-white text-sm tracking-wide">Agent Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {userNav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-[#C3002F] text-white" : "text-gray-400 hover:bg-[#2d2d2d] hover:text-white"
              }`}
            >
              <NavIcon icon={item.icon} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Agents section */}
        {!collapsed && (
          <div className="pt-4">
            <button
              onClick={() => setAgentsExpanded(!agentsExpanded)}
              className="flex items-center justify-between w-full px-3 py-1.5"
            >
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">エージェント</span>
              <svg className={`h-3.5 w-3.5 text-gray-500 transition-transform ${agentsExpanded ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {agentsExpanded && (
              <div className="mt-1 space-y-0.5">
                {pinnedAgents.map((agent) => {
                  const isActive = pathname === `/chat/${agent.id}`;
                  return (
                    <Link
                      key={agent.id}
                      href={`/chat/${agent.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                        isActive ? "bg-[#2d2d2d] text-white" : "text-gray-400 hover:bg-[#2d2d2d] hover:text-white"
                      }`}
                    >
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                        style={{ backgroundColor: agent.iconColor }}
                      >
                        {agent.icon || agent.name[0]?.toUpperCase()}
                      </div>
                      <span className="truncate">{agent.name}</span>
                      <svg className="h-3.5 w-3.5 text-gray-600 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                      </svg>
                    </Link>
                  );
                })}

                <Link
                  href="/agents"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    pathname === "/agents" || pathname.startsWith("/agents/")
                      ? "bg-[#C3002F] text-white"
                      : "text-gray-400 hover:bg-[#2d2d2d] hover:text-white"
                  }`}
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                  </svg>
                  <span>すべてのエージェント</span>
                </Link>
                <Link
                  href="/agents/new"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#2d2d2d] hover:text-white transition"
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>新しいエージェント</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Admin section */}
        {isAdmin && (
          <>
            {!collapsed && (
              <div className="pt-4 border-t border-[#333] mt-4">
                <div className="px-3 py-1">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">管理</span>
                </div>
              </div>
            )}
            {adminNav.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? "bg-[#C3002F] text-white" : "text-gray-400 hover:bg-[#2d2d2d] hover:text-white"
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#333] p-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#C3002F] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || session?.user?.email}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs text-gray-500 hover:text-[#C3002F] transition"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
