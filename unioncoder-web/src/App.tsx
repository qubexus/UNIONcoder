import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import LoginScreen from './screens/LoginScreen';
import MainApp from './screens/MainApp';

const AppContent: React.FC = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner" style={{ height: '100%' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="app-container">
        <LoginScreen />
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="app-container">
        <MainApp />
      </div>
    </ChatProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
