import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing question" });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an assistant who helps users understand the Bible. Answer in the same language the question was asked in (English or Japanese).",
        },
        { role: "user", content: question }
      ]
    });
    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
