"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  title: string | null;
  agentId: string;
  starred: boolean;
  updatedAt: string;
  agent: { name: string; iconColor: string; icon: string | null };
  messages: { content: string }[];
}

type Tab = "all" | "images" | "videos";

export default function LibraryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/conversations")
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "images", label: "画像" },
    { key: "videos", label: "動画" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ライブラリ</h1>
        <button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#333] transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          作成
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-3 mb-6">
        <button className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f2f2f2] rounded-full transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab.key
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : "bg-white text-[#555] border-[#e5e5e5] hover:border-[#ccc]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "all" ? (
        loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 border-2 border-[#e5e5e5] border-t-[#C3002F] rounded-full animate-spin" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16 text-[#888]">
            <p>会話履歴はまだありません</p>
            <Link href="/" className="text-[#C3002F] hover:underline text-sm mt-2 inline-block">
              エージェントと会話を始める
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
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#1a1a1a] text-sm">{conv.title || conv.agent.name}</p>
                    <span className="text-xs text-[#aaa]">
                      {new Date(conv.updatedAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  {conv.messages[0] && (
                    <p className="text-sm text-[#888] truncate">{conv.messages[0].content}</p>
                  )}
                </div>
                {conv.starred && (
                  <svg className="h-4 w-4 text-[#C3002F] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        )
      ) : (
        /* Images / Videos tab - empty state with generation CTA */
        <div className="border border-[#e5e5e5] rounded-2xl p-12 text-center bg-white">
          <p className="text-[#888] mb-6">Content you create will appear here</p>
          <div className="flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#1a1a1a] px-6 py-3 rounded-full text-sm font-medium transition">
              <span>✨</span>
              画像を生成
            </button>
            <button className="flex items-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] text-[#1a1a1a] px-6 py-3 rounded-full text-sm font-medium transition">
              <span>🎬</span>
              動画を生成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
