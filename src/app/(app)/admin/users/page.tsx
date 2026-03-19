"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { conversations: number; agentAccess: number };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "USER" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [session, router]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowAddModal(false);
      setForm({ email: "", name: "", password: "", role: "USER" });
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || "エラーが発生しました");
    }
  };

  const updateRole = async (userId: string, role: string) => {
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("このユーザーを削除しますか？")) return;
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    if (res.ok) fetchUsers();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">読み込み中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          ユーザーを追加
        </button>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ユーザー</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ロール</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">会話数</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">エージェント</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name || "—"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    disabled={user.id === session?.user?.id}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user._count.conversations}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user._count.agentAccess}</td>
                <td className="px-6 py-4 text-right">
                  {user.id !== session?.user?.id && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ユーザーを追加</h2>
            <form onSubmit={addUser} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">パスワード *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ロール</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
