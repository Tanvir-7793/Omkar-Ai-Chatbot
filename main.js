const API_KEY = "AIzaSyAnMk65SnShbRnhJqE-qiMH04xuI3nts_0"; // 🔐 Keep secure in production
const MODEL = "gemini-2.5-flash-preview-04-17"; // ✅ Latest model
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Gemini 2.5 Chatbot initialized");

  document.getElementById("sendButton").addEventListener("click", () => sendMessage());
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  inputField.value = "";

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 1,
          topK: 1
        }
      })
    });

    const data = await response.json();

    if (response.ok) {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
      appendMessage("bot", text);
    } else {
      console.error("❌ API error:", data);
      appendMessage("bot", "❌ Gemini API error: " + data.error?.message);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    appendMessage("bot", "❌ Network or API error occurred.");
  }
}

function appendMessage(sender, message) {
  const chatContainer = document.getElementById("chatContainer");
  const messageDiv = document.createElement("div");
  messageDiv.className = `flex ${sender === "user" ? "justify-end" : "justify-start"}`;

  const bubble = document.createElement("div");
  bubble.className = `${
    sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
  } p-3 rounded-lg max-w-[80%] whitespace-pre-wrap my-2 shadow-md rounded-2xl`;
  bubble.textContent = message;

  messageDiv.appendChild(bubble);
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
