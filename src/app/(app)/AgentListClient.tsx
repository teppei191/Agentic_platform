"use client";

import AgentCard from "@/components/AgentCard";
import Link from "next/link";
import { useState, useEffect } from "react";

interface AgentData {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  iconColor: string;
  category: string;
  status: string;
  createdByName: string | null;
}

interface Props {
  systemAgents: AgentData[];
  orgAgents: AgentData[];
  personalAgents: AgentData[];
}

export default function AgentListClient({ systemAgents, orgAgents, personalAgents }: Props) {
  const [search, setSearch] = useState("");
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/agents/pin")
      .then((res) => res.ok ? res.json() : [])
      .then((agents: { id: string }[]) => setPinnedIds(new Set(agents.map((a) => a.id))))
      .catch(() => {});
  }, []);

  const handlePinToggle = (id: string, pinned: boolean) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (pinned) next.add(id); else next.delete(id);
      return next;
    });
  };

  const filter = (agents: AgentData[]) =>
    agents.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">エージェント</h1>
        <Link
          href="/agents/new"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white px-5 py-2.5 rounded-full text-sm font-medium transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新しいエージェント
        </Link>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#aaa]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="エージェントを検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#C3002F] focus:border-[#C3002F] outline-none text-sm"
          />
        </div>
      </div>

      {filter(systemAgents).length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Made by System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filter(systemAgents).map((agent) => (
              <AgentCard key={agent.id} {...agent} createdBy="System" isPinned={pinnedIds.has(agent.id)} onPinToggle={handlePinToggle} />
            ))}
          </div>
        </section>
      )}

      {filter(orgAgents).length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">自分の組織から</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filter(orgAgents).map((agent) => (
              <AgentCard key={agent.id} {...agent} createdBy={agent.createdByName} showMenu isPinned={pinnedIds.has(agent.id)} onPinToggle={handlePinToggle} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">あなたのエージェント</h2>
        {filter(personalAgents).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filter(personalAgents).map((agent) => (
              <AgentCard key={agent.id} {...agent} createdBy={agent.createdByName} showMenu isPinned={pinnedIds.has(agent.id)} onPinToggle={handlePinToggle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-dashed border-[#e5e5e5] rounded-xl">
            <p className="text-[#888] mb-3">まだエージェントがありません</p>
            <Link href="/agents/new" className="inline-flex items-center gap-2 text-[#C3002F] hover:underline text-sm font-medium">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              最初のエージェントを作成
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
