import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';

const PERSONA_EMOJIS: Record<string, string> = {
  contract: '📋', harassment: '🛡️', wage: '💰',
  termination: '⚖️', safety: '👷', general: '🤖',
};

const ChatScreen: React.FC = () => {
  const {
    mainChatMessages, selectedPersona, sendingMessage,
    sendMainChatMessage, loadMainChat, clearMainChat,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mainChatMessages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sendingMessage) return;

    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }

    try {
      await sendMainChatMessage(text);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = '44px';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const emoji = selectedPersona
    ? (PERSONA_EMOJIS[selectedPersona.category] || '🤖')
    : '🤖';

  return (
    <div className="chat-container">
      {/* Persona bar */}
      <div className="chat-persona-bar">
        <div
          className="persona-mini-avatar"
          style={{
            background: selectedPersona ? `${selectedPersona.category ? 'var(--brand-purple)' : '#8A2BE2'}20` : '#F0F2F5',
            color: 'var(--brand-purple)',
          }}
        >
          {emoji}
        </div>
        <div className="persona-mini-info">
          <h4>{selectedPersona?.name || 'UNIONcoder AI'}</h4>
          <span>{selectedPersona?.title || 'General Assistant'}</span>
        </div>
        <button
          onClick={clearMainChat}
          style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {mainChatMessages.length === 0 ? (
          <div className="chat-empty">
            <div className="icon">💬</div>
            <h3>Start a conversation</h3>
            <p>
              {selectedPersona
                ? `Ask ${selectedPersona.name} anything about ${selectedPersona.specialization}`
                : 'Select an AI agent from the Agents tab, then start chatting here'}
            </p>
          </div>
        ) : (
          mainChatMessages.map((msg, idx) => (
            <div key={msg.message_id || idx} className={`chat-bubble ${msg.sender}`}>
              <div>{msg.content}</div>
              <div className="timestamp">{formatTime(msg.timestamp)}</div>
            </div>
          ))
        )}

        {sendingMessage && (
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={selectedPersona ? `Ask ${selectedPersona.name}...` : 'Type a message...'}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!inputText.trim() || sendingMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
