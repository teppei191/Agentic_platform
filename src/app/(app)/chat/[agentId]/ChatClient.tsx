"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Props {
  agent: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    iconColor: string;
  };
  conversationId: string;
  initialMessages: Message[];
}

function FileUploadPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-[#1a1a1a] font-medium">ファイルをアップロード</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#555]" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
          <span className="text-sm text-[#1a1a1a] font-medium">ドライブから追加</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
          <svg className="h-5 w-5 text-[#0078d4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.5 3v7.5H4V3h7.5zm1 0H20v7.5h-7.5V3zM4 11.5h7.5V19H4v-7.5zm8.5 0H20V19h-7.5v-7.5z" />
          </svg>
          <div>
            <span className="text-sm text-[#1a1a1a] font-medium block">OneDrive Business から追加</span>
            <span className="text-xs text-[#888]">SharePoint を含む</span>
          </div>
        </button>
        <div className="border-t border-[#e5e5e5] mt-1 pt-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left">
            <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className="text-sm text-[#1a1a1a] font-medium">ファイルを管理</span>
          </button>
        </div>
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
      <div className="absolute bottom-full left-8 mb-2 w-72 bg-white rounded-xl shadow-lg border border-[#e5e5e5] py-2 z-50 animate-scale-in">
        <div className="px-4 py-2 border-b border-[#e5e5e5]">
          <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">コネクタ</span>
        </div>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left"
          onClick={() => onToggle("google")}
        >
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
        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8f8f8] transition text-left"
          onClick={() => onToggle("database")}
        >
          <div className="h-8 w-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
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

export default function ChatClient({ agent, conversationId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [showConnectorPopup, setShowConnectorPopup] = useState(false);
  const [connectors, setConnectors] = useState<Record<string, boolean>>({ google: true, database: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          agentId: agent.id,
          message: userMessage.content,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "",
        role: "assistant",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                assistantContent += parsed.content || "";
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "エラーが発生しました。もう一度お試しください。",
          role: "assistant",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    setInput(textarea.value);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Agent header - empty state */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4"
            style={{ backgroundColor: agent.iconColor }}
          >
            {agent.icon || agent.name[0]?.toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">{agent.name}</h2>
          {agent.description && (
            <p className="text-sm text-[#888] mt-1.5 max-w-md text-center">{agent.description}</p>
          )}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Agent info at top */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-semibold mb-2"
                style={{ backgroundColor: agent.iconColor }}
              >
                {agent.icon || agent.name[0]?.toUpperCase()}
              </div>
              <p className="text-sm font-medium text-[#1a1a1a]">{agent.name}</p>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-[#f8f8f8] border border-[#e5e5e5] text-[#1a1a1a]"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-[#f8f8f8] border border-[#e5e5e5] rounded-2xl px-4 py-3">
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
      )}

      {/* Input area */}
      <div className="border-t border-[#e5e5e5] bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-[#f8f8f8] rounded-2xl px-4 py-3 border border-[#e5e5e5]">
            {/* + Button (File Upload) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => { setShowFilePopup(!showFilePopup); setShowConnectorPopup(false); }}
                className="p-1.5 text-[#888] hover:text-[#1a1a1a] hover:bg-[#e5e5e5] rounded-lg transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              {showFilePopup && <FileUploadPopup onClose={() => setShowFilePopup(false)} />}
            </div>

            {/* Connector Button (DB icon) */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => { setShowConnectorPopup(!showConnectorPopup); setShowFilePopup(false); }}
                className="p-1.5 text-[#888] hover:text-[#1a1a1a] hover:bg-[#e5e5e5] rounded-lg transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </button>
              {showConnectorPopup && (
                <ConnectorPopup
                  onClose={() => setShowConnectorPopup(false)}
                  connectors={connectors}
                  onToggle={(key) => setConnectors((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="コンテンツを検索、または質問を入力"
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-[#1a1a1a] placeholder-[#aaa] max-h-[200px]"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 p-2 bg-[#1a1a1a] text-white rounded-full hover:bg-[#333] transition disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-[#aaa] text-center mt-2">
            生成 AI が表示する情報は、人物に関するものを含め、不正確な場合があります。回答を再確認するようにしてください。
          </p>
        </div>
      </div>
    </div>
  );
}
