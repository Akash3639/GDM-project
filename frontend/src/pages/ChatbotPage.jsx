import { useState, useRef, useEffect } from "react";
import api, { getApiBase, getToken } from "../api";

const quickPrompts = [
  { category: "🍎 Nutrition", text: "What should I eat in first trimester?" },
  { category: "🏃 Exercise", text: "Is walking safe during pregnancy?" },
  { category: "⚠️ Warning Signs", text: "What are warning signs I should not ignore?" },
  { category: "🩺 GDM Risk", text: "How can I reduce GDM risk?" },
  { category: "😴 Sleep", text: "How can I sleep better during pregnancy?" },
  { category: "💊 Supplements", text: "What supplements do I need during pregnancy?" },
  { category: "🧘 Mental Health", text: "How do I manage pregnancy anxiety?" },
  { category: "🤰 Trimester 2", text: "What happens in second trimester?" },
];

// Inline SVGs for icons to avoid needing external npm packages
const Icons = {
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
  Mic: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>,
  Volume2: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>,
  Loader2: ({ className }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>,
  Bot: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
};

// Custom Markdown parser so we don't need react-markdown
function parseMarkdown(text) {
  if (!text) return null;
  const parts = [];
  let blockKey = 0;

  // Split by code blocks first
  const codeBlocks = text.split(/```/g);
  for (let i = 0; i < codeBlocks.length; i++) {
    if (i % 2 !== 0) {
      // It's a code block
      parts.push(<pre key={blockKey++}><code>{codeBlocks[i]}</code></pre>);
    } else {
      // It's normal text, split by paragraphs
      const paragraphs = codeBlocks[i].split(/\n\n+/);
      paragraphs.forEach((p) => {
        if (!p.trim()) return;

        // Handle basic lists
        if (p.trim().startsWith('- ') || p.trim().startsWith('* ')) {
          const listItems = p.split(/\n/).filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
          parts.push(
            <ul key={blockKey++}>
              {listItems.map((li, idx) => (
                <li key={idx}>{renderInline(li.replace(/^[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        } else {
          parts.push(<p key={blockKey++}>{renderInline(p)}</p>);
        }
      });
    }
  }
  return <>{parts}</>;
}

// Render bold text
function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}


function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🤰 Welcome to your AI Pregnancy Care Assistant!\n\nI'm here to support you throughout your pregnancy journey with expert guidance on:\n\n• 🍎 Nutrition and meal planning\n• 🏃 Safe exercises and fitness\n• 🩺 Gestational diabetes concerns\n• ⚠️ Warning signs and emergency care\n• 😴 Sleep improvement strategies\n• 💊 Supplement recommendations\n• 🧘 Mental health and emotional support\n• 📅 Trimester-specific advice\n\nWhat's your current pregnancy week, and how can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const buildHistoryPayload = (chatMessages) =>
    chatMessages
      .filter((item) => item.role === "user" || item.role === "bot")
      .map((item) => ({
        role: item.role === "bot" ? "assistant" : "user",
        text: item.text,
      }));

  const askBot = async (textToSend) => {
    if (!textToSend.trim()) return;
    
    const userMessage = { role: "user", text: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setMessage("");

    const payload = { message: textToSend, language, history: buildHistoryPayload(updatedMessages) };
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const response = await fetch(`${getApiBase()}/chatbot/public`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      // Add typing indicator
      setMessages((prev) => [...prev, { role: "bot", text: "🤔 Thinking...", isTyping: true }]);
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter(msg => !msg.isTyping),
          { role: "bot", text: data.response, timestamp: new Date().toLocaleTimeString() }
        ]);
        setLoading(false);
      }, 800);

    } catch (err) {
      setMessages((prev) => [
        ...prev.filter(msg => !msg.isTyping),
        { 
          role: "bot", 
          text: "❌ I'm having trouble connecting right now. Please try again in a moment. If the issue persists, check your internet connection.", 
          isError: true,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setLoading(false);
    }
  };
  const voiceIn = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "🎤 Voice input is not supported in your browser. Please type your message instead.",
        timestamp: new Date().toLocaleTimeString()
      }]);
      return;
    }
    
    const rec = new SR();
    rec.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    
    rec.onstart = () => {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "🎤 Listening... Speak now!",
        isTyping: true
      }]);
    };
    
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setMessage(transcript);
      setMessages((prev) => prev.filter(msg => !msg.isTyping));
    };
    
    rec.onerror = () => {
      setMessages((prev) => prev.filter(msg => !msg.isTyping));
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "🎤 Sorry, I didn't catch that. Please try again or type your message.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    };
    
    rec.start();
  };

  const voiceOut = () => {
    const latestBot = [...messages].reverse().find((item) => item.role === "bot" && !item.isTyping);
    if (!latestBot) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utter = new SpeechSynthesisUtterance(latestBot.text);
      utter.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
      utter.rate = 0.9; // Slightly slower for better comprehension
      utter.pitch = 1.0;
      utter.volume = 1.0;
      
      utter.onstart = () => {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          text: "🔊 Speaking response...",
          isTyping: true
        }]);
      };
      
      utter.onend = () => {
        setMessages((prev) => prev.filter(msg => !msg.isTyping));
      };
      
      window.speechSynthesis.speak(utter);
    } else {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "🔊 Voice output is not supported in your browser.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        text: "🤰 Chat cleared! I'm here to help you with your pregnancy journey. What would you like to know?",
      },
    ]);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'AI Assistant'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pregnancy-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting message:", message);
    if (!message.trim()) return;
    askBot(message);
  };

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>🤰 AI Pregnancy Assistant</h1>
          <span className="subtitle">Your expert pregnancy care companion</span>
        </div>
        <div className="controls">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="kn">🇮🇳 Kannada</option>
          </select>
          <button className="icon-btn" type="button" onClick={voiceOut} title="Read Aloud" aria-label="Read Aloud"><Icons.Volume2 /></button>
          <button className="icon-btn" type="button" onClick={clearChat} title="Clear Chat" aria-label="Clear Chat">🗑️</button>
          <button className="icon-btn" type="button" onClick={exportChat} title="Export Chat" aria-label="Export Chat">💾</button>
        </div>
      </div>

      <div className="chat-window-full">
        {messages.map((item, idx) => (
          <div key={`${item.role}-${idx}`} className={`chat-row ${item.role} ${item.isTyping ? 'typing' : ''} ${item.isError ? 'error' : ''}`}>
            <div className={`avatar ${item.role}`}>
              {item.role === "bot" ? <Icons.Bot /> : <Icons.User />}
            </div>
            <div className="message-content">
              {item.timestamp && <span className="timestamp">{item.timestamp}</span>}
              {item.role === "bot" ? parseMarkdown(item.text) : <p>{item.text}</p>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-row bot typing">
            <div className="avatar bot"><Icons.Bot /></div>
            <div className="message-content typing">
              <Icons.Loader2 className="spin" /> 🤔 Thinking...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="chat-input-area">
        <div className="quick-prompts-section">
          <h3>💡 Quick Questions</h3>
          <div className="quick-prompts-grid">
            {quickPrompts.map((prompt, idx) => (
              <button 
                key={idx} 
                type="button" 
                className="quick-prompt-btn" 
                onClick={() => askBot(prompt.text)} 
                disabled={loading}
                title={prompt.text}
              >
                <span className="prompt-category">{prompt.category}</span>
                <span className="prompt-text">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
        <form className="input-wrapper" onSubmit={handleSubmit}>
          <button className="icon-btn voice" type="button" onClick={voiceIn} disabled={loading} title="Voice Input"><Icons.Mic /></button>
          <input
            type="text"
            className="chat-text-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your custom question here..."
            disabled={loading}
          />
          <button type="submit" className="send-btn" disabled={loading || !message.trim()}><Icons.Send /></button>
        </form>
        <div className="chat-footer">
          <p className="hint text-center">
            ⚠️ <strong>Medical Disclaimer:</strong> This AI provides informational guidance only. Always consult your healthcare provider for medical advice.
          </p>
          <div className="chat-stats">
            <span>💬 {messages.filter(m => m.role === 'user').length} messages</span>
            <span>🤖 {messages.filter(m => m.role === 'bot').length} responses</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatbotPage;
