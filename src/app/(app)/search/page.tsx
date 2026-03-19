"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  id: string;
  content: string;
  role: string;
  createdAt: string;
  conversation: {
    id: string;
    agentId: string;
    agent: { name: string; iconColor: string };
  };
}

interface Agent {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  iconColor: string;
  category: string;
}

interface StarredConversation {
  id: string;
  title: string | null;
  agentId: string;
  agent: { name: string; iconColor: string; icon: string | null };
  messages: { content: string }[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [recentAgents, setRecentAgents] = useState<Agent[]>([]);
  const [starredConversations, setStarredConversations] = useState<StarredConversation[]>([]);

  useEffect(() => {
    // Load recent agents and starred content on mount
    fetch("/api/agents")
      .then((res) => res.ok ? res.json() : [])
      .then((agents: Agent[]) => setRecentAgents(agents.slice(0, 6)))
      .catch(() => {});
    fetch("/api/conversations/starred")
      .then((res) => res.ok ? res.json() : [])
      .then((convs: StarredConversation[]) => setStarredConversations(convs.slice(0, 4)))
      .catch(() => {});
  }, []);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      setResults(await res.json());
    }
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Search form */}
      <form onSubmit={search} className="mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#aaa]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="チャットやエージェントを検索..."
            className="w-full pl-12 pr-4 py-3.5 border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#C3002F] focus:border-[#C3002F] outline-none text-base text-[#1a1a1a] placeholder-[#aaa] bg-white"
          />
        </div>
      </form>

      {/* Search results */}
      {searched && results.length === 0 && (
        <div className="text-center py-16 text-[#888]">
          <p>検索結果が見つかりませんでした</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3 mb-12">
          <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">検索結果</h2>
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/chat/${result.conversation.agentId}`}
              className="block p-4 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#ccc] hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: result.conversation.agent.iconColor }}
                >
                  {result.conversation.agent.name[0]}
                </div>
                <span className="text-sm font-medium text-[#1a1a1a]">{result.conversation.agent.name}</span>
                <span className="text-xs text-[#aaa]">{new Date(result.createdAt).toLocaleDateString("ja-JP")}</span>
              </div>
              <p className="text-sm text-[#555] line-clamp-2">{result.content}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Default content: recent agents + starred */}
      {!searched && (
        <>
          {/* Recent Agents */}
          {recentAgents.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-4">最近のエージェント</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recentAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/chat/${agent.id}`}
                    className="flex items-center gap-3 p-3 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#ccc] hover:shadow-sm transition"
                  >
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: agent.iconColor }}
                    >
                      {agent.icon || agent.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] truncate">{agent.name}</p>
                      <p className="text-xs text-[#aaa] truncate">{agent.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Starred Content */}
          {starredConversations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-[#888] uppercase tracking-wider">スター付きコンテンツ</h2>
                <Link href="/starred" className="text-xs text-[#C3002F] hover:underline">
                  すべて表示
                </Link>
              </div>
              <div className="space-y-2">
                {starredConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/chat/${conv.agentId}`}
                    className="flex items-center gap-4 p-3 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#ccc] hover:shadow-sm transition"
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                      style={{ backgroundColor: conv.agent.iconColor }}
                    >
                      {conv.agent.icon || conv.agent.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a1a1a] truncate">{conv.title || conv.agent.name}</p>
                      {conv.messages[0] && (
                        <p className="text-xs text-[#888] truncate">{conv.messages[0].content}</p>
                      )}
                    </div>
                    <svg className="h-4 w-4 text-[#C3002F] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no agents or starred */}
          {recentAgents.length === 0 && starredConversations.length === 0 && (
            <div className="text-center py-16">
              <svg className="h-16 w-16 text-[#ccc] mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="text-[#888]">チャットやエージェントを検索してください</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
