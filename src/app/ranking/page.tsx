"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Trophy, Home, Loader2, FlaskConical, Activity, Search, ArrowUpDown, SortAsc, SortDesc, Clock, X } from "lucide-react";

const RARITY_ORDER = ["SEC", "UR", "SSR", "SR", "R", "N", "OJISAN"] as const;

const RARITY_STYLES: Record<string, string> = {
  "SEC":    "text-white border-white/50 bg-slate-100/20",
  "UR":     "text-rose-400 border-rose-500/50 bg-rose-950/20",
  "SSR":    "text-amber-400 border-amber-400/30 bg-amber-950/20",
  "SR":     "text-purple-400 border-purple-400/30 bg-purple-950/20",
  "R":      "text-blue-400 border-blue-400/30 bg-blue-950/20",
  "N":      "text-slate-400 border-slate-400/30 bg-slate-950/20",
  "OJISAN": "text-orange-800 border-orange-900/20 bg-orange-100/10",
};

type SortMode = "score_desc" | "score_asc" | "newest";

function RankingContent() {
  const router = useRouter();
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // フィルター状態
  const [selectedRarities, setSelectedRarities] = useState<Set<string>>(new Set());
  const [nameQuery, setNameQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("score_desc");

  // 全件取得（フィルタリングはクライアント側）
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("chimera_ranking")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!error && data) setAllData(data);
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // レアリティトグル
  const toggleRarity = (r: string) => {
    setSelectedRarities(prev => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  };

  // フィルター＆ソート適用
  const filtered = useMemo(() => {
    let result = [...allData];

    // レアリティフィルター
    if (selectedRarities.size > 0) {
      result = result.filter(item => selectedRarities.has(item.rarity));
    }

    // 名前検索（部分一致・大文字小文字無視）
    if (nameQuery.trim()) {
      const q = nameQuery.trim().toLowerCase();
      result = result.filter(item =>
        item.doctor_name?.toLowerCase().includes(q)
      );
    }

    // 並び替え
    if (sortMode === "score_desc") result.sort((a, b) => b.score - a.score);
    else if (sortMode === "score_asc") result.sort((a, b) => a.score - b.score);
    else if (sortMode === "newest") result.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return result;
  }, [allData, selectedRarities, nameQuery, sortMode]);

  const hasFilter = selectedRarities.size > 0 || nameQuery.trim();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase opacity-60">
          <Activity className="h-3 w-3" />
          Classified Archives
          <Activity className="h-3 w-3" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white flex items-center justify-center gap-3">
          <FlaskConical className="h-8 w-8 text-emerald-500" />
          最高傑作図鑑
        </h1>
      </div>

      {/* ===== FILTER PANEL ===== */}
      <div className="space-y-3 p-4 rounded-2xl border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md">

        {/* 名前検索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
          <input
            type="text"
            value={nameQuery}
            onChange={e => setNameQuery(e.target.value)}
            placeholder="Dr. 名前で検索..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-sm text-emerald-100 placeholder:text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          {nameQuery && (
            <button
              onClick={() => setNameQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* レアリティフィルター */}
        <div className="flex flex-wrap gap-2">
          {RARITY_ORDER.map(r => (
            <button
              key={r}
              onClick={() => toggleRarity(r)}
              className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${
                selectedRarities.has(r)
                  ? RARITY_STYLES[r] + " scale-105 shadow-lg"
                  : "text-slate-500 border-slate-700 bg-slate-900/50 hover:border-slate-500"
              }`}
            >
              {r}
            </button>
          ))}
          {selectedRarities.size > 0 && (
            <button
              onClick={() => setSelectedRarities(new Set())}
              className="px-3 py-1 rounded-full text-[11px] font-bold border border-slate-700 text-slate-500 hover:text-white hover:border-slate-400 transition-all flex items-center gap-1"
            >
              <X className="h-2.5 w-2.5" />
              クリア
            </button>
          )}
        </div>

        {/* 並び替え */}
        <div className="flex gap-2 flex-wrap">
          {([
            { mode: "score_desc" as SortMode, label: "スコア高い順", icon: <SortDesc className="h-3 w-3" /> },
            { mode: "score_asc"  as SortMode, label: "スコア低い順", icon: <SortAsc  className="h-3 w-3" /> },
            { mode: "newest"     as SortMode, label: "新着順",       icon: <Clock    className="h-3 w-3" /> },
          ] as const).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                sortMode === mode
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ヒット件数 */}
        <div className="text-[10px] text-slate-600 font-mono text-right">
          {isLoading ? "読み込み中..." : `${filtered.length} 件 / 全 ${allData.length} 件`}
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-emerald-500/40 font-mono animate-pulse">ACCESSING DATABASE...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="group relative flex items-center gap-6 p-4 bg-slate-900/40 backdrop-blur-md border border-emerald-500/10 rounded-2xl hover:border-emerald-500/40 transition-all hover:bg-slate-900/60"
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0 w-12 text-center">
                  <span className="text-2xl font-black text-emerald-500/40 font-mono italic">#{i + 1}</span>
                </div>

                {/* Chimera Preview */}
                <div className="relative w-24 h-24 bg-black/40 rounded-xl border border-emerald-500/10 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
                  <div className="relative flex flex-col-reverse items-center scale-75 group-hover:scale-90 transition-transform duration-500">
                    {(() => {
                      try {
                        const parts = JSON.parse(item.parts);
                        return parts.map((p: any, j: number) => {
                          if (p.phase === 'LEGS') {
                            return (
                              <div key={j} className="flex gap-1 -mt-1">
                                <span className="text-3xl">{p.emoji}</span>
                                <span className="text-3xl">{p.emoji}</span>
                              </div>
                            );
                          }
                          return <span key={j} className={`text-4xl ${p.phase === 'BODY' ? 'text-6xl -mt-2' : '-mt-1'}`}>{p.emoji}</span>;
                        });
                      } catch(e) { return <span className="text-4xl">？</span>; }
                    })()}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${RARITY_STYLES[item.rarity] || RARITY_STYLES.N}`}>
                          {item.rarity}
                        </span>
                        <div className="flex flex-col">
                          <div className="text-[8px] text-emerald-500/60 font-bold tracking-widest uppercase -mb-1">
                            {item.scientific_name}
                          </div>
                          <h2 className="text-xl font-black text-white truncate tracking-tight">{item.species_name}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-emerald-500/40 uppercase tracking-tighter">Mutation</div>
                      <div className="text-xl font-black text-emerald-400 font-mono tracking-tighter">
                        {item.score.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-lg border border-emerald-500/10 text-xs text-emerald-50/70 italic leading-relaxed">
                    「{item.description}」
                  </div>

                  <div className="text-[10px] text-slate-500 text-right">
                    実験責任者: Dr. {item.doctor_name}
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-24 space-y-3"
              >
                <div className="text-5xl">🔬</div>
                <p className="text-emerald-500/20 italic font-mono text-sm">
                  {hasFilter ? "該当する個体が見つかりませんでした。" : "DATABASE EMPTY... 記録がありません。"}
                </p>
                {hasFilter && (
                  <button
                    onClick={() => { setSelectedRarities(new Set()); setNameQuery(""); }}
                    className="text-xs text-emerald-500/50 hover:text-emerald-400 underline underline-offset-2 transition-colors"
                  >
                    フィルターをリセットする
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}

      <button
        onClick={() => router.push("/")}
        className="group flex items-center justify-center gap-2 w-full py-4 bg-slate-900 border border-emerald-500/20 rounded-xl font-black text-xl text-emerald-400 hover:bg-slate-800 transition-all"
      >
        <Home className="h-6 w-6 group-hover:scale-110 transition-transform" />
        ラボの入り口へ戻る
      </button>
    </div>
  );
}

export default function RankingScreen() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-emerald-500/40 font-mono">LOADING ARCHIVES...</p>
      </div>
    }>
      <RankingContent />
    </Suspense>
  );
}

