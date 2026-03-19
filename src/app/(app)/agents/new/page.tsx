"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAgentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    iconColor: "#6366f1",
    temperature: 0.7,
    maxTokens: 2048,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category: "PERSONAL",
        status,
      }),
    });

    if (res.ok) {
      const agent = await res.json();
      if (status === "PUBLISHED") {
        router.push(`/chat/${agent.id}`);
      } else {
        router.push("/");
      }
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">新しいエージェントを作成</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">エージェント名 *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: カスタマーサポート Bot"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="このエージェントの役割や機能を説明..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">システムプロンプト</label>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="エージェントの振る舞いを定義するプロンプトを入力..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">アイコン色</label>
            <input
              type="color"
              value={form.iconColor}
              onChange={(e) => setForm({ ...form, iconColor: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={form.temperature}
              onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
            <input
              type="number"
              step="256"
              min="256"
              max="8192"
              value={form.maxTokens}
              onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">プレビュー</p>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
              style={{ backgroundColor: form.iconColor }}
            >
              {form.name ? form.name[0].toUpperCase() : "A"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{form.name || "エージェント名"}</p>
              <p className="text-sm text-gray-500">{form.description || "説明が入ります"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={!form.name || saving}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            ドラフト保存
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "PUBLISHED")}
            disabled={!form.name || saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            公開して開始
          </button>
        </div>
      </form>
    </div>
  );
}
