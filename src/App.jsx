import { useState, useRef, useEffect } from "react";
import API from "./api";
import {
  Bot,
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Menu,
  X,
  Sparkles,
  User,
  PanelLeftClose,
  Command,
  Paperclip,
  Mic,
  ArrowUp,
} from "lucide-react";

import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestions = [
    {
      icon: "💡",
      title: "Explain something",
      description: "Explain complex topics in simple words.",
      prompt: "Explain artificial intelligence in simple words.",
    },
    {
      icon: "💻",
      title: "Write code",
      description: "Generate and debug programming code.",
      prompt: "Help me write a Python program.",
    },
    {
      icon: "📚",
      title: "Learn something",
      description: "Learn new skills and technologies.",
      prompt: "Give me a roadmap to learn machine learning.",
    },
    {
      icon: "🚀",
      title: "Generate ideas",
      description: "Brainstorm creative project ideas.",
      prompt: "Suggest some innovative AI project ideas.",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

 const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();

    setMessages((prev) => [
        ...prev,
        {
            id: Date.now(),
            role: "user",
            content: question
        }
    ]);

    setInput("");
    setLoading(true);

    try {
        const response = await API.post("/chat", {
            question: question,
            session_id: sessionId
        });

        setSessionId(response.data.session_id);

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                role: "assistant",
                content: response.data.answer
            }
        ]);

    } catch (error) {
        console.error("API Error:", error);

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                role: "assistant",
                content: "Unable to connect to the AI server. Please try again."
            }
        ]);

    } finally {
        setLoading(false);
    }
};
  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setSessionId(null);
    setLoading(false);
};

  const handleSuggestion = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="sidebar-top">

          <div className="brand">
            <div className="brand-icon">
              <Bot size={23} />
            </div>

            {sidebarOpen && (
              <span>Neural<span className="brand-highlight">AI</span></span>
            )}
          </div>

          <button
            className="icon-button sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={19} />
            ) : (
              <Menu size={20} />
            )}
          </button>

        </div>

        {sidebarOpen && (
          <>

            <button className="new-chat-button" onClick={handleNewChat}>
              <Plus size={19} />
              <span>New Chat</span>
              <span className="shortcut">Ctrl K</span>
            </button>

            <div className="sidebar-section">

              <p className="section-label">WORKSPACE</p>

              <div className="sidebar-item active">
                <MessageSquare size={18} />
                <span>Chat Assistant</span>
              </div>

            </div>

            <div className="history-section">

              <p className="section-label">RECENT CHATS</p>

              {messages.length > 0 ? (
                <div className="history-item">
                  <MessageSquare size={16} />
                  <span>{messages[0].content.slice(0, 22)}</span>
                </div>
              ) : (
                <div className="empty-history">
                  Your conversations will appear here.
                </div>
              )}

            </div>

            <div className="sidebar-bottom">

              <div className="profile-card">
                <div className="profile-avatar">D</div>

                <div className="profile-info">
                  <h4>AI User</h4>
                  <p>Personal Workspace</p>
                </div>

                <div className="online-dot"></div>
              </div>

            </div>

          </>
        )}

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* HEADER */}

        <header className="topbar">

          <div className="topbar-left">

            {!sidebarOpen && (
              <button
                className="icon-button"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={21} />
              </button>
            )}

            <div>
              <h3>AI Assistant</h3>
              <span className="model-label">
                <span className="status-dot"></span>
                Groq Powered
              </span>
            </div>

          </div>

          <div className="topbar-right">

            <div className="model-badge">
              <Sparkles size={15} />
              AI Model
            </div>

            <button
              className="icon-button"
              title="Clear conversation"
              onClick={handleNewChat}
            >
              <Trash2 size={19} />
            </button>

          </div>

        </header>

        {/* CHAT AREA */}

        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome-container">

              <div className="welcome-icon">
                <div className="welcome-glow"></div>
                <Bot size={43} />
                <Sparkles className="sparkle" size={19} />
              </div>

              <div className="welcome-heading">
                <p className="welcome-tag">YOUR AI COMPANION</p>

                <h1>
                  Hello there! <br />
                  <span>What can I help you with?</span>
                </h1>

                <p className="welcome-description">
                  I'm your intelligent assistant, ready to help you
                  explore ideas, solve problems and create something amazing.
                </p>
              </div>

              <div className="suggestion-grid">

                {suggestions.map((item, index) => (

                  <button
                    className="suggestion-card"
                    key={index}
                    onClick={() => handleSuggestion(item.prompt)}
                  >

                    <div className="suggestion-icon">
                      {item.icon}
                    </div>

                    <div className="suggestion-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>

                  </button>

                ))}

              </div>

            </div>

          ) : (

            <div className="messages-container">

              {messages.map((message) => (

                <div
                  className={`message-row ${message.role}`}
                  key={message.id}
                >

                  <div className={`message-avatar ${message.role}`}>
                    {message.role === "assistant" ? (
                      <Bot size={20} />
                    ) : (
                      <User size={19} />
                    )}
                  </div>

                  <div className="message-content">

                    <div className="message-author">
                      {message.role === "assistant"
                        ? "Neural AI"
                        : "You"}
                    </div>

                    <div className="message-text">
                      {message.content}
                    </div>

                  </div>

                </div>

              ))}

              {loading && (

                <div className="message-row assistant">

                  <div className="message-avatar assistant">
                    <Bot size={20} />
                  </div>

                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              )}

              <div ref={messagesEndRef}></div>

            </div>

          )}

        </section>

        {/* INPUT AREA */}

        <footer className="input-section">

          <div className="input-wrapper">

            <div className="input-box">

              <input
                type="text"
                placeholder="Message Neural AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="input-actions">

                <button className="input-icon" title="Attachment (coming soon)">
                  <Paperclip size={19} />
                </button>

                <button className="input-icon" title="Voice (coming soon)">
                  <Mic size={19} />
                </button>

                <button
                  className={`send-button ${input.trim() ? "enabled" : ""}`}
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  title="Send message"
                >
                  <ArrowUp size={21} />
                </button>

              </div>

            </div>

            <p className="input-disclaimer">
              Neural AI can make mistakes. Verify important information.
            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default App;