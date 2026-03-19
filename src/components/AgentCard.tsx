"use client";

import Link from "next/link";
import { useState } from "react";

interface AgentCardProps {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  iconColor: string;
  category: string;
  status: string;
  createdBy?: string | null;
  showMenu?: boolean;
  isPinned?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPinToggle?: (id: string, pinned: boolean) => void;
}

export default function AgentCard({
  id,
  name,
  description,
  icon,
  iconColor,
  status,
  createdBy,
  showMenu = false,
  isPinned = false,
  onDelete,
  onEdit,
  onPinToggle,
}: AgentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pinned, setPinned] = useState(isPinned);
  const [pinLoading, setPinLoading] = useState(false);
  const initial = icon || name[0]?.toUpperCase() || "A";

  const handlePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinLoading) return;
    setPinLoading(true);
    try {
      const res = await fetch("/api/agents/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setPinned(data.pinned);
        onPinToggle?.(id, data.pinned);
      }
    } catch { /* ignore */ }
    setPinLoading(false);
  };

  return (
    <div className="relative bg-white border border-[#e5e5e5] rounded-xl p-5 hover:border-[#ccc] hover:shadow-sm transition group">
      <Link href={`/chat/${id}`} className="block">
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
            style={{ backgroundColor: iconColor }}
          >
            {initial}
          </div>
          {status === "DRAFT" && (
            <span className="text-xs bg-[#f2f2f2] text-[#888] px-2 py-0.5 rounded-full font-medium">ドラフト</span>
          )}
        </div>
        <h3 className="font-semibold text-[#1a1a1a] mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-[#888] line-clamp-2">{description}</p>
        )}
        {createdBy && (
          <p className="text-xs text-[#aaa] mt-2">By {createdBy}</p>
        )}
      </Link>

      {/* Pin button */}
      <button
        onClick={handlePin}
        disabled={pinLoading}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition ${
          pinned
            ? "text-[#C3002F] bg-red-50 opacity-100"
            : "text-[#aaa] hover:bg-[#f2f2f2] opacity-0 group-hover:opacity-100"
        }`}
        title={pinned ? "ピン留め解除" : "ピン留め"}
      >
        <svg className="h-4 w-4" fill={pinned ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </button>

      {/* Menu button */}
      {showMenu && (
        <div className="absolute top-4 right-12">
          <button
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 hover:bg-[#f2f2f2] rounded-lg opacity-0 group-hover:opacity-100 transition"
          >
            <svg className="h-5 w-5 text-[#888]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-20">
                {onEdit && (
                  <button onClick={() => { onEdit(id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-[#1a1a1a] hover:bg-[#f8f8f8]">編集</button>
                )}
                {onDelete && (
                  <button onClick={() => { onDelete(id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-[#C3002F] hover:bg-red-50">削除</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
