
async function askQuestion() {
  const question = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");
  const debugLog = document.getElementById("debugLog");

  responseBox.innerText = "Thinking...";
  debugLog.innerText = "";

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
    debugLog.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    responseBox.innerText = "Error occurred.";
    debugLog.innerText = "Fetch error: " + err.message;
  }
}
