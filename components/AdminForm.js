'use client';

import { useState } from 'react';

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

  // Simple M3U parser function
  const parseM3U = (content) => {
    const lines = content.split('\n');
    const channels = [];
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const info = line.substring(8);
        const commaIndex = info.lastIndexOf(',');
        const channelName = info.substring(commaIndex + 1).trim();
        
        // Extract attributes
        const attrs = {};
        const attrMatches = info.substring(0, commaIndex).match(/([a-zA-Z-]+)="([^"]*)"/g) || [];
        
        attrMatches.forEach(attr => {
          const [key, value] = attr.split('=');
          attrs[key] = value.replace(/"/g, '');
        });

        currentChannel = {
          id: `channel_${Date.now()}_${i}`,
          name: channelName,
          tvgId: attrs['tvg-id'] || '',
          tvgName: attrs['tvg-name'] || '',
          tvgLogo: attrs['tvg-logo'] || '',
          group: attrs['group-title'] || 'General',
          url: ''
        };
      } else if (line && !line.startsWith('#') && currentChannel.name && !line.startsWith('#EXT')) {
        // This is the URL line
        currentChannel.url = line.trim();
        if (currentChannel.url) {
          channels.push({ ...currentChannel });
        }
        currentChannel = {};
      }
    }
    return channels;
  };

  const fetchPlaylist = async (url) => {
    try {
      // Direct fetch without proxy for now
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return await response.text();
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback: try with CORS proxy
      try {
        const proxyResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await proxyResponse.json();
        return data.contents;
      } catch (proxyError) {
        throw new Error(`Failed to fetch playlist: ${proxyError.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let playlistContent = formData.playlistContent;

      // If URL is provided, fetch the content
      if (formData.playlistUrl && !playlistContent) {
        playlistContent = await fetchPlaylist(formData.playlistUrl);
      }

      if (!playlistContent) {
        throw new Error('Please provide either playlist URL or content');
      }

      // Parse the playlist
      const playlistId = `playlist_${Date.now()}`;
      const channels = parseM3U(playlistContent);

      if (channels.length === 0) {
        throw new Error('No valid channels found in the playlist. Please check the format.');
      }

      console.log('Parsed channels:', channels); // Debug log

      // Store in localStorage
      const existingChannels = JSON.parse(localStorage.getItem('tv_channels') || '[]');
      const updatedChannels = [...existingChannels, ...channels];
      localStorage.setItem('tv_channels', JSON.stringify(updatedChannels));

      // Store playlist info
      const playlists = JSON.parse(localStorage.getItem('tv_playlists') || '[]');
      playlists.push({
        id: playlistId,
        name: formData.name || `Playlist ${new Date().toLocaleDateString()}`,
        url: formData.playlistUrl,
        channelCount: channels.length,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('tv_playlists', JSON.stringify(playlists));

      // Reset form
      setFormData({
        name: '',
        playlistUrl: '',
        playlistContent: ''
      });

      // Notify parent
      if (onChannelsAdded) {
        onChannelsAdded(channels);
      }

      alert(`Successfully added ${channels.length} channels!`);

    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ marginBottom: '20px' }}>Add Playlist</h2>
      
      {error && (
        <div className="error" style={{ 
          background: '#ff4757', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0', color: '#ccc' }}>
          OR
        </div>

        <div className="form-group">
          <label>Playlist Content (M3U format):</label>
          <textarea
            name="playlistContent"
            value={formData.playlistContent}
            onChange={handleInputChange}
            placeholder={`#EXTM3U
#EXTINF:-1 tvg-id="channel1" tvg-name="Channel 1" tvg-logo="https://example.com/logo.png" group-title="Entertainment",Channel 1
https://example.com/stream1.m3u8

#EXTINF:-1 tvg-id="channel2" tvg-name="Channel 2" group-title="News",Channel 2  
https://example.com/stream2.m3u8`}
            disabled={loading}
            rows="8"
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Adding Channels...' : 'Add Playlist'}
        </button>
      </form>

      <div style={{ marginTop: '30px', padding: '15px', background: '#2a2a2a', borderRadius: '5px' }}>
        <h4>M3U Format Example:</h4>
        <pre style={{ fontSize: '12px', color: '#ccc', overflow: 'auto' }}>
          {`#EXTM3U
#EXTINF:-1 tvg-id="channel1" tvg-name="Channel 1" tvg-logo="logo1.png" group-title="Entertainment",Channel 1
https://example.com/stream1.m3u8

#EXTINF:-1 tvg-id="channel2" tvg-name="Channel 2" group-title="News",Channel 2
https://example.com/stream2.m3u8`}
        </pre>
      </div>
    </div>
  );
}
