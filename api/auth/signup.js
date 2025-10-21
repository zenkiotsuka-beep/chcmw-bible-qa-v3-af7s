export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Missing email or password" });
  }

  // Temporary sign-up success (development stub)
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
  return res.status(200).json({ ok: true, token });
}
