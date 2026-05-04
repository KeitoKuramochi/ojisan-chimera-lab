"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Matter from "matter-js";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Zap, Activity, Waves, Target } from "lucide-react";
import { evaluateChimera } from "../result/actions";

// Configuration
const RANDOM_EMOJIS = [
  // 表情・人
  "😄", "😃", "😀", "😊", "☺", "😉", "😍", "😘", "😚", "😗", "😙", "😜", "😝", "😛", "😳", "😁", "😔", "😌", "😒", "😞", "😣", "😢", "😂", "😭", "😪", "😥", "😰", "😅", "😓", "😩", "😫", "😨", "😱", "😠", "😡", "😤", "😖", "😆", "😋", "😷", "😎", "😴", "😵", "😲", "😟", "😦", "😧", "😈", "👿", "😮", "😬", "😐", "😕", "😯", "😶", "😇", "😏", "😑", "👲", "👳", "👮", "👷", "💂", "👶", "👦", "👧", "👨", "👩", "👴", "👵", "👱", "👼", "👸", "😺", "😸", "😻", "😽", "😼", "🙀", "😿", "😹", "😾", "👹", "👺", "🙈", "🙉", "🙊", "💀", "👽", "💩",
  // 効果・体
  "🔥", "✨", "🌟", "💫", "💥", "💢", "💦", "💧", "💤", "💨", "👂", "👀", "👃", "👅", "👄", "👍", "👎", "👌", "👊", "✊", "✌", "👋", "✋", "👐", "👆", "👇", "👉", "👈", "🙌", "🙏", "☝", "👏", "💪",
  // 家族・身なり
  "🎩", "👑", "👒", "👟", "👞", "👡", "👠", "👢", "👕", "👔", "👚", "👗", "🎽", "👖", "👘", "👙", "💼", "👜", "👝", "👛", "👓", "🎀", "🌂", "💄", "💍", "💎",
  // 動物・自然
  "🐶", "🐺", "🐱", "🐭", "🐹", "🐰", "🐸", "🐯", "🐨", "🐻", "🐷", "🐽", "🐮", "🐗", "🐵", "🐒", "🐴", "🐑", "🐘", "🐼", "🐧", "🐦", "🐤", "🐥", "🐣", "🐔", "🐍", "🐢", "🐛", "🐝", "🐜", "🐞", "🐌", "🐙", "🐚", "🐠", "🐟", "🐬", "🐳", "🐋", "🐄", "🐏", "🐀", "🐃", "🐅", "🐇", "🐉", "🐎", "🐐", "🐓", "🐕", "🐖", "🐁", "🐂", "🐲", "🐡", "🐊", "🐫", "🐪", "🐆", "🐈", "🐩", "🐾", "💐", "🌸", "🌷", "🍀", "🌹", "🌻", "🌺", "🍁", "🍃", "🍂", "🌿", "🌾", "🍄", "🌵", "🌴", "🌲", "🌳", "🌰", "🌱", "🌼", "🌐", "🌞", "🌝", "🌚", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌜", "🌛", "🌙", "🌍", "🌎", "🌏", "🌋", "🌌", "🌠", "⭐", "☀", "⛅", "☁", "⚡", "☔", "❄", "⛄", "🌀", "🌁", "🌈", "🌊",
  // 小物・食べ物
  "🎍", "💝", "🎎", "🎒", "🎓", "🎏", "🎆", "🎇", "🎐", "🎑", "🎃", "👻", "🎅", "🎄", "🎁", "🎋", "🎉", "🎊", "🎈", "🎌", "🔮", "🎥", "📷", "📹", "📼", "💿", "DVD", "💽", "💾", "💻", "📱", "☎", "📞", "📟", "📠", "📡", "📺", "📻", "🔊", "🔉", "🔈", "🔇", "🔔", "🔕", "📢", "📣", "⏳", "⌛", "⏰", "⌚", "🔓", "🔒", "🔏", "🔐", "🔑", "🔎", "💡", "🔦", "🔆", "🔅", "🔌", "🔋", "🔍", "🛁", "🛀", "🚿", "🚽", "🔧", "🔩", "🔨", "🚪", "🚬", "💣", "🔫", "🔪", "💊", "💉", "💰", "💴", "💵", "💷", "💶", "💳", "💸", "📲", "📧", "📥", "📤", "✉", "📩", "📨", "📯", "📫", "📪", "📬", "📭", "📮", "📦", "📝", "📄", "📃", "📑", "📊", "📈", "📉", "📜", "📋", "📅", "📆", "📇", "📁", "📂", "✂", "📌", "📎", "✒", "✏", "📏", "📐", "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📚", "📖", "🔖", "📛", "🔬", "🔭", "📰", "🎨", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🎻", "🎺", "🎷", "🎸", "👾", "🎮", "🃏", "🎴", "🀄", "🎲", "🎯", "🏈", "🏀", "⚽", "⚾", "🎾", "🎱", "🏉", "🎳", "⛳", "🚵", "🚴", "🏁", "🏇", "🏆", "🎿", "🏂", "🏊", "🏄", "🎣", "☕", "🍵", "🍶", "🍼", "🍺", "🍻", "🍸", "🍹", "🍷", "🍴", "🍕", "🍔", "🍟", "🍗", "🍖", "🍝", "🍛", "🍤", "🍱", "🍣", "🍥", "🍙", "🍘", "🍚", "🍜", "🍲", "🍢", "🍡", "🍳", "🍞", "🍩", "🍮", "🍦", "🍨", "🍧", "🎂", "🍰", "🍪", "🍫", "🍬", "🍭", "🍯", "🍎", "🍏", "🍊", "🍋", "🍒", "🍇", "🍉", "🍓", "🍑", "🍈", "🍌", "🍐", "🍍", "🍠", "🍆", "🍅", "🌽",
  // 建物・乗り物
  "🏠", "🏡", "🏫", "🏢", "🏣", "🏥", "🏦", "🏪", "🏩", "🏨", "💒", "⛪", "🏬", "🏤", "🌇", "🌆", "🏯", "🏰", "⛺", "🏭", "🗼", "🗾", "🗻", "🌄", "🌅", "🌃", "🗽", "🌉", "🎠", "🎡", "⛲", "🎢", "🚢", "帆", "🚤", "🚣", "⚓", "🚀", "✈", "💺", "🚁", "🚂", "🚊", "🚉", "🚞", "🚆", "🚄", "🚅", "🚈", "🚇", "🚝", "🚋", "🚃", "🚎", "🚌", "🚍", "🚙", "🚘", "🚗", "🚕", "🚖", "🚛", "🚚", "🚨", "🚓", "🚔", "🚒", "🚑", "🚐", "🚲", "🚡", "🚟", "🚠", "🚜", "💈", "🚏", "🎫", "🚦", "🚥", "⚠", "🚧", "🔰", "⛽", "🏮", "🎰", "♨", "🗿", "🎪", "🎭", "📍", "🚩",
  // 記号・時間
  "❌", "⭕", "❗", "❓", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "✖", "➕", "➖", "➗", "♠", "♥", "♣", "♦", "💮", "💯", "✔", "☑", "🔘", "🔗", "➰", " trident", "🔲", "🔳", "◼", "◻", "◾", "◽", "▪", "▫", "🔺", "⬜", "⬛", "⚫", "⚪", "🔴", "🔵", "🔻", "🔶", "🔷", "🔸", "🔹"
];

