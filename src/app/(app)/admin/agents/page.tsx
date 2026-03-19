"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string | null;
  iconColor: string;
  category: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
  createdBy: { name: string | null; email: string } | null;
  _count: { conversations: number; access: number };
}

export default function AdminAgentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    category: "ORGANIZATION",
    status: "DRAFT",
    isPublic: false,
    iconColor: "#6366f1",
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchAgents();
  }, [session, router]);

  const fetchAgents = async () => {
    const res = await fetch("/api/agents");
    if (res.ok) setAgents(await res.json());
    setLoading(false);
  };

  const saveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editAgent ? `/api/agents/${editAgent.id}` : "/api/agents";
    const method = editAgent ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowAddModal(false);
      setEditAgent(null);
      setForm({ name: "", description: "", systemPrompt: "", category: "ORGANIZATION", status: "DRAFT", isPublic: false, iconColor: "#6366f1" });
      fetchAgents();
    }
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("このエージェントを削除しますか？")) return;
    const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
    if (res.ok) fetchAgents();
  };

  const openEdit = (agent: Agent) => {
    setEditAgent(agent);
    setForm({
      name: agent.name,
      description: agent.description || "",
      systemPrompt: "",
      category: agent.category,
      status: agent.status,
      isPublic: agent.isPublic,
      iconColor: agent.iconColor,
    });
    setShowAddModal(true);
  };

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case "SYSTEM": return "システム";
      case "ORGANIZATION": return "組織";
      case "PERSONAL": return "個人";
      default: return cat;
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "PUBLISHED": return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">公開中</span>;
      case "DRAFT": return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">ドラフト</span>;
      case "ARCHIVED": return <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">非公開</span>;
      default: return s;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">エージェント管理</h1>
        <button
          onClick={() => {
            setEditAgent(null);
            setForm({ name: "", description: "", systemPrompt: "", category: "ORGANIZATION", status: "DRAFT", isPublic: false, iconColor: "#6366f1" });
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          エージェントを追加
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">エージェント</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">カテゴリ</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ステータス</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">公開</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">会話数</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: agent.iconColor }}
                    >
                      {agent.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{agent.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{categoryLabel(agent.category)}</td>
                <td className="px-6 py-4">{statusLabel(agent.status)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent.isPublic ? "全体" : "制限"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent._count.conversations}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openEdit(agent)} className="text-sm text-blue-600 hover:text-blue-800">編集</button>
                  <button onClick={() => deleteAgent(agent.id)} className="text-sm text-red-600 hover:text-red-800">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && (
          <div className="text-center py-12 text-gray-500">エージェントがありません</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editAgent ? "エージェントを編集" : "エージェントを追加"}
            </h2>
            <form onSubmit={saveAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前 *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">システムプロンプト</label>
                <textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="エージェントの振る舞いを定義するプロンプトを入力..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SYSTEM">システム</option>
                    <option value="ORGANIZATION">組織</option>
                    <option value="PERSONAL">個人</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DRAFT">ドラフト</option>
                    <option value="PUBLISHED">公開</option>
                    <option value="ARCHIVED">非公開</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">アイコン色</label>
                  <input
                    type="color"
                    value={form.iconColor}
                    onChange={(e) => setForm({ ...form, iconColor: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublic}
                      onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">全体に公開</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditAgent(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  {editAgent ? "更新" : "作成"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
