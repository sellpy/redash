// Basic Gemini API service for chat
// You need to set your Gemini API key in a secure way (env, backend proxy, etc.)

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function sendMessageToGemini(message, apiKey) {
  const body = {
    contents: [{ parts: [{ text: message }] }]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}` , {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with Gemini API");
  }

  const data = await response.json();
  // Gemini returns the response in data.candidates[0].content.parts[0].text
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
}
