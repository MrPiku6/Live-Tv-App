'use client';

import { useState } from 'react';
import { parseM3U } from '../lib/utils';

export default function AdminForm({ onChannelsAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    playlistUrl: '',
    playlistContent: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchPlaylist = async (url) => {
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch playlist: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let playlistContent = formData.playlistContent;

      if (formData.playlistUrl && !playlistContent) {
        playlistContent = await fetchPlaylist(formData.playlistUrl);
      }

      if (!playlistContent) {
        throw new Error('Please provide either playlist URL or content');
      }

      const playlistId = `playlist_${Date.now()}`;
      const channels = await parseM3U(playlistContent, playlistId);

      if (channels.length === 0) {
        throw new Error('No valid channels found in the playlist');
      }

      const existingChannels = JSON.parse(localStorage.getItem('tv_channels') || '[]');
      const updatedChannels = [...existingChannels, ...channels];
      localStorage.setItem('tv_channels', JSON.stringify(updatedChannels));

      const playlists = JSON.parse(localStorage.getItem('tv_playlists') || '[]');
      playlists.push({
        id: playlistId,
        name: formData.name || `Playlist ${new Date().toLocaleDateString()}`,
        url: formData.playlistUrl,
        channelCount: channels.length,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('tv_playlists', JSON.stringify(playlists));

      setFormData({
        name: '',
        playlistUrl: '',
        playlistContent: ''
      });

      if (onChannelsAdded) {
        onChannelsAdded(channels);
      }

      alert(`Successfully added ${channels.length} channels!`);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '10px', color: '#667eea' }}>Add New Playlist</h2>
      <p style={{ color: '#ccc', marginBottom: '25px' }}>Add M3U playlist via URL or paste content directly</p>
      
      {error && (
        <div className="error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Playlist Name (Optional):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="My TV Playlist"
          />
        </div>

        <div className="form-group">
          <label>Playlist URL:</label>
          <input
            type="url"
            name="playlistUrl"
            value={formData.playlistUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/playlist.m3u"
          />
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0', color: '#666', fontSize: '14px' }}>
          ─── OR ───
        </div>

        <div className="form-group">
          <label>Playlist Content (M3U format):</label>
          <textarea
            name="playlistContent"
            value={formData.playlistContent}
            onChange={handleInputChange}
            placeholder={`#EXTM3U\n#EXTINF:-1 tvg-id="channel1" tvg-name="Channel 1" tvg-logo="https://example.com/logo.png" group-title="Entertainment",Channel 1\nhttps://example.com/stream1.m3u8`}
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Adding Channels...' : 'Add Playlist'}
        </button>
      </form>
    </div>
  );
}
