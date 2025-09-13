// api/ask.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // 🔑 Set in Vercel env
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight + cost-effective
      messages: [
        {
          role: "system",
          content:
            "You are Macros Sensei, a Christian AI guide. Always give biblical, faithful, and encouraging answers.",
        },
        { role: "user", content: question },
      ],
    });

    const answer = response.choices[0].message.content.trim();

    res.status(200).json({ answer });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
