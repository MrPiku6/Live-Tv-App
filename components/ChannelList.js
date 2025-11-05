'use client';

import { useState, useEffect } from 'react';
import ChannelCard from './ChannelCard';

export default function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      // In a real app, you'd fetch from an API
      const storedChannels = localStorage.getItem('tv_channels');
      if (storedChannels) {
        setChannels(JSON.parse(storedChannels));
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(filter.toLowerCase()) ||
    channel.group.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading channels...</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search channels or groups..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #333',
            borderRadius: '5px',
            background: '#1a1a1a',
            color: 'white'
          }}
        />
      </div>

      {filteredChannels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No channels found</h3>
          <p>Add some playlists from the admin panel to get started.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
}
