'use client';

import { useState, useEffect } from 'react';
import AdminForm from '../../components/AdminForm';

export default function AdminPanel() {
  const [playlists, setPlaylists] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const savedPassword = localStorage.getItem('admin_password');
    const defaultPassword = localStorage.getItem('default_admin_password') || 'admin123';
    
    if (savedPassword === defaultPassword) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const storedPlaylists = JSON.parse(localStorage.getItem('tv_playlists') || '[]');
    const storedChannels = JSON.parse(localStorage.getItem('tv_channels') || '[]');
    setPlaylists(storedPlaylists);
    setChannels(storedChannels);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const defaultPassword = localStorage.getItem('default_admin_password') || 'admin123';
    
    if (password === defaultPassword) {
      localStorage.setItem('admin_password', password);
      setIsAuthenticated(true);
      loadData();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (newPassword.length < 4) {
      alert('Password must be at least 4 characters long!');
      return;
    }
    
    localStorage.setItem('default_admin_password', newPassword);
    localStorage.setItem('admin_password', newPassword);
    alert('Password changed successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_password');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleChannelsAdded = (newChannels) => {
    loadData();
  };

  const deletePlaylist = (playlistId) => {
    if (confirm('Are you sure you want to delete this playlist and all its channels?')) {
      const updatedChannels = channels.filter(c => c.playlistId !== playlistId);
      const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
      
      localStorage.setItem('tv_channels', JSON.stringify(updatedChannels));
      localStorage.setItem('tv_playlists', JSON.stringify(updatedPlaylists));
      
      setChannels(updatedChannels);
      setPlaylists(updatedPlaylists);
    }
  };

  // Password Protected View
  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="password-container">
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Admin Login
            </h1>
            <p style={{ color: '#ccc' }}>Enter password to access admin panel</p>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleLogin} className="password-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="password-input"
              required
            />
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          
          <div style={{ marginTop: '30px', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Change Default Password</h3>
            <form onSubmit={handlePasswordChange}>
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                className="password-input"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="password-input"
                required
              />
              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel View
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your live TV channels and playlists</p>
        <button onClick={handleLogout} className="btn btn-danger" style={{ marginTop: '15px' }}>
          Logout
        </button>
      </div>

      <AdminForm onChannelsAdded={handleChannelsAdded} />

      <div className="admin-grid">
        {/* Playlists Section */}
        <div className="admin-card">
          <h2>Playlists ({playlists.length})</h2>
          {playlists.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>No playlists added yet.</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {playlists.map(playlist => (
                <div key={playlist.id} style={{ 
                  background: '#2a2a2a', 
                  padding: '15px', 
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ marginBottom: '8px' }}>{playlist.name}</h3>
                  <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                    Channels: {playlist.channelCount} | Added: {new Date(playlist.addedAt).toLocaleDateString()}
                  </p>
                  {playlist.url && (
                    <p style={{ 
                      wordBreak: 'break-all', 
                      fontSize: '12px', 
                      color: '#888',
                      marginBottom: '10px'
                    }}>
                      {playlist.url}
                    </p>
                  )}
                  <button 
                    onClick={() => deletePlaylist(playlist.id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete Playlist
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channels Section */}
        <div className="admin-card">
          <h2>All Channels ({channels.length})</h2>
          {channels.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>No channels available.</p>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {channels.map(channel => (
                <div key={channel.id} style={{ 
                  background: '#2a2a2a', 
                  padding: '12px', 
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ marginBottom: '5px', fontSize: '14px' }}>{channel.name}</h4>
                  <p style={{ fontSize: '12px', color: '#ccc', marginBottom: '5px' }}>
                    Group: {channel.group}
                  </p>
                  <p style={{ 
                    fontSize: '11px', 
                    color: '#888',
                    wordBreak: 'break-all'
                  }}>
                    {channel.url}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
