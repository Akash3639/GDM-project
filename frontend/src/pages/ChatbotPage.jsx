import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import {
  Bot,
  Send,
  Moon,
  Sun,
  Mic,
  Trash2,
  Languages,
} from "lucide-react";

import api from "../api";
import "./chatbot.css";

const LANGUAGES = {
  en: "English",
  kn: "Kannada",
  hi: "Hindi",
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello 👋 I am your AI Pregnancy & GDM Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [chatHistory, setChatHistory] = useState([]);

  const messagesEndRef = useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =====================================================
  // SAVE CHAT HISTORY
  // =====================================================

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    const stored = localStorage.getItem("chat_history");

    if (stored) {
      setChatHistory(JSON.parse(stored));
    }
  }, []);

  // =====================================================
  // VOICE INPUT
  // =====================================================

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      language === "hi"
        ? "hi-IN"
        : language === "kn"
        ? "kn-IN"
        : "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };

  // =====================================================
  // STREAMING EFFECT
  // =====================================================

  const streamResponse = async (text) => {
    let current = "";

    const assistantMessage = {
      role: "assistant",
      text: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      await new Promise((resolve) => setTimeout(resolve, 10));

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = current;
        return updated;
      });
    }
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chatbot/public", {
        message: currentInput,
        language,
        history: messages,
      });

      const aiReply = response.data.response;

      await streamResponse(aiReply);

      setChatHistory((prev) => [
        {
          title: currentInput.slice(0, 30),
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Failed to connect to AI service.",
        },
      ]);
    }

    setLoading(false);
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared successfully 👋",
      },
    ]);
  };

  return (
    <div className={darkMode ? "chat-app dark" : "chat-app"}>
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside className="sidebar">
        <div className="sidebar-header">
          <Bot size={28} />
          <h2>AI Care</h2>
        </div>

        <button className="new-chat-btn" onClick={clearChat}>
          + New Chat
        </button>

        <div className="history-section">
          <h3>Recent Chats</h3>

          {chatHistory.length === 0 && (
            <p className="empty-history">No recent chats</p>
          )}

          {chatHistory.map((chat, index) => (
            <div key={index} className="history-item">
              <p>{chat.title}</p>
              <span>{chat.date}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ===================================================== */}
      {/* MAIN CHAT */}
      {/* ===================================================== */}

      <main className="main-chat">
        {/* HEADER */}

        <header className="chat-header">
          <div>
            <h1>Pregnancy AI Assistant</h1>
            <p>Smart Maternal Healthcare Companion</p>
          </div>

          <div className="header-controls">
            <div className="language-box">
              <Languages size={18} />

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(LANGUAGES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* MESSAGES */}

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${msg.role}`}
            >
              <div className={`avatar ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <Bot size={22} className="bot-avatar" />
                ) : (
                  "👤"
                )}
              </div>

              <div className={`message-bubble ${msg.role}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* INPUT */}

        <div className="chat-input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask anything about pregnancy, GDM, nutrition..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="icon-btn" onClick={startVoiceInput}>
              <Mic size={20} />
            </button>

            <button className="icon-btn" onClick={clearChat}>
              <Trash2 size={20} />
            </button>

            <button className="send-btn" onClick={sendMessage}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
