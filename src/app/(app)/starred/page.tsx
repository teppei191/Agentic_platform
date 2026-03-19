"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StarredConversation {
  id: string;
  title: string | null;
  agentId: string;
  updatedAt: string;
  agent: { name: string; iconColor: string; icon: string | null };
  messages: { content: string }[];
}

export default function StarredPage() {
  const [conversations, setConversations] = useState<StarredConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/conversations/starred")
      .then((res) => res.ok ? res.json() : [])
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      conv.title?.toLowerCase().includes(q) ||
      conv.agent.name.toLowerCase().includes(q) ||
      conv.messages[0]?.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Search bar */}
      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#aaa]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="スター付きを検索"
          className="w-full pl-12 pr-4 py-3 border border-[#e5e5e5] rounded-xl focus:ring-2 focus:ring-[#C3002F] focus:border-[#C3002F] outline-none text-sm text-[#1a1a1a] placeholder-[#aaa] bg-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 border-2 border-[#e5e5e5] border-t-[#C3002F] rounded-full animate-spin" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="h-16 w-16 text-[#ccc] mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          <p className="text-[#888] mb-2">まだスターを付けたリソースはありません</p>
          <p className="text-[#aaa] text-sm text-center max-w-sm mb-6">
            会話やコンテンツにスターを付けて、すばやくアクセスできるようにします
          </p>
          <Link
            href="/search"
            className="px-6 py-2.5 border border-[#e5e5e5] rounded-full text-sm text-[#555] hover:bg-[#f8f8f8] transition"
          >
            検索に戻る
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat/${conv.agentId}`}
              className="flex items-center gap-4 p-4 bg-white border border-[#e5e5e5] rounded-xl hover:border-[#ccc] hover:shadow-sm transition"
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ backgroundColor: conv.agent.iconColor }}
              >
                {conv.agent.icon || conv.agent.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1a1a1a] text-sm">{conv.title || conv.agent.name}</p>
                {conv.messages[0] && (
                  <p className="text-sm text-[#888] truncate">{conv.messages[0].content}</p>
                )}
              </div>
              <svg className="h-4 w-4 text-[#C3002F] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
