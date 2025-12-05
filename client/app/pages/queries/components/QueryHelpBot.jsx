import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessageToGemini } from "@/services/gemini";
import cx from "classnames";
import "./QueryHelpBot.less";
import chat_icon from "@/assets/images/gemini-icon-logo.png";


const QueryHelpBot = ({ queryText }) => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you with your query?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Store API key securely, not hardcoded
  const GEMINI_API_KEY = "AIzaSyD9AjWdbzsJjl6IaocSBloQc0BmvMVhtb0";

  const handleSend = async () => {
    if (input.trim() === "") return;
    setMessages(msgs => [...msgs, { from: "user", text: input }]);
    setLoading(true);
    setError("");
    try {
      // Combine user message and query context
      const context = queryText ? `Query context:\n${queryText}\n\nUser question: ${input}` : input;
      const reply = await sendMessageToGemini(context, GEMINI_API_KEY);
      setMessages(msgs => [...msgs, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: "bot", text: "Sorry, there was an error contacting Gemini." }]);
      setError("Gemini API error");
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className={cx("query-help-bot-wrapper")}> 
      <div className="iconbox" onClick={() => setOpen(!open)}>
        <img alt="charimage" src={chat_icon} className="icon" />
      </div>
      {open && (
        <div className="chatbox-popup">
          <div className="chatbox-header">
            <span>Query HelpBot</span>
            <button className="close-btn" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={cx("chat-message", msg.from)}>
                {msg.from === "bot"
                  ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                  : msg.text}
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input
              type="text"
              placeholder={loading ? "Waiting for Gemini..." : "Type your question..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !loading) handleSend(); }}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </div>
          {error && <div className="chatbox-error">{error}</div>}
        </div>
      )}
    </div>
  );
}

export default QueryHelpBot;