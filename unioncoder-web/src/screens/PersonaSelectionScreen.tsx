import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const PERSONA_EMOJIS: Record<string, string> = {
  contract: '📋',
  harassment: '🛡️',
  wage: '💰',
  termination: '⚖️',
  safety: '👷',
  general: '🤖',
};

const PERSONA_COLORS: Record<string, string> = {
  contract: '#4299E1',
  harassment: '#ED64A6',
  wage: '#48BB78',
  termination: '#ECC94B',
  safety: '#F56565',
  general: '#8A2BE2',
};

const PersonaSelectionScreen: React.FC = () => {
  const { personas, selectedPersona, selectPersona, loading } = useChat();
  const { user } = useAuth();

  if (loading && personas.length === 0) {
    return (
      <div className="screen">
        <div className="screen-header">
          <h1>AI Legal Agents</h1>
        </div>
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>AI Legal Agents</h1>
        <span style={{ fontSize: 13, opacity: 0.8 }}>
          Hello, {user?.name || 'there'}!
        </span>
      </div>
      <div className="screen-content" style={{ overflowY: 'auto' }}>
        <p style={{ padding: '16px 16px 8px', color: 'var(--neutral-light-gray)', fontSize: 14 }}>
          Choose an AI specialist to discuss your workplace issue:
        </p>

        <div className="persona-grid">
          {personas.map(persona => {
            const emoji = PERSONA_EMOJIS[persona.category] || PERSONA_EMOJIS.general;
            const color = PERSONA_COLORS[persona.category] || PERSONA_COLORS.general;

            return (
              <div
                key={persona.persona_id}
                className={`persona-card ${selectedPersona?.persona_id === persona.persona_id ? 'selected' : ''}`}
                onClick={() => selectPersona(persona)}
              >
                <div
                  className="persona-avatar"
                  style={{ background: `${color}20`, color }}
                >
                  {emoji}
                </div>
                <div className="persona-info">
                  <h3>{persona.name}</h3>
                  <div className="persona-title">{persona.title}</div>
                  <div className="persona-desc">{persona.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Default personas if none loaded from API */}
        {personas.length === 0 && (
          <div style={{ padding: 16, textAlign: 'center', color: 'var(--neutral-light-gray)' }}>
            <p>Unable to load AI personas from server.</p>
            <p style={{ marginTop: 8, fontSize: 13 }}>Please ensure the backend is running.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaSelectionScreen;
