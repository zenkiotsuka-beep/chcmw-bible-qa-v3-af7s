import OpenAI from "openai";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Bible Q&A assistant for CHCMW. Answer in the language of the question (English or Japanese)." },
        { role: "user", content: question }
      ],
    });
    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}