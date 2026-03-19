"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero visual */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#1a1a1a]">
        {/* Abstract road/motion lines background */}
        <div className="absolute inset-0">
          {/* Diagonal motion streaks */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[30%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[-8deg]" />
            <div className="absolute top-[35%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-8deg]" />
            <div className="absolute top-[55%] left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-[#C3002F]/30 to-transparent rotate-[-5deg]" />
            <div className="absolute top-[60%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-[-5deg]" />
            <div className="absolute top-[75%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[-3deg]" />
          </div>
          {/* Subtle glow */}
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[40%] rounded-full bg-[#C3002F]/8 blur-[100px]" />
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/3 blur-[80px]" />
        </div>

        {/* SVG Car silhouette */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[85%] opacity-20">
          <svg viewBox="0 0 800 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SUV/Crossover silhouette */}
            <path d="M80 220 L120 220 L140 180 L200 120 L260 90 L380 80 L500 80 L580 85 L640 100 L700 140 L720 180 L740 220 L760 220" stroke="white" strokeWidth="2" fill="none" />
            {/* Roof line */}
            <path d="M260 90 L280 70 L520 65 L580 85" stroke="white" strokeWidth="1.5" fill="none" />
            {/* Windows */}
            <path d="M280 88 L290 72 L400 68 L400 82 Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1" />
            <path d="M410 82 L410 68 L510 67 L540 84 Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1" />
            {/* Front wheel */}
            <circle cx="200" cy="220" r="35" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="200" cy="220" r="20" stroke="white" strokeWidth="1" fill="none" />
            {/* Rear wheel */}
            <circle cx="620" cy="220" r="35" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="620" cy="220" r="20" stroke="white" strokeWidth="1" fill="none" />
            {/* Headlight */}
            <path d="M140 175 L160 165 L170 175" stroke="white" strokeWidth="1.5" />
            {/* Taillight */}
            <path d="M710 150 L720 170 L718 180" stroke="#C3002F" strokeWidth="2" />
            {/* Ground line */}
            <line x1="60" y1="256" x2="780" y2="256" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* Red accent lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#C3002F]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[2px] bg-gradient-to-l from-[#C3002F] to-transparent" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Innovation that<br />excites.
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              AI Agents Platform で<br />
              ビジネスの可能性を広げましょう。
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="h-14 w-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center">
              <div className="h-8 w-8 bg-[#C3002F] rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a1a]">ログイン</h2>
            <p className="mt-1 text-sm text-[#888]">Agent Platform にサインイン</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-[#C3002F] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[#888] uppercase tracking-wider mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#C3002F] focus:border-[#C3002F] focus:bg-white outline-none transition text-[#1a1a1a] text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#888] uppercase tracking-wider mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#f8f8f8] border border-[#e5e5e5] rounded-lg focus:ring-2 focus:ring-[#C3002F] focus:border-[#C3002F] focus:bg-white outline-none transition text-[#1a1a1a] text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#C3002F] hover:bg-[#A30028] text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#aaa]">または</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn("microsoft-entra-id", { callbackUrl })}
              className="w-full py-3 px-4 bg-white border border-[#e5e5e5] hover:bg-[#f8f8f8] text-[#1a1a1a] font-medium rounded-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              Azure AD でログイン
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-[#ccc]">
            © 2026 Agent Platform — Powered by Nissan Motor Corporation
          </p>
        </div>
      </div>
    </div>
  );
}
