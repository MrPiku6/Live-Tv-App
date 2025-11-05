'use client';

import { useState, useEffect } from 'react';
import ChannelCard from './ChannelCard';

export default function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
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

  // Get unique groups for filter
  const groups = ['All', ...new Set(channels.map(channel => channel.group).filter(Boolean))];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(filter.toLowerCase()) ||
                         channel.group.toLowerCase().includes(filter.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || channel.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  if (loading) {
    return (
      <div className="user-container">
        <div className="loading">Loading channels...</div>
      </div>
    );
  }

  return (
    <div className="user-container">
      {/* Search and Filter Section */}
      <div style={{ marginBottom: '30px' }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search channels..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
        </div>
        
        {/* Group Filter */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={selectedGroup === group ? 'btn btn-small' : 'btn btn-secondary btn-small'}
              style={{ 
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '20px'
              }}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {filteredChannels.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#ccc' }}>No channels found</h3>
          <p style={{ color: '#666' }}>Add some playlists from the admin panel to get started.</p>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px 20px',
            background: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Live TV Channels</h2>
              <p style={{ color: '#ccc', fontSize: '14px' }}>
                {filteredChannels.length} channels available
                {selectedGroup !== 'All' && ` in ${selectedGroup}`}
              </p>
            </div>
            <div style={{ 
              padding: '8px 16px', 
              background: '#2a2a2a', 
              borderRadius: '20px',
              fontSize: '14px',
              color: '#ccc'
            }}>
              {selectedGroup}
            </div>
          </div>

          <div className="channels-grid">
            {filteredChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
