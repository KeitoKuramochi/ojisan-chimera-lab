"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, FlaskConical, Play, Zap, BookOpen, X, ChevronRight, AlertTriangle } from "lucide-react";

const RARITIES = [
  { rarity: "SEC", label: "SECRET", score: "900,000 〜 1,000,000", color: "text-white", bg: "bg-white/10 border-white/40", glow: "shadow-[0_0_20px_rgba(255,255,255,0.4)]", desc: "宇宙の真理。前代未聞の超奇跡体。" },
  { rarity: "UR",  label: "ULTRA RARE", score: "700,000 〜 899,999",  color: "text-rose-400", bg: "bg-rose-950/40 border-rose-500/40", glow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]", desc: "伝説級。目撃情報ほぼゼロ。" },
  { rarity: "SSR", label: "SUPER RARE", score: "500,000 〜 699,999",  color: "text-amber-400", bg: "bg-amber-950/40 border-amber-400/40", glow: "", desc: "奇跡の産物。研究者が泣いて喜ぶ。" },
  { rarity: "SR",  label: "RARE",       score: "300,000 〜 499,999",  color: "text-purple-400", bg: "bg-purple-950/40 border-purple-400/40", glow: "", desc: "優秀。珍しい組み合わせが生まれた。" },
  { rarity: "R",   label: "UNCOMMON",   score: "100,000 〜 299,999",  color: "text-blue-400", bg: "bg-blue-950/40 border-blue-400/40", glow: "", desc: "そこそこ。まあ悪くない融合体。" },
  { rarity: "N",   label: "NORMAL",     score: "10,000 〜 99,999",   color: "text-slate-400", bg: "bg-slate-800/40 border-slate-500/40", glow: "", desc: "並以下。まだまだ研究が必要。" },
  { rarity: "OJISAN", label: "OJISAN",  score: "0 〜 9,999",         color: "text-orange-800", bg: "bg-orange-100/5 border-orange-900/30", glow: "", desc: "ただのおじさん。融合失敗。" },
];

const STEPS = [
  { icon: "🦵", step: "STEP 1", title: "足を選ぶ", desc: "流れてくるベルトコンベアの絵文字を眺め、気に入ったところでSPACEキーを押します。選んだ絵文字が足部品になります。" },
  { icon: "👕", step: "STEP 2", title: "体を選ぶ", desc: "同じようにベルトコンベアからSPACEキーで体部品を選びます。足・体・頭の組み合わせがレアリティに影響します。" },
  { icon: "😶", step: "STEP 3", title: "頭を選ぶ", desc: "最後に頭部品を選択します。これで素材選びは完了です！" },
  { icon: "🎯", step: "DROP!", title: "水槽に落とす", desc: "選んだ絵文字を動く水槽へSPACEキーで落下させます。水槽に入れば融合成功。外れると、デフォルトのノーマルパーツ（🦵👕👴）が入ります。" },
];

export default function TitleScreen() {
  const [name, setName] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("chimera_doctor_name");
    if (savedName) setName(savedName);
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("chimera_doctor_name", name);
    router.push("/action");
  };

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center space-y-12 text-center overflow-hidden">
      {/* Background Base Ojisan (Faint) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
      >
        <img
          src="/ojisan_base.png"
          alt="Base Subject"
          className="h-[120%] w-auto object-contain brightness-50"
        />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative space-y-4 z-10"
      >
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/20 text-7xl animate-pulse">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin-slow" />
          👴
        </div>
        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl italic">
          おじさん<span className="text-emerald-400">キメララボ</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-emerald-400/80 font-mono text-sm tracking-widest uppercase">
          <Zap className="h-4 w-4 fill-current" />
          Project: Ojisan Modification
          <Zap className="h-4 w-4 fill-current" />
        </div>
        <p className="max-w-md mx-auto text-lg text-foreground/60 leading-relaxed">
          禁断の融合実験室へようこそ。<br />
          素材（絵文字）を組み込み、<br />
          世界を驚かせる新種を創造しましょう。
        </p>
      </motion.div>

      {/* Form Section */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleStart}
        className="relative z-10 glass-card w-full max-w-sm space-y-6 p-8 border-emerald-500/20 bg-emerald-950/10 backdrop-blur-sm"
      >
        <div className="space-y-2 text-left">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-emerald-400/60">
            実験責任者（プレイヤー名を入力してください）
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">Dr.</span>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-emerald-500/20 bg-black/40 py-3 pl-12 pr-4 text-lg font-bold text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-emerald-900"
              placeholder="おじさん"
            />
          </div>
        </div>

        <button
          type="submit"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 py-4 text-xl font-black text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <FlaskConical className="h-6 w-6" />
          実験を開始する
        </button>
      </motion.form>

      {/* Footer Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 flex gap-3"
      >
        <button
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-500/10 px-6 py-3 text-emerald-400/80 transition-all hover:bg-emerald-900/30 hover:border-emerald-500/30"
        >
          <BookOpen className="h-5 w-5 text-emerald-400" />
          あそびかた
        </button>
        <button
          onClick={() => router.push("/ranking")}
          className="flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-500/10 px-6 py-3 text-emerald-400/80 transition-all hover:bg-emerald-900/30 hover:border-emerald-500/30"
        >
          <Trophy className="h-5 w-5 text-amber-500" />
          最高傑作図鑑
        </button>
      </motion.div>

      {/* ===== TUTORIAL MODAL ===== */}
      <AnimatePresence>
        {showTutorial && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTutorial(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 overflow-y-auto rounded-2xl border border-emerald-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(16,185,129,0.2)]"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-emerald-500/20 bg-slate-950/90 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white tracking-tight">あそびかた</h2>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-8">

                {/* Game Flow */}
                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/70">実験の流れ</h3>
                  <div className="space-y-3">
                    {STEPS.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex gap-4 p-4 rounded-xl border ${s.step === 'DROP!' ? 'border-amber-500/30 bg-amber-950/20' : 'border-emerald-500/15 bg-emerald-950/15'}`}
                      >
                        <div className="text-3xl shrink-0">{s.icon}</div>
                        <div className="text-left space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${s.step === 'DROP!' ? 'text-amber-400 border-amber-500/40 bg-amber-950/40' : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'}`}>
                              {s.step}
                            </span>
                            <span className="font-black text-white text-sm">{s.title}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Warning */}
                  <div className="flex gap-3 p-3 rounded-xl border border-rose-500/30 bg-rose-950/20">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-200/80 leading-relaxed text-left">
                      <span className="font-black text-rose-400">注意：</span>水槽に入れ損ねた場合、そのパーツはデフォルトのノーマルおじさんパーツ（🦵👕👴）になります。ミスが多いほどレアリティが下がる可能性がございますので、ご注意ください。
                    </p>
                  </div>
                </section>

                {/* Rarity Table */}
                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400/70">レアリティ &amp; スコア表</h3>
                  <p className="text-xs text-slate-500 text-left">斬新な組み合わせほど高レアリティ。目指せSECRET！</p>
                  <div className="space-y-2">
                    {RARITIES.map((r, i) => (
                      <motion.div
                        key={r.rarity}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${r.bg} ${r.glow}`}
                      >
                        <span className={`w-14 text-center font-black text-sm shrink-0 ${r.color}`}>{r.rarity}</span>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{r.label}</div>
                          <div className="text-[10px] text-slate-400 truncate">{r.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 text-right">{r.score}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <FlaskConical className="h-5 w-5" />
                  わかりました！実験へ
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
