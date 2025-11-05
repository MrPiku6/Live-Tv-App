'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '../../../components/VideoPlayer';
import { getStreamType } from '../../../lib/utils';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannel();
  }, [params.channelId]);

  const loadChannel = () => {
    try {
      const storedChannels = JSON.parse(localStorage.getItem('tv_channels') || '[]');
      const foundChannel = storedChannels.find(c => c.id === params.channelId);
      
      if (foundChannel) {
        setChannel(foundChannel);
      } else {
        throw new Error('Channel not found');
      }
    } catch (error) {
      console.error('Error loading channel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="player-container">
        <div className="loading">Loading channel...</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="player-container">
        <div className="error">Channel not found</div>
        <button onClick={() => router.back()} className="btn">
          Go Back to Channels
        </button>
      </div>
    );
  }

  const streamType = getStreamType(channel.url);

  return (
    <div className="player-container">
      <div className="player-header">
        <div>
          <button 
            onClick={() => router.back()} 
            className="btn btn-secondary"
            style={{ marginRight: '15px' }}
          >
            ← Back
          </button>
          <span className="channel-title">{channel.name}</span>
          <div style={{ 
            display: 'inline-block',
            marginLeft: '15px',
            padding: '4px 12px',
            background: '#333',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#ccc'
          }}>
            {channel.group}
          </div>
        </div>
        <div style={{ 
          padding: '8px 16px', 
          background: '#2a2a2a', 
          borderRadius: '12px',
          fontSize: '14px',
          color: '#ccc'
        }}>
          {streamType.toUpperCase()} Stream
        </div>
      </div>

      <VideoPlayer 
        url={channel.url} 
        type={streamType}
        channelName={channel.name}
      />

      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: '#1a1a1a', 
        borderRadius: '12px',
        border: '1px solid #333'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Stream Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', color: '#ccc' }}>
          <div><strong>Channel:</strong></div>
          <div>{channel.name}</div>
          
          <div><strong>Group:</strong></div>
          <div>{channel.group}</div>
          
          <div><strong>Format:</strong></div>
          <div>{streamType.toUpperCase()}</div>
          
          <div><strong>URL:</strong></div>
          <div style={{ 
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {channel.url}
          </div>
        </div>
      </div>
    </div>
  );
}
