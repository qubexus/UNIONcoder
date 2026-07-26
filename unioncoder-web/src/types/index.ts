export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  company: string;
  work_category: string;
  language: string;
  is_admin: boolean;
  has_access: boolean;
  created_at: string;
  last_login: string;
}

export interface AIPersona {
  persona_id: string;
  name: string;
  title: string;
  specialization: string;
  description: string;
  avatar: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  system_prompt?: string;
}

export interface Message {
  message_id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: {
    processing_time?: number;
    ai_model?: string;
    tokens_used?: number;
    confidence?: number;
  };
}

export interface Case {
  case_id: string;
  user_id: string;
  persona_id: string;
  persona_name?: string;
  title: string;
  status: 'active' | 'archived' | 'flagged';
  messages: Message[];
  started_at: string;
  last_message_at: string;
  is_resolved: boolean;
  category?: string;
  tags: string[];
}

export interface Document {
  document_id: string;
  user_id: string;
  case_id?: string;
  filename: string;
  content_type: string;
  file_size: number;
  uploaded_at: string;
  analysis?: string;
  status: 'pending' | 'analyzed' | 'failed';
}

export interface SupportMessage {
  message_id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  admin_reply?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSession {
  session_id: string;
  url: string;
  package_type: string;
  amount: number;
  currency: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