// --- 調整用設定 ---
const CONVEYOR_SPEED_FACTOR = 0.4; // 小さくすると速く、大きくすると遅くなります（デフォルト1.2）
// -----------------

type GameState = 'SELECTING_1' | 'DROPPING_1' | 'SELECTING_2' | 'DROPPING_2' | 'SELECTING_3' | 'DROPPING_3' | 'FINISHED';

export default function ActionScreen() {
  const router = useRouter();
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const tankPosRef = useRef({ x: 400, y: 480 });
  const [conveyorItems, setConveyorItems] = useState<{ id: string, emoji: string }[]>([]);
  const [bodies, setBodies] = useState<any[]>([]);
  const [gameState, setGameState] = useState<GameState>('SELECTING_1');
  const [heldEmoji, setHeldEmoji] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const [doctorName, setDoctorName] = useState("");
  const [gameWidth, setGameWidth] = useState(800);
  const [results, setResults] = useState<{ emoji: string, success: boolean }[]>([]);

  useEffect(() => {
    setDoctorName(localStorage.getItem("chimera_doctor_name") || "不明な博士");

    const updateDimensions = () => {
      if (sceneRef.current) {
        setGameWidth(sceneRef.current.clientWidth);
      }
    };
    updateDimensions();

    // Initialize conveyor with a random subset of emojis
    const selectedSubset = [...RANDOM_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // Pick 20 random types for this game

    const pool = [...selectedSubset, ...selectedSubset];
    const longPool: string[] = [];
    // 3 repetitions of the 20-item pool is plenty (120 items total)
    for (let i = 0; i < 3; i++) {
      longPool.push(...pool.sort(() => Math.random() - 0.5));
    }
    const shuffled = longPool.map((emoji, i) => ({ id: `emoji-${i}-${Math.random()}`, emoji }));

    // Randomize start position so we don't always see the same emoji first
    const startIndex = Math.floor(Math.random() * (shuffled.length / 2));
    const randomizedItems = [...shuffled.slice(startIndex), ...shuffled.slice(0, startIndex)];

    setConveyorItems(randomizedItems);

    // Matter.js Setup
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1.0;
    engineRef.current = engine;

    const width = sceneRef.current?.clientWidth || 800;
    const height = sceneRef.current?.clientHeight || 600;

    // Tank Boundaries (Back to standard size)
    const tankW = 260;
    const tankH = 160;
    const thickness = 20;

    const tankY = height - 140;
    const tankBottom = Matter.Bodies.rectangle(width / 2, tankY + tankH / 2, tankW, thickness, { isStatic: true, label: "tank" });
    const tankLeft = Matter.Bodies.rectangle(width / 2 - tankW / 2, tankY, thickness, tankH, { isStatic: true, label: "tank" });
    const tankRight = Matter.Bodies.rectangle(width / 2 + tankW / 2, tankY, thickness, tankH, { isStatic: true, label: "tank" });

    const ground = Matter.Bodies.rectangle(width / 2, height + 40, width, 40, { isStatic: true });

    Matter.Composite.add(engine.world, [tankBottom, tankLeft, tankRight, ground]);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const handleResize = () => {
      if (!sceneRef.current || !engineRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      setGameWidth(w);

      // Update ground position
      Matter.Body.setPosition(ground, { x: w / 2, y: h + 40 });
    };

    window.addEventListener("resize", handleResize);

    const updateInterval = setInterval(() => {
      const w = sceneRef.current?.clientWidth || 800;
      const h = sceneRef.current?.clientHeight || 600;

      // Update Tank Position (Moving Tank relative to current width)
      const tankX = (w / 2) + Math.sin(Date.now() / 1000) * (w * 0.25);
      const tankY = h - 140;
      tankPosRef.current = { x: tankX, y: tankY };

      Matter.Body.setPosition(tankBottom, { x: tankX, y: tankY + tankH / 2 });
      Matter.Body.setPosition(tankLeft, { x: tankX - tankW / 2, y: tankY });
      Matter.Body.setPosition(tankRight, { x: tankX + tankW / 2, y: tankY });

      setTime(t => t + 0.03);
      setBodies(engine.world.bodies
        .filter(b => (b as any).emoji)
        .map(b => ({
          id: b.id,
          x: b.position.x,
          y: b.position.y,
          angle: b.angle,
          emoji: (b as any).emoji
        })));
    }, 1000 / 60);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(updateInterval);
      Matter.Engine.clear(engine);
      Matter.Runner.stop(runner);
    };
  }, []);

  const handleAction = () => {
    if (!engineRef.current || gameState === 'FINISHED') return;
    if (gameState.startsWith('SELECTING') && heldEmoji) return;
    if (gameState.startsWith('DROPPING') && !heldEmoji) return;

    if (gameState.startsWith('SELECTING')) {
      const items = document.querySelectorAll(".emoji-item");
      const centerX = window.innerWidth / 2;
      let closestItem: Element | null = null;
      let minDistance = Infinity;

      for (const item of Array.from(items)) {
        if (item.classList.contains("opacity-0")) continue;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.x + rect.width / 2;
        const distance = Math.abs(itemCenter - centerX);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      }

      if (closestItem) {
        closestItem.classList.add("opacity-0");
        setHeldEmoji(closestItem.textContent);
        const nextState = gameState === 'SELECTING_1' ? 'DROPPING_1' :
          gameState === 'SELECTING_2' ? 'DROPPING_2' : 'DROPPING_3';
        setGameState(nextState as GameState);
      }
    } else {
      // DROPPING Phase
      const w = gameWidth;
      // RELATIVE CHAOTIC CURSOR: Amplitudes based on screen width
      const x = (w / 2) + Math.sin(time * 3.5) * (w * 0.22) + Math.sin(time * 7.2) * (w * 0.08) + Math.cos(time * 15.5) * (w * 0.05);

      const newItem = Matter.Bodies.rectangle(x, 80, 60, 60, {
        restitution: 0.75,
        friction: 0.05,
        render: { fillStyle: "#ffffff" }
      });
      (newItem as any).emoji = heldEmoji;
      (newItem as any).isFalling = true;

      Matter.Composite.add(engineRef.current.world, newItem);
      const currentEmoji = heldEmoji;
      setHeldEmoji(null);

      // Wait for the item to settle
      setTimeout(() => {
        const h = sceneRef.current?.clientHeight || 600;
        const target = tankPosRef.current;
        const mouthHalfWidth = 72;
        const mouthTop = target.y + 10;
        const mouthBottom = target.y + 55;

        // STRICT SUCCESS CHECK: Must be within the mouth target area
        const isWithinX = Math.abs(newItem.position.x - target.x) < mouthHalfWidth;
        const isWithinY = newItem.position.y > mouthTop && newItem.position.y < mouthBottom;

        const isSuccess = isWithinX && isWithinY;

        setResults(prev => [...prev, { emoji: currentEmoji!, success: isSuccess }]);

        if (gameState === 'DROPPING_1') setGameState('SELECTING_2');
        else if (gameState === 'DROPPING_2') setGameState('SELECTING_3');
        else {
          setGameState('FINISHED');

          // PRE-FETCH EVALUATION & SAVE DURING ANIMATION
          const processResult = async () => {
            const finalResults = [...results, { emoji: currentEmoji!, success: isSuccess }];
            const mutationLevel = parseInt(sessionStorage.getItem("chimera_mutation_level") || "0");

            // Start AI evaluation
            const aiPromise = evaluateChimera(
              finalResults.map((r, i) => ({
                emoji: r.success ? r.emoji : (i === 0 ? "🦵" : i === 1 ? "👕" : "👴"),
                phase: i === 0 ? 'LEGS' : i === 1 ? 'BODY' : 'HEAD'
              })),
              mutationLevel
            );

            // Minimum animation time (3s)
            const waitPromise = new Promise(resolve => setTimeout(resolve, 3000));

            // Wait for both
            const [evaluation] = await Promise.all([aiPromise, waitPromise]);

            // Save result data for next page
            sessionStorage.setItem("chimera_evaluation_data", JSON.stringify(evaluation));

            // Navigate
            finishExperiment(finalResults);
          };

          processResult();
        }
      }, 3500);
    }
  };

  const finishExperiment = (finalResults: { emoji: string, success: boolean }[]) => {
    // 0: LEGS, 1: BODY, 2: HEAD
    const successfulParts = [
      { emoji: finalResults[0]?.success ? finalResults[0].emoji : "🦵", phase: 'LEGS' },
      { emoji: finalResults[1]?.success ? finalResults[1].emoji : "👕", phase: 'BODY' },
      { emoji: finalResults[2]?.success ? finalResults[2].emoji : "👴", phase: 'HEAD' },
    ];

    sessionStorage.setItem("chimera_result_parts", JSON.stringify(successfulParts));
    router.push("/result");
  };

  // KEYBOARD CONTROLS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAction();
      }
      if (e.code === 'KeyR' && gameState.startsWith('SELECTING')) {
        // Re-roll materials
        const selectedSubset = [...RANDOM_EMOJIS].sort(() => Math.random() - 0.5).slice(0, 20);
        const pool = [...selectedSubset, ...selectedSubset];
        const longPool: string[] = [];
        for (let i = 0; i < 3; i++) { longPool.push(...pool.sort(() => Math.random() - 0.5)); }
        const shuffled = longPool.map((emoji, i) => ({ id: `emoji-${i}-${Math.random()}`, emoji }));
        const startIndex = Math.floor(Math.random() * (shuffled.length / 2));
        setConveyorItems([...shuffled.slice(startIndex), ...shuffled.slice(0, startIndex)]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleAction, conveyorItems]);

  const cursorX = (gameWidth / 2) + Math.sin(time * 3.5) * (gameWidth * 0.22) + Math.sin(time * 7.2) * (gameWidth * 0.08) + Math.cos(time * 15.5) * (gameWidth * 0.05);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-sans" ref={sceneRef} onClick={handleAction}>
      {/* RESTORED BACKGROUND IMAGE */}
      <div className="absolute inset-0 opacity-40 z-0">
        <img src="/lab_background.png" alt="Lab" className="w-full h-full object-cover" />
      </div>

      {/* CSS OVERLAYS FOR DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#064e3b,0%,#000_80%)] opacity-20 z-0" />
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

      {/* Lab UI Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <h1 className="text-2xl font-black italic tracking-tighter text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
          おじさん<span className="text-white">キメララボ</span>
        </h1>
      </div>

      <div className="absolute top-24 right-6 z-40 pointer-events-none">
        <div className="flex flex-col items-end gap-2">
          <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] font-mono text-emerald-400">
            実験責任者: {doctorName.toUpperCase()}
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-12 h-16 bg-slate-950 border border-emerald-500/20 rounded-lg flex items-center justify-center text-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                {results[i] ? (
                  results[i].success ? (
                    results[i].emoji
                  ) : (
                    <span className="opacity-40 grayscale">
                      {i === 0 ? "🦵" : i === 1 ? "👕" : "👴"}
                    </span>
                  )
                ) : (
                  <span className="opacity-20 grayscale">
                    {i === 0 ? "🦵" : i === 1 ? "👕" : "👴"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[40px] w-[300px] h-[200px] z-10 pointer-events-none transition-all duration-75 ease-linear"
        style={{ left: tankPosRef.current.x, transform: 'translateX(-50%)' }}
      >
        <img
          src="/image.png"
          alt="おじさんの口"
          className="w-full h-full object-contain rounded-3xl shadow-[0_0_45px_rgba(16,185,129,0.2)]"
        />
        <div className="absolute left-1/2 top-[55%] w-[160px] h-[42px] -translate-x-1/2 rounded-2xl border-2 border-emerald-400/60 bg-emerald-500/10 shadow-[0_0_30px_rgba(52,211,153,0.2)] pointer-events-none" />
        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.03, 1] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="absolute left-1/2 top-[55%] w-[180px] h-[46px] -translate-x-1/2 rounded-2xl bg-emerald-500/10 blur-sm"
        />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-500/60 font-mono text-[10px] tracking-[0.3em] uppercase">
          Unit-01: Genetic Mouth
        </div>
      </div>

      {/* GUIDE MESSAGE — top-16, auto-width pill, never overlaps right panel */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-5 py-1.5 bg-black/80 backdrop-blur-xl border border-emerald-500/40 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)] whitespace-nowrap"
        >
          <p className="text-emerald-50 text-xs font-black tracking-[0.08em] uppercase italic flex items-center gap-2">
            <Zap className="h-3 w-3 text-emerald-400 fill-emerald-400 shrink-0" />
            {gameState === 'SELECTING_1' && "1. 足になるパーツをお選びください[SPACE]"}
            {gameState === 'DROPPING_1' && "おじさんの口を狙って落としてください[SPACE]"}
            {gameState === 'SELECTING_2' && "2. 体になるパーツをお選びください[SPACE]"}
            {gameState === 'DROPPING_2' && "タイミングを合わせて口へ落としてください[SPACE]"}
            {gameState === 'SELECTING_3' && "3. 頭になるパーツをお選びください[SPACE]"}
            {gameState === 'DROPPING_3' && "最後です！おじさんの口へ落としてください[SPACE]"}
            {gameState === 'FINISHED' && "分析中..."}
            <Zap className="h-3 w-3 text-emerald-400 fill-emerald-400 shrink-0" />
          </p>
        </motion.div>

        {/* RE-ROLL BUTTON — compact, below guide */}
        {gameState.startsWith('SELECTING') && (
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              const selectedSubset = [...RANDOM_EMOJIS].sort(() => Math.random() - 0.5).slice(0, 20);
              const pool = [...selectedSubset, ...selectedSubset];
              const longPool: string[] = [];
              for (let i = 0; i < 3; i++) { longPool.push(...pool.sort(() => Math.random() - 0.5)); }
              const shuffled = longPool.map((emoji, i) => ({ id: `emoji-${i}-${Math.random()}`, emoji }));
              const startIndex = Math.floor(Math.random() * (shuffled.length / 2));
              setConveyorItems([...shuffled.slice(startIndex), ...shuffled.slice(0, startIndex)]);
            }}
            className="px-5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1.5 pointer-events-auto transition-all font-bold text-[9px] uppercase tracking-widest backdrop-blur-md whitespace-nowrap"
          >
            <Activity className="h-2.5 w-2.5" />
            素材を入れ替える [R]
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {gameState.startsWith('SELECTING') && (
          <motion.div
            initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="absolute top-40 left-0 right-0 h-28 bg-black/80 border-y border-emerald-500/30 flex items-center overflow-hidden z-20 backdrop-blur-xl"
          >
            <div
              className="flex whitespace-nowrap py-4"
              style={{
                animation: `conveyor ${conveyorItems.length * CONVEYOR_SPEED_FACTOR}s linear infinite`,
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              {conveyorItems.map((item) => (
                <div key={item.id} className="emoji-item inline-flex items-center justify-center w-24 h-24 text-6xl cursor-pointer hover:scale-125 transition-transform">
                  {item.emoji}
                </div>
              ))}
            </div>
            {/* CENTER SELECTION LINE */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] z-30 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-8 bg-emerald-500/10 blur-md z-20 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {heldEmoji && (
        <div
          className="absolute top-48 pointer-events-none z-30 flex items-center justify-center text-[10rem]"
          style={{ left: cursorX, transform: 'translateX(-50%)' }}
        >
          <div className="relative">
            {heldEmoji}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-emerald-500/10 blur-[80px] animate-pulse" />
          </div>
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-[60vh] bg-emerald-500/40 border-l border-dashed border-emerald-500/60"
          />
        </div>
      )}

      <AnimatePresence>
        {gameState === 'FINISHED' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative w-96 h-96 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }, delay: i * 0.2 }}
                  className="absolute text-8xl drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]"
                  style={{
                    transformOrigin: "center",
                    top: `${50 + 35 * Math.sin((i * 2 * Math.PI) / 3)}%`,
                    left: `${50 + 35 * Math.cos((i * 2 * Math.PI) / 3)}%`,
                  }}
                >
                  {results[i]?.success ? results[i].emoji : (i === 0 ? "🦵" : i === 1 ? "👕" : "👴")}
                </motion.div>
              ))}
              <motion.div animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-32 h-32 bg-emerald-500 rounded-full blur-[60px]" />
            </div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-12 text-center">
              <h2 className="text-4xl font-black text-emerald-400 tracking-[0.5em] italic animate-pulse">DNA FUSING...</h2>
              <p className="text-emerald-500/60 font-mono text-sm mt-4 tracking-widest uppercase">Initializing Biological Synthesis</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-20">
        {bodies.map((b) => (
          <div
            key={b.id}
            className="absolute select-none pointer-events-none flex items-center justify-center drop-shadow-[0_0_20px_rgba(52,211,153,0.8)] text-7xl"
            style={{ left: b.x, top: b.y, transform: `translate(-50%, -50%) rotate(${b.angle}rad)` }}
          >
            {b.emoji}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes conveyor {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
