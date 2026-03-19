"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

const quickActions = [
  { icon: "🔍", label: "可能性を探索" },
  { icon: "💡", label: "リラックスするアイデア" },
  { icon: "✨", label: "ブレークスルーを起こす" },
  { icon: "📋", label: "今日の準備" },
];

const models = [
  { id: "auto", label: "自動" },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
  { id: "gemini-3.5-pro", label: "Gemini 3.5 Pro" },
  { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { id: "gpt-5", label: "GPT-5" },
  { id: "gpt-4.1", label: "GPT-4.1" },
];

/* ── Popups ── */

function FileUploadPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
          <span className="text-sm text-[#1a1a1a] font-medium">ファイルをアップロード</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>
          <span className="text-sm text-[#1a1a1a] font-medium">ドライブから追加</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#0078d4]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 3v7.5H4V3h7.5zm1 0H20v7.5h-7.5V3zM4 11.5h7.5V19H4v-7.5zm8.5 0H20V19h-7.5v-7.5z" /></svg>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">OneDrive Business から追加</span>
            <span className="text-xs text-[#888]">SharePoint を含む</span>
          </div>
        </button>
        <div className="border-t border-[#e5e5e5] mt-1 pt-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
            <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            <span className="text-sm text-[#1a1a1a] font-medium">ファイルを管理</span>
          </button>
        </div>
      </div>
    </>
  );
}

function ToolsPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <div className="px-4 py-2 border-b border-[#e5e5e5]">
          <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">ツール</span>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <div className="h-8 w-8 bg-[#C3002F] rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" /></svg>
          </div>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">画像を生成</span>
            <span className="text-xs text-[#888]">テキストから画像を作成</span>
          </div>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <div className="h-8 w-8 bg-[#7c3aed] rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          </div>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">動画を生成</span>
            <span className="text-xs text-[#888]">テキストから動画を作成</span>
          </div>
        </button>
      </div>
    </>
  );
}

