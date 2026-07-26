import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Case } from '../types';

const CaseHistoryScreen: React.FC = () => {
  const { cases, loading, loadCases, setCurrentCase } = useChat();
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const toggleExpand = (caseId: string) => {
    setExpandedCase(prev => prev === caseId ? null : caseId);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '🟢 Active';
      case 'archived': return '📦 Archived';
      case 'flagged': return '🚩 Flagged';
      default: return status;
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Case History</h1>
        <button onClick={loadCases}>↻ Refresh</button>
      </div>
      <div className="screen-content" style={{ overflowY: 'auto' }}>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        ) : cases.length === 0 ? (
          <div className="case-empty">
            <div className="icon">📁</div>
            <h3>No cases yet</h3>
            <p>Start chatting with an AI agent to create your first case</p>
          </div>
        ) : (
          <div className="case-list">
            {cases.map(c => (
              <div key={c.case_id} className="case-card" onClick={() => toggleExpand(c.case_id)}>
                <div className="case-card-header">
                  <h3>{c.title}</h3>
                  <span className={`status-badge ${c.status}`}>
                    {getStatusLabel(c.status)}
                  </span>
                </div>
                <div className="case-card-meta">
                  <span>📅 {formatDate(c.started_at)}</span>
                  <span>💬 {c.messages?.length || 0} messages</span>
                  {c.persona_name && <span>🤖 {c.persona_name}</span>}
                </div>
                {c.messages && c.messages.length > 0 && (
                  <div className="case-card-preview">
                    {c.messages[c.messages.length - 1]?.content}
                  </div>
                )}

                {expandedCase === c.case_id && c.messages && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-gray)' }}>
                    {c.messages.map((msg, idx) => (
                      <div
                        key={msg.message_id || idx}
                        style={{
                          padding: '8px 0',
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: msg.sender === 'user' ? 'var(--brand-purple)' : 'var(--brand-orange)' }}>
                          {msg.sender === 'user' ? 'You' : (c.persona_name || 'AI')}:
                        </strong>
                        {' '}{msg.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseHistoryScreen;
