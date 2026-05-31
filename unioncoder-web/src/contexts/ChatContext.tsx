import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIPersona, Case, Message } from '../types';
import { useAuth } from './AuthContext';

const API_BASE = '/api';

interface ChatContextType {
  personas: AIPersona[];
  cases: Case[];
  mainChatMessages: Message[];
  currentCase: Case | null;
  selectedPersona: AIPersona | null;
  loading: boolean;
  sendingMessage: boolean;
  loadPersonas: () => Promise<void>;
  loadCases: () => Promise<void>;
  loadMainChat: () => Promise<void>;
  selectPersona: (persona: AIPersona) => void;
  sendMainChatMessage: (content: string) => Promise<void>;
  sendCaseMessage: (caseId: string, content: string) => Promise<void>;
  sendGreeting: (caseId: string, greeting: string) => Promise<void>;
  saveToCase: (title: string, personaId: string) => Promise<void>;
  clearMainChat: () => Promise<void>;
  setCurrentCase: (c: Case | null) => void;
  createCase: (personaId: string, title: string) => Promise<Case>;
  uploadDocument: (caseId: string | null, file: File) => Promise<void>;
  getDocuments: (caseId?: string) => Promise<any[]>;
  analyzeDocument: (documentId: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [mainChatMessages, setMainChatMessages] = useState<Message[]>([]);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (token) {
      loadPersonas();
      loadCases();
      loadMainChat();
    }
  }, [token]);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/personas`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setPersonas(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading personas:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/cases`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setCases(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMainChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/main-chat/messages`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setMainChatMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading main chat:', err);
    }
  };

  const selectPersona = (persona: AIPersona) => {
    setSelectedPersona(persona);
  };

  const sendMainChatMessage = async (content: string) => {
    try {
      setSendingMessage(true);
      const res = await fetch(`${API_BASE}/main-chat/messages`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ content, persona_id: selectedPersona?.persona_id }),
      });
      if (res.ok) {
        const data = await res.json();
        setMainChatMessages(prev => [...prev, data]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setSendingMessage(false);
    }
  };

  const sendCaseMessage = async (caseId: string, content: string) => {
    try {
      setSendingMessage(true);
      const res = await fetch(`${API_BASE}/cases/${caseId}/messages`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        await loadCases();
        if (currentCase?.case_id === caseId) {
          setCurrentCase(prev => prev ? { ...prev, messages: [...prev.messages, data] } : null);
        }
      }
    } catch (err) {
      console.error('Error sending case message:', err);
      throw err;
    } finally {
      setSendingMessage(false);
    }
  };

  const sendGreeting = async (caseId: string, greeting: string) => {
    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/greeting`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ greeting }),
      });
      if (res.ok) {
        await loadCases();
      }
    } catch (err) {
      console.error('Error sending greeting:', err);
    }
  };

  const saveToCase = async (title: string, personaId: string) => {
    try {
      const res = await fetch(`${API_BASE}/main-chat/save-to-case`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ title, persona_id: personaId }),
      });
      if (res.ok) {
        await loadCases();
        await loadMainChat();
      }
    } catch (err) {
      console.error('Error saving to case:', err);
      throw err;
    }
  };

  const clearMainChat = async () => {
    try {
      await fetch(`${API_BASE}/main-chat/clear`, {
        method: 'POST',
        headers: headers(),
      });
      setMainChatMessages([]);
    } catch (err) {
      console.error('Error clearing main chat:', err);
    }
  };

  const createCase = async (personaId: string, title: string): Promise<Case> => {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ persona_id: personaId, title }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to create case');
    await loadCases();
    return data;
  };

  const uploadDocument = async (caseId: string | null, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadHeaders: any = { Authorization: `Bearer ${token}` };
    
    const endpoint = caseId 
      ? `${API_BASE}/cases/${caseId}/documents`
      : `${API_BASE}/documents/general`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: uploadHeaders,
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
  };

  const getDocuments = async (caseId?: string): Promise<any[]> => {
    const endpoint = caseId 
      ? `${API_BASE}/cases/${caseId}/documents`
      : `${API_BASE}/documents/general`;
    const res = await fetch(endpoint, { headers: headers() });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
    return [];
  };

  const analyzeDocument = async (documentId: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/documents/${documentId}/analyze`, {
      method: 'POST',
      headers: headers(),
    });
    if (res.ok) {
      const data = await res.json();
      return data.analysis || 'No analysis available';
    }
    throw new Error('Failed to analyze document');
  };

  return (
    <ChatContext.Provider value={{
      personas, cases, mainChatMessages, currentCase, selectedPersona,
      loading, sendingMessage,
      loadPersonas, loadCases, loadMainChat, selectPersona,
      sendMainChatMessage, sendCaseMessage, sendGreeting,
      saveToCase, clearMainChat, setCurrentCase, createCase,
      uploadDocument, getDocuments, analyzeDocument,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