function ConnectorPopup({ onClose, connectors, onToggle }: {
  onClose: () => void;
  connectors: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <div className="px-4 py-2 border-b border-[#e5e5e5]">
          <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">コネクタ</span>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left" onClick={() => onToggle("google")}>
          <div className="h-8 w-8 bg-[#4285f4] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">Google 検索</span>
            <span className="text-xs text-[#888]">Web検索で情報を取得</span>
          </div>
          <div className="ml-auto">
            <div className={`w-9 h-5 rounded-full relative transition-colors ${connectors.google ? "bg-[#C3002F]" : "bg-[#ccc]"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${connectors.google ? "right-0.5" : "left-0.5"}`} />
            </div>
          </div>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left" onClick={() => onToggle("database")}>
          <div className="h-8 w-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
          </div>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">データベース</span>
            <span className="text-xs text-[#888]">登録済みDBに接続</span>
          </div>
          <div className="ml-auto">
            <div className={`w-9 h-5 rounded-full relative transition-colors ${connectors.database ? "bg-[#C3002F]" : "bg-[#ccc]"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${connectors.database ? "right-0.5" : "left-0.5"}`} />
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

function ModelSelectPopup({ onClose, selectedModel, onSelect }: {
  onClose: () => void;
  selectedModel: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <div className="px-4 py-2 border-b border-[#e5e5e5]">
          <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">モデル選択</span>
        </div>
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => { onSelect(m.id); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8f8f8] transition text-left text-sm ${
              selectedModel === m.id ? "text-[#C3002F] font-medium" : "text-[#1a1a1a]"
            }`}
          >
            {selectedModel === m.id && (
              <svg className="h-4 w-4 text-[#C3002F] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            )}
            {selectedModel !== m.id && <div className="w-4" />}
            {m.label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ── Shared icon buttons row ── */

function InputToolbar({ showFilePopup, setShowFilePopup, showToolsPopup, setShowToolsPopup, showConnectorPopup, setShowConnectorPopup, connectors, onToggleConnector }: {
  showFilePopup: boolean;
  setShowFilePopup: (v: boolean) => void;
  showToolsPopup: boolean;
  setShowToolsPopup: (v: boolean) => void;
  showConnectorPopup: boolean;
  setShowConnectorPopup: (v: boolean) => void;
  connectors: Record<string, boolean>;
  onToggleConnector: (key: string) => void;
}) {
  const closeAll = (except: string) => {
    if (except !== "file") setShowFilePopup(false);
    if (except !== "tools") setShowToolsPopup(false);
    if (except !== "connector") setShowConnectorPopup(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* + button */}
      <div className="relative">
        <button onClick={() => { closeAll("file"); setShowFilePopup(!showFilePopup); }} className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f2f2f2] rounded-lg transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </button>
        {showFilePopup && <FileUploadPopup onClose={() => setShowFilePopup(false)} />}
      </div>
      {/* Tools button */}
      <div className="relative">
        <button onClick={() => { closeAll("tools"); setShowToolsPopup(!showToolsPopup); }} className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f2f2f2] rounded-lg transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.109l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
        {showToolsPopup && <ToolsPopup onClose={() => setShowToolsPopup(false)} />}
      </div>
      {/* Connector button (DB icon) */}
      <div className="relative">
        <button onClick={() => { closeAll("connector"); setShowConnectorPopup(!showConnectorPopup); }} className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f2f2f2] rounded-lg transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
        </button>
        {showConnectorPopup && (
          <ConnectorPopup onClose={() => setShowConnectorPopup(false)} connectors={connectors} onToggle={onToggleConnector} />
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */

export default function HomeChatClient({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [showToolsPopup, setShowToolsPopup] = useState(false);
  const [showConnectorPopup, setShowConnectorPopup] = useState(false);
  const [connectors, setConnectors] = useState<Record<string, boolean>>({ google: true, database: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const modelLabel = models.find((m) => m.id === selectedModel)?.label || "自動";

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      let convId = conversationId;
      if (!convId) {
        const res = await fetch("/api/chat/general", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create" }),
        });
        if (!res.ok) throw new Error("Failed to create conversation");
        const data = await res.json();
        convId = data.conversationId;
        setConversationId(convId);
        setAgentId(data.agentId);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          agentId: agentId || "general",
          message: content,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessage: Message = { id: crypto.randomUUID(), content: "", role: "assistant", createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                assistantContent += parsed.content || "";
                setMessages((prev) => prev.map((m) => m.id === assistantMessage.id ? { ...m, content: assistantContent } : m));
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), content: "エラーが発生しました。もう一度お試しください。", role: "assistant", createdAt: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    setInput(ta.value);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#f8f8f8]">
      {/* ── Empty state ── */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="mb-8">
              <p className="text-[#888] text-lg mb-1">
                <span className="text-[#C3002F] mr-1.5">◆</span>
                こんにちは、{userName} さん
              </p>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">作業を始めましょう</h1>
            </div>

            {/* Input card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-4 mb-4">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={3}
                className="w-full bg-transparent outline-none resize-none text-sm text-[#1a1a1a] placeholder-[#aaa] mb-3"
              />
              <div className="flex items-center justify-between">
                <InputToolbar
                  showFilePopup={showFilePopup} setShowFilePopup={setShowFilePopup}
                  showToolsPopup={showToolsPopup} setShowToolsPopup={setShowToolsPopup}
                  showConnectorPopup={showConnectorPopup} setShowConnectorPopup={setShowConnectorPopup}
                  connectors={connectors} onToggleConnector={(k) => setConnectors((p) => ({ ...p, [k]: !p[k] }))}
                />
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowModelPopup(!showModelPopup)}
                      className="flex items-center gap-1 text-sm text-[#555] hover:bg-[#f2f2f2] px-3 py-1.5 rounded-lg transition"
                    >
                      {modelLabel}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {showModelPopup && (
                      <ModelSelectPopup onClose={() => setShowModelPopup(false)} selectedModel={selectedModel} onSelect={setSelectedModel} />
                    )}
                  </div>
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="p-2 text-[#ccc] hover:text-[#1a1a1a] transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((a) => (
                <button key={a.label} onClick={() => sendMessage(a.label)} className="flex items-center gap-2 bg-white border border-[#e5e5e5] rounded-full px-5 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#f2f2f2] hover:border-[#ccc] transition">
                  <span>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Messages view ── */}
      {hasMessages && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#e5e5e5] text-[#1a1a1a]"}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#e5e5e5] rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-[#ccc] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input bar (messages mode) */}
          <div className="border-t border-[#e5e5e5] bg-white px-4 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 bg-[#f8f8f8] rounded-2xl px-4 py-3 border border-[#e5e5e5]">
                <InputToolbar
                  showFilePopup={showFilePopup} setShowFilePopup={setShowFilePopup}
                  showToolsPopup={showToolsPopup} setShowToolsPopup={setShowToolsPopup}
                  showConnectorPopup={showConnectorPopup} setShowConnectorPopup={setShowConnectorPopup}
                  connectors={connectors} onToggleConnector={(k) => setConnectors((p) => ({ ...p, [k]: !p[k] }))}
                />
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={autoResize}
                  onKeyDown={handleKeyDown}
                  placeholder="メッセージを入力..."
                  rows={1}
                  className="flex-1 bg-transparent outline-none resize-none text-sm text-[#1a1a1a] placeholder-[#aaa] max-h-[200px]"
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <button onClick={() => setShowModelPopup(!showModelPopup)} className="flex items-center gap-1 text-xs text-[#888] hover:text-[#555] transition">
                      {modelLabel}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {showModelPopup && (
                      <ModelSelectPopup onClose={() => setShowModelPopup(false)} selectedModel={selectedModel} onSelect={setSelectedModel} />
                    )}
                  </div>
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="p-2 bg-[#1a1a1a] text-white rounded-full hover:bg-[#333] transition disabled:opacity-20 disabled:cursor-not-allowed">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
