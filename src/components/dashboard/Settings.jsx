import React, { useState } from 'react';
import './DashboardSections.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
    language: 'english'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Settings</h2>
        <p>Manage your application preferences</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              Email Notifications
            </label>
          </div>
        </div>

        <div className="setting-card">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              />
              Dark Mode
            </label>
          </div>
        </div>

        <div className="setting-card">
          <h3>Editor Settings</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              Auto Save
            </label>
          </div>
        </div>

        <div className="setting-card">
          <h3>Language</h3>
          <div className="setting-item">
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save">Save Settings</button>
        <button className="btn-cancel">Cancel</button>
      </div>
    </div>
  );
};

export default Settings;