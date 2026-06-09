"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { evaluateChimera, saveChimera } from "./actions";
import confetti from "canvas-confetti";
import { Home, Trophy, Loader2, Zap, FlaskConical, Dna } from "lucide-react";

export default function ResultScreen() {
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [parts, setParts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResult = async () => {
      const savedParts = sessionStorage.getItem("chimera_result_parts");
      if (!savedParts) {
        router.push("/");
        return;
      }

      const parsedParts = JSON.parse(savedParts);
      setParts(parsedParts);

      // Check if we already have the evaluation from the animation phase
      const precomputedData = sessionStorage.getItem("chimera_evaluation_data");
      let result;

      if (precomputedData) {
        result = JSON.parse(precomputedData);
        // Clean up
        sessionStorage.removeItem("chimera_evaluation_data");
      } else {
        const mutationLevel = parseInt(sessionStorage.getItem("chimera_mutation_level") || "0");
        result = await evaluateChimera(parsedParts, mutationLevel);
      }

      setEvaluation(result);

      // ランキング保存は一時無効化中
      // setIsSaving(true);
      // const doctorName = localStorage.getItem("chimera_doctor_name") || "不明な博士";
      // await saveChimera({
      //   doctor_name: doctorName,
      //   score: result.score,
      //   rarity: result.rarity,
      //   species_name: result.species_name,
      //   scientific_name: result.scientific_name,
      //   description: result.description,
      //   parts: savedParts
      // });
      // setIsSaving(false);

      // Immediately show if precomputed, or wait briefly if not
      setShowResult(true);
      if (result.rarity === "SSR" || result.rarity === "SR") {
        confetti({
          particleCount: 200,
          spread: 90,
          colors: result.rarity === "SSR" ? ['#fbbf24', '#f59e0b', '#fbbf24'] : ['#a855f7', '#d946ef', '#c084fc'],
          origin: { y: 0.6 }
        });
      }
    };

    fetchResult();
  }, [router]);

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
          />
          <Dna className="absolute inset-0 m-auto h-12 w-12 text-emerald-400 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">DNA FUSING...</h2>
          <p className="text-emerald-500/60 font-mono text-xs tracking-widest uppercase">Initializing Biological Synthesis</p>
        </div>
      </div>
    );
  }

  const rarityColors = {
    "SEC": "text-white border-white/50 bg-slate-100/20 shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-pulse",
    "UR": "text-rose-400 border-rose-500/50 bg-rose-950/30 shadow-[0_0_20px_rgba(244,63,94,0.4)]",
    "SSR": "text-amber-400 border-amber-400/50 bg-amber-950/30 shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    "SR": "text-purple-400 border-purple-400/50 bg-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    "R": "text-blue-400 border-blue-400/50 bg-blue-950/30",
    "N": "text-slate-400 border-slate-400/50 bg-slate-950/30",
    "OJISAN": "text-orange-900 border-orange-900/30 bg-orange-100/10 grayscale-[0.5]"
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        className="glass-card p-10 text-center space-y-8 relative overflow-hidden border-emerald-500/30 bg-slate-950/80 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {evaluation.is_fallback ? (
            <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded text-[8px] font-mono border border-rose-500/20">
              <FlaskConical className="h-2 w-2" />
              {evaluation.error_type === 'RATE_LIMIT' 
                ? "AI QUOTA EXCEEDED (RESTING...)" 
                : "AI CONNECTION ERROR"}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[8px] font-mono border border-emerald-500/20">
              <Zap className="h-2 w-2 fill-emerald-500" />
              AI EVALUATION COMPLETE
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 p-4 opacity-20"><Dna className="h-16 w-16 text-emerald-400" /></div>
        
        <div className="relative z-10 space-y-2 text-center">
          <div className="text-[10px] text-emerald-500/60 font-mono font-bold tracking-[0.4em] uppercase mb-2">おじさんキメララボ</div>
          <div className={`inline-block px-6 py-1 rounded-full border-2 font-black tracking-widest text-2xl mb-4 ${rarityColors[evaluation.rarity as keyof typeof rarityColors] || rarityColors.N}`}>
            {evaluation.rarity}
          </div>
          <div className="flex flex-col items-center">
            <div className="text-emerald-400/60 font-bold text-xs tracking-[0.3em] uppercase mb-1">
              {evaluation.scientific_name}
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {evaluation.species_name}
            </h2>
          </div>
        </div>

        {/* Visualizer Area (Upgraded with Base Model) */}
        <div className="relative h-80 bg-emerald-950/20 rounded-2xl border border-emerald-500/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)] animate-pulse" />
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Base Ojisan Model */}
            <img 
              src="/ojisan_base.png" 
              alt="Base Model" 
              className="absolute inset-0 w-full h-full object-contain opacity-80"
            />

            {/* EMOJI OVERLAYS (Chimera Parts) */}
            {parts.map((p, i) => {
              const emoji = p.emoji;
              if (p.phase === 'HEAD') {
                return (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-[8%] left-1/2 -translate-x-1/2 text-7xl z-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  >
                    {emoji}
                  </motion.div>
                );
              }
              if (p.phase === 'BODY') {
                return (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-[35%] left-1/2 -translate-x-1/2 text-8xl z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    {emoji}
                  </motion.div>
                );
              }
              if (p.phase === 'LEGS') {
                return (
                  <div key={i}>
                    {/* Left Leg */}
                    <motion.div 
                      initial={{ scale: 0, x: -20 }} animate={{ scale: 1, x: 0 }}
                      className="absolute bottom-[5%] left-[28%] text-6xl z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    >
                      {emoji}
                    </motion.div>
                    {/* Right Leg */}
                    <motion.div 
                      initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }}
                      className="absolute bottom-[5%] right-[28%] text-6xl z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    >
                      {emoji}
                    </motion.div>
                  </div>
                );
              }
              return null;
            })}

            {/* Fusion Glow Effect */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-[40px] rounded-full -z-10 animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="text-[10px] text-emerald-500/60 uppercase tracking-[0.2em] mb-1">Experiment Result</div>
          <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">
            {evaluation.rarity} <span className="text-xl">GRADE</span>
          </div>
          <div className="text-[8px] text-emerald-500/40 uppercase tracking-[0.1em]">融合個体の品質チェック：合格</div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="bg-black/40 p-6 rounded-xl border border-emerald-500/20 text-emerald-50 text-lg leading-relaxed shadow-inner">
            <Activity className="h-4 w-4 text-emerald-400 mb-2 mx-auto" />
            「{evaluation.description}」
          </div>
          <div className="flex flex-col items-center opacity-60">
            <div className="text-[8px] text-emerald-500/40 uppercase tracking-[0.1em]">獲得スコア</div>
            <div className="text-2xl font-bold text-emerald-200 font-mono">
              {evaluation.score.toLocaleString()} pts
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 gap-4"
      >
        {/* ランキングボタンは一時無効化中 */}
        {/* <button
          onClick={() => router.push("/ranking")}
          className="group relative flex items-center justify-center gap-2 py-4 bg-emerald-600 rounded-xl font-black text-xl text-white overflow-hidden transition-all hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <Trophy className="h-6 w-6" />
          図鑑を確認する
        </button> */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 py-4 bg-slate-900 border border-emerald-500/20 rounded-xl font-black text-xl text-emerald-400 transition-all hover:bg-slate-800"
        >
          <FlaskConical className="h-6 w-6" />
          次の実験を開始する
        </button>
      </motion.div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  );
}
