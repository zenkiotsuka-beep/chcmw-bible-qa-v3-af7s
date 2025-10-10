// api/ask.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Please use POST." });
    }

    // Minimal test response (no OpenAI yet)
    console.log("DEBUG: Minimal ask.js hit:", req.body);

    return res.status(200).json({
      answer: "Hello from Macros Sensei",
      received: req.body
    });
  } catch (error) {
    console.error("DEBUG: Unexpected Error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
