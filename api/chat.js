from pathlib import Path

# Recreate secure chat.js file again for user to upload
secure_dir = Path("/mnt/data/final_secure_api")
secure_dir.mkdir(parents=True, exist_ok=True)

chat_js_code = """
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  initializeApp({ credential: cert(serviceAccount) });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed." });
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No auth token provided" });
  }

  try {
    await getAuth().verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid auth token" });
  }

  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: "OpenAI API error", details: data });
    }

    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "No response." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
"""

chat_path = secure_dir / "chat.js"
chat_path.write_text(chat_js_code)
chat_path
from pathlib import Path

# Recreate secure chat.js file after reset
secure_path = Path("/mnt/data/final_secure_api")
secure_path.mkdir(parents=True, exist_ok=True)

chat_js_content = """
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  initializeApp({ credential: cert(serviceAccount) });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed." });
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No auth token provided" });
  }

  try {
    await getAuth().verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid auth token" });
  }

  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: "OpenAI API error", details: data });
    }

    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "No response." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
"""

chat_file_path = secure_path / "chat.js"
chat_file_path.write_text(chat_js_content)
chat_file_path
