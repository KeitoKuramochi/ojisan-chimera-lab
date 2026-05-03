"use server";

import { model } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

export async function saveChimera(data: {
  doctor_name: string;
  score: number;
  rarity: string;
  species_name: string;
  scientific_name: string;
  description: string;
  parts: string; // JSON string of parts
}) {
  const { error } = await supabase.from("chimera_ranking").insert([data]);
  if (error) {
    console.error("Supabase Save Error:", error);
    return { success: false, error };
  }
  return { success: true };
}

export async function evaluateChimera(parts: any[], mutationLevel: number) {
  const head = parts.find(p => p.phase === 'HEAD')?.emoji || "👴";
  const body = parts.find(p => p.phase === 'BODY')?.emoji || "👕";
  const legs = parts.find(p => p.phase === 'LEGS')?.emoji || "🦵";

  console.log("--- Chimera Evaluation Started ---");
  console.log(`Input Parts: Head:${head}, Body:${body}, Legs:${legs}`);

  if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables.");
  }

  // デフォルトパーツかどうかを判定
  const defaultParts = { head: "👴", body: "👕", legs: "🦵" };
  const defaultCount = [
    head === defaultParts.head,
    body === defaultParts.body,
    legs === defaultParts.legs,
  ].filter(Boolean).length;

  const prompt = `
あなたは「おじさんキメララボ」の公式鑑定AIです。
ベースとなる普通のおじさん（頭:👴 体:👕 脚:🦵）に3つの素材を融合させ、誕生したキメラ個体を鑑定してください。

【今回の融合素材】
・頭部: ${head}
・胴体: ${body}
・脚部: ${legs}

【このゲームの根本ルール ― 必ず厳守してください】
このゲームは「どれだけデフォルトのおじさん（👴👕🦵）から遠ざかれるか＝新種度」がスコアの根幹です。

▼ デフォルトパーツ（普通のおじさん）：
  頭部=👴、胴体=👕、脚部=🦵

▼ 新種度の判定方法：
  - 3パーツ全てがデフォルト（👴👕🦵）のまま → 完全に失敗。必ずOJISANを付与。
  - 2パーツがデフォルト → 軽微な変異のみ。N か低めのR 相当。
  - 1パーツだけデフォルト → そこそこの変異。R〜SR 相当。
  - 3パーツ全て非デフォルト → 高い変異。SR〜UR 相当。
  - さらに3パーツ全てが人間・人型から完全に逸脱した組み合わせ → SEC候補。

▼ 組み合わせの「奇抜さ・意外性」も加味してください：
  たとえ非デフォルトでも、似たような人体パーツの組み合わせは低め。
  宇宙・自然・機械・食物・生物など、カテゴリが全く異なる素材が混ざるほど高得点。

▼ 現在のデフォルト一致数: ${defaultCount}/3
  ※ この数値を必ずレアリティ判定に反映すること。

【レアリティとスコアの基準】
- OJISAN: デフォルト3体一致、または変異ほぼゼロ。スコア: 0〜9,999
- N: デフォルト2体一致。ほぼおじさん。スコア: 10,000〜99,999
- R: デフォルト1〜2体一致。少し変異あり。スコア: 100,000〜299,999
- SR: 非デフォルトが2体以上で意外な組み合わせ。スコア: 300,000〜499,999
- SSR: 3体全て非デフォルト、かつ組み合わせに奇跡的なシナジー。スコア: 500,000〜699,999
- UR: 3体全て非デフォルトで、カテゴリが全く異なる驚愕の個体。スコア: 700,000〜899,999
- SEC: 3体全てが既存の生命体の概念を超えた、宇宙規模の奇跡。スコア: 900,000〜1,000,000

【生態解説（description）のガイドライン】
- 誕生したキメラの「特技」「弱点」「好物」「深夜の過ごし方」など個性が立つ情報を、マッドサイエンティスト風に30〜50文字で記述してください。
- 「ズレ」などのゲーム内の物理現象には絶対に触れないでください。
- 毎回異なる切り口（哲学的な悩み・近所付き合い・生物学的矛盾など）でバリエーション豊かに出力してください。

出力は必ず以下のJSON形式のみとし、他の文章やMarkdownは一切含めないでください。

{
  "species_name": "新種名（インパクト重視、15文字以内）",
  "species_furigana": "ふりがな（ひらがなのみ）",
  "rarity": "SEC/UR/SSR/SR/R/N/OJISANのいずれか",
  "description": "生態解説（30〜50文字）",
  "score": 0〜1000000の整数
}
  `;

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(`AI Raw Response (Attempt ${attempts}):`, text);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not find JSON in AI response");

      const parsed = JSON.parse(jsonMatch[0]);
      console.log("Evaluation Success:", parsed.species_name);

      return {
        species_name: parsed.species_name,
        scientific_name: parsed.species_furigana, // データベース互換性のため scientific_name フィールドにふりがなを格納
        rarity: parsed.rarity,
        description: parsed.description,
        score: parsed.score,
        is_fallback: false,
        error_type: null
      };
    } catch (error: any) {
      console.error(`Chimera Evaluation Attempt ${attempts} failed:`, error.message);

      const isRateLimit = error.message?.includes("429") || error.status === 429;

      if (isRateLimit && attempts < maxAttempts) {
        console.log("Rate limit hit. Waiting 2s before retry...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      // Final failure
      return {
        species_name: "名もなき融合体",
        scientific_name: "なもなきゆうごうたい",
        rarity: "N",
        description: "実験の失敗作。深夜の研究所で独り言を呟きながら徘徊する。非常に哀愁深い。",
        score: mutationLevel * 100,
        is_fallback: true,
        error_type: isRateLimit ? "RATE_LIMIT" : "API_ERROR"
      };
    }
  }
}
