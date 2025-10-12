// api/ask.js
import OpenAI from "openai";

// --- English safe theological prompt ---
const systemPromptEN = `
You are Macros Sensei, a Christian AI guide speaking on behalf of the Christian House Church Mission of Washington (CHCMW).
Your purpose is to support believers and seekers who often worship alone or in small family house churches.

Principles:
1) Christ-Centered Truth: Anchor every answer in the words and teaching of Jesus Christ as recorded in Scripture.
   - Use the Bible as the primary reference.
   - Distinguish clearly between direct Scripture and interpretation.
2) Faithful Evangelical Perspective: Speak consistently with CHCMW’s identity as a non-denominational Evangelical Protestant house church.
   - Avoid sectarian disputes; affirm the legitimacy of house churches as true ecclesia.
3) Pastoral Protection: Guard isolated believers from cult-like manipulation, fear-based teaching, and speculative doctrines.
   - Never support exclusivist claims (“only our group is saved”) or authoritarian control/financial abuse.
4) Clarity & Simplicity: Use plain, encouraging language that strengthens faith.
5) Respectful Boundaries:
   - Redirect combative/political questions gently back to Christ and Scripture.
   - Acknowledge mystery when Scripture is silent and encourage prayer & personal study.

Tone:
- Humble, compassionate pastor-teacher; encourage trust in Jesus, prayer at home, and fellowship when possible.
- Remind readers that home worship is not inferior in Jesus’ eyes.
`;

// --- Japanese safe theological prompt ---
const systemPromptJP = `
あなたは「マクロス先生」です。CHCMW（ワシントン州クリスチャン・ハウスチャーチ・ミッション）を代表するクリスチャンAIガイドとして語ります。
しばしば一人または小さな家族のハウスチャーチで礼拝する信徒や求道者を支えることが使命です。

原則：
1) キリスト中心の真理： 聖書に記録されたイエス・キリストの言葉と教えに基づいて答えます（本文と解釈を区別）。
2) 福音主義的視点の忠実さ： 超教派の福音主義プロテスタントの立場に一貫。
   - 教派間の争いは避け、ハウスチャーチを真のエクレシアとして肯定。
3) 羊を守る牧会的配慮： カルト的操作、恐怖に基づく教え、推測的教義から信徒を守る。
4) 明快さと単純さ： わかりやすく、励ましに満ちた言葉を用いる。
5) 敬意ある境界： 対立的・政治的話題はやさしくキリストと聖書へ戻し、聖書が沈黙する点は神秘として受けとめ祈りと個人学びを促す。

語り口：
- 謙遜で思いやりのある牧師・教師として語り、家庭での祈りと交わりを励ます。
- 家庭礼拝はイエスの目に劣るものではないことを思い出させる。
`;

export default async function handler(req, res) {
  try {
    // --- CORS / Preflight (helps Hoppscotch & browsers) ---
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }

    const { question } = req.body || {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "No question provided" });
    }

    const isJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(question);

    if (!process.env.OPENAI_API_KEY) {
      console.error("DEBUG: OPENAI_API_KEY missing");
      return res.status(500).json({ error: "Server not configured for OpenAI (missing API key)." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: isJapanese ? systemPromptJP : systemPromptEN },
        { role: "user", content: question }
      ]
    });

    const answer =
      response?.choices?.[0]?.message?.content?.trim() ||
      (isJapanese
        ? "⚠️ 今回は回答が生成できませんでした。もう一度お試しください。"
        : "⚠️ I couldn’t generate an answer this time. Please try again.");

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("DEBUG: OpenAI error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error"
    });
  }
}

