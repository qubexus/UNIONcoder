import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    postcode: user?.postcode || '',
    city: user?.city || '',
    company: user?.company || '',
    work_category: user?.work_category || '',
    language: user?.language || 'en',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(editData);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const LANGUAGE_LABELS: Record<string, string> = {
    en: 'English', pl: 'Polski', ro: 'Română', pt: 'Português',
    es: 'Español', uk: 'Українська', bg: 'Български', lt: 'Lietuvių',
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>My Profile</h1>
        <button onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : '✏️ Edit'}
        </button>
      </div>
      <div className="screen-content" style={{ overflowY: 'auto' }}>
        <div className="profile-screen">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name ? getInitials(user.name) : '?'}
            </div>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email}</p>
          </div>

          {editing ? (
            <div>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <input
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrapper">
                  <input
                    value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <div className="input-wrapper">
                  <input
                    value={editData.address}
                    onChange={e => setEditData({ ...editData, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Postcode</label>
                <div className="input-wrapper">
                  <input
                    value={editData.postcode}
                    onChange={e => setEditData({ ...editData, postcode: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>City</label>
                <div className="input-wrapper">
                  <input
                    value={editData.city}
                    onChange={e => setEditData({ ...editData, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Company</label>
                <div className="input-wrapper">
                  <input
                    value={editData.company}
                    onChange={e => setEditData({ ...editData, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Work Category</label>
                <div className="input-wrapper">
                  <select
                    value={editData.work_category}
                    onChange={e => setEditData({ ...editData, work_category: e.target.value })}
                  >
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
                <label>Language</label>
                <div className="input-wrapper">
                  <select
                    value={editData.language}
                    onChange={e => setEditData({ ...editData, language: e.target.value })}
                  >
                    {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <>
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="profile-field">
                  <span className="label">Name</span>
                  <span className="value">{user?.name || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Email</span>
                  <span className="value">{user?.email || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Phone</span>
                  <span className="value">{user?.phone || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Address</span>
                  <span className="value">{user?.address || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Postcode</span>
                  <span className="value">{user?.postcode || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">City</span>
                  <span className="value">{user?.city || '—'}</span>
                </div>
              </div>

              <div className="profile-section">
                <h3>Work Information</h3>
                <div className="profile-field">
                  <span className="label">Company</span>
                  <span className="value">{user?.company || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Work Category</span>
                  <span className="value">{user?.work_category || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Language</span>
                  <span className="value">
                    {LANGUAGE_LABELS[user?.language || 'en'] || user?.language}
                  </span>
                </div>
              </div>

              <div className="profile-section">
                <h3>Account</h3>
                <div className="profile-field">
                  <span className="label">Member since</span>
                  <span className="value">
                    {user?.created_at ? formatDate(user.created_at) : '—'}
                  </span>
                </div>
                <div className="profile-field">
                  <span className="label">Last login</span>
                  <span className="value">
                    {user?.last_login ? formatDate(user.last_login) : '—'}
                  </span>
                </div>
                <div className="profile-field">
                  <span className="label">Access</span>
                  <span className="value">
                    {user?.has_access ? '✅ Active' : '❌ No access'}
                  </span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="logout-btn" onClick={logout}>
                  🚪 Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
