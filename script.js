
async function askQuestion() {
  const question = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");
  responseBox.innerText = "Thinking...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    responseBox.innerText = data.answer || "No response received.";
  } catch (err) {
    responseBox.innerText = "Error: " + err.message;
  }
}
