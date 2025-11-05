'use client';

import { useState, useEffect } from 'react';
import AdminForm from '../../components/AdminForm';

export default function AdminPanel() {
  const [playlists, setPlaylists] = useState([]);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedPlaylists = JSON.parse(localStorage.getItem('tv_playlists') || '[]');
    const storedChannels = JSON.parse(localStorage.getItem('tv_channels') || '[]');
    setPlaylists(storedPlaylists);
    setChannels(storedChannels);
  };

  const handleChannelsAdded = (newChannels) => {
    loadData(); // Reload data to show updated lists
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

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Admin Panel</h1>
      
      <AdminForm onChannelsAdded={handleChannelsAdded} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
        {/* Playlists Section */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Playlists ({playlists.length})</h2>
          {playlists.length === 0 ? (
            <p style={{ color: '#ccc' }}>No playlists added yet.</p>
          ) : (
            playlists.map(playlist => (
              <div key={playlist.id} className="channel-card">
                <h3>{playlist.name}</h3>
                <p>Channels: {playlist.channelCount}</p>
                <p>Added: {new Date(playlist.addedAt).toLocaleDateString()}</p>
                {playlist.url && (
                  <p style={{ wordBreak: 'break-all', fontSize: '12px', color: '#ccc' }}>
                    URL: {playlist.url}
                  </p>
                )}
                <button 
                  onClick={() => deletePlaylist(playlist.id)}
                  className="btn"
                  style={{ background: '#ff4757', marginTop: '10px' }}
                >
                  Delete Playlist
                </button>
              </div>
            ))
          )}
        </div>

        {/* Channels Section */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>All Channels ({channels.length})</h2>
          {channels.length === 0 ? (
            <p style={{ color: '#ccc' }}>No channels available.</p>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {channels.map(channel => (
                <div key={channel.id} className="channel-card" style={{ marginBottom: '10px' }}>
                  <h4>{channel.name}</h4>
                  <p>Group: {channel.group}</p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#ccc',
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
