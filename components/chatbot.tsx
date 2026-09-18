"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { getWelcomeMessage, processMessage, type ChatMessage } from "@/lib/chatbot-engine";

/* ── Icons (inline to keep the component self-contained) ──── */

function ChatIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    );
}

/* ── Markdown-lite renderer ─────────────────────────────────── */

function renderMarkdown(text: string) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        // Bullet points
        if (line.startsWith("- ")) {
            elements.push(
                <div key={i} className="chatbot-bullet">
                    <span className="chatbot-bullet-dot">&#8226;</span>
                    <span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
                </div>
            );
            return;
        }

        // Links
        const linkMatch = line.match(/\[(.+?)\]\((.+?)\)/);
        if (linkMatch) {
            const before = line.slice(0, linkMatch.index);
            const after = line.slice((linkMatch.index || 0) + linkMatch[0].length);
            elements.push(
                <p key={i}>
                    {before && <span dangerouslySetInnerHTML={{ __html: inlineMd(before) }} />}
                    <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="chatbot-link">
                        {linkMatch[1]}
                    </a>
                    {after && <span dangerouslySetInnerHTML={{ __html: inlineMd(after) }} />}
                </p>
            );
            return;
        }

        // Empty lines
        if (line.trim() === "") {
            elements.push(<div key={i} className="chatbot-spacer" />);
            return;
        }

        // Regular text with inline formatting
        elements.push(
            <p key={i} dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
        );
    });

    return elements;
}

function inlineMd(text: string): string {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/* ── Typing indicator ───────────────────────────────────────── */

function TypingIndicator() {
    return (
        <div className="chatbot-typing">
            <span /><span /><span />
        </div>
    );
}

/* ── Main component ─────────────────────────────────────────── */

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize with welcome message
    useEffect(() => {
        if (!isOpen || initialized) return;
        const timer = setTimeout(() => {
            setMessages([getWelcomeMessage()]);
            setIsTyping(false);
            setInitialized(true);
        }, 600);
        return () => clearTimeout(timer);
    }, [isOpen, initialized]);

    const openChat = () => {
        if (!initialized) setIsTyping(true);
        setIsOpen(true);
    };

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && initialized) {
            inputRef.current?.focus();
        }
    }, [isOpen, initialized]);

    const sendMessage = useCallback((text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            text: text.trim(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate thinking delay
        const delay = 400 + Math.random() * 600;
        setTimeout(() => {
            const botResponse = processMessage(text.trim());
            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }, delay);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    };

    return (
        <>
            {/* ── Floating trigger button ─────────────────────────── */}
            {!isOpen && (
                <button
                    id="chatbot-trigger"
                    className="chatbot-trigger"
                    onClick={openChat}
                    aria-label="Open chat assistant"
                >
                    <ChatIcon />
                    <span className="chatbot-trigger-pulse" />
                </button>
            )}

            {/* ── Chat panel ──────────────────────────────────────── */}
            {isOpen && (
                <div className="chatbot-overlay" onClick={() => setIsOpen(false)}>
                    <div
                        className="chatbot-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="chatbot-header">
                            <div className="chatbot-header-info">
                                <div className="chatbot-avatar">J</div>
                                <div>
                                    <h3 className="chatbot-header-title">Josam Concierge</h3>
                                    <p className="chatbot-header-status">
                                        <span className="chatbot-status-dot" />
                                        Online now
                                    </p>
                                </div>
                            </div>
                            <button
                                className="chatbot-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="chatbot-messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`chatbot-message chatbot-message-${msg.role}`}
                                >
                                    {msg.role === "bot" && <div className="chatbot-msg-avatar">J</div>}
                                    <div className={`chatbot-bubble chatbot-bubble-${msg.role}`}>
                                        {msg.role === "bot" ? renderMarkdown(msg.text) : msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Suggestions from last bot message */}
                            {!isTyping && messages.length > 0 && messages[messages.length - 1].role === "bot" && messages[messages.length - 1].suggestions && (
                                <div className="chatbot-suggestions">
                                    {messages[messages.length - 1].suggestions!.map((s) => (
                                        <button
                                            key={s}
                                            className="chatbot-chip"
                                            onClick={() => handleSuggestionClick(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isTyping && (
                                <div className="chatbot-message chatbot-message-bot">
                                    <div className="chatbot-msg-avatar">J</div>
                                    <div className="chatbot-bubble chatbot-bubble-bot">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input bar */}
                        <form className="chatbot-input-bar" onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                type="text"
                                className="chatbot-input"
                                placeholder="Ask about cars, pricing, services..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="chatbot-send"
                                disabled={!input.trim()}
                                aria-label="Send message"
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
