import React, { useState } from 'react';
import { useAuth, RegisterData } from '../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const { login, register, loading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [language, setLanguage] = useState('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const data: RegisterData = {
          email, password, name, phone, address,
          postcode, city, company, work_category: workCategory, language,
        };
        await register(data);
      }
    } catch (err) {
      // Error is handled in context
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
    setPostcode('');
    setCity('');
    setCompany('');
    setWorkCategory('');
    setShowPassword(false);
  };

  return (
    <div className="login-screen">
      {/* Header */}
      <div className="login-header">
        <div className="login-logo">
          <span>UC</span>
        </div>
        <h1>UNIONcoder</h1>
        <p>Your AI-powered workplace rights assistant</p>
      </div>

      {/* Form */}
      <div className="login-form">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="subtitle">
          {isLogin
            ? 'Sign in to access your AI legal assistants'
            : 'Join thousands of employees protecting their rights'}
        </p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <span className="icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="icon">✉️</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrapper">
                  <span className="icon">📱</span>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <div className="input-wrapper">
                  <span className="icon">🏠</span>
                  <input
                    type="text"
                    placeholder="Your address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Postcode</label>
                <div className="input-wrapper">
                  <span className="icon">📮</span>
                  <input
                    type="text"
                    placeholder="Postcode"
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>City</label>
                <div className="input-wrapper">
                  <span className="icon">🏙️</span>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company / Employer</label>
                <div className="input-wrapper">
                  <span className="icon">🏢</span>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Work Category</label>
                <div className="input-wrapper">
                  <span className="icon">👷</span>
                  <select value={workCategory} onChange={e => setWorkCategory(e.target.value)}>
                    <option value="">Select work category</option>
                    <option value="construction">Construction</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="transport">Transport & Logistics</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="cleaning">Cleaning & Maintenance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <div className="input-wrapper">
                  <span className="icon">🌍</span>
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="pl">Polski</option>
                    <option value="ro">Română</option>
                    <option value="pt">Português</option>
                    <option value="es">Español</option>
                    <option value="uk">Українська</option>
                    <option value="bg">Български</option>
                    <option value="lt">Lietuvių</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? (isLogin ? 'Signing In...' : 'Creating Account...')
              : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="toggle-mode">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button type="button" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="features-section">
        <h3>Why Choose UNIONcoder?</h3>

        <div className="feature-item">
          <div className="feature-icon">👥</div>
          <div className="feature-text">
            <h4>AI Legal Experts</h4>
            <p>Specialized AI personas for different workplace issues</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">🛡️</div>
          <div className="feature-text">
            <h4>Confidential & Secure</h4>
            <p>Your conversations are private and protected</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">💬</div>
          <div className="feature-text">
            <h4>24/7 Availability</h4>
            <p>Get help whenever you need it, day or night</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="login-footer">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        <p className="contact">Need help? Contact us at admin@ai-coder.uk</p>
      </div>
    </div>
  );
};

export default LoginScreen;
