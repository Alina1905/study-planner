/* ============================================================
   Rehearsal — ai.js
   Thin wrapper around Groq's OpenAI-compatible chat completion API.
   The API key never leaves the user's browser except in the direct
   request to Groq — there is no backend server in this app.
   ============================================================ */

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Sends the conversation to Groq and returns the assistant's reply text.
 * @param {string} apiKey
 * @param {Array<{role:string, content:string}>} history - prior turns (user/assistant only)
 * @param {string} systemPrompt
 * @returns {Promise<string>}
 */
async function askGroq(apiKey, history, systemPrompt) {
  if (!apiKey) throw new Error("missing-key");

  const messages = [{ role: "system", content: systemPrompt }, ...history];

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 700,
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message || "";
    } catch (_) {}
    if (res.status === 401) throw new Error("invalid-key");
    throw new Error(detail || `groq-error-${res.status}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply. Try again.";
}
