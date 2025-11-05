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
      <div className="loading">Loading channel...</div>
    );
  }

  if (!channel) {
    return (
      <div className="container">
        <div className="error">Channel not found</div>
        <button onClick={() => router.back()} className="btn">
          Go Back
        </button>
      </div>
    );
  }

  const streamType = getStreamType(channel.url);

  return (
    <div className="player-container">
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => router.back()} className="btn btn-secondary">
          ← Back to Channels
        </button>
      </div>

      <div style={{ 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1>{channel.name}</h1>
        <p style={{ color: '#ccc' }}>{channel.group}</p>
        <div style={{ 
          display: 'inline-block',
          padding: '5px 10px',
          background: '#333',
          borderRadius: '15px',
          fontSize: '12px',
          marginTop: '10px'
        }}>
          {streamType.toUpperCase()} Stream
        </div>
      </div>

      <VideoPlayer url={channel.url} type={streamType} />

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#1a1a1a', 
        borderRadius: '10px',
        fontSize: '14px',
        color: '#ccc'
      }}>
        <strong>Stream URL:</strong>
        <div style={{ 
          wordBreak: 'break-all',
          marginTop: '5px',
          fontFamily: 'monospace'
        }}>
          {channel.url}
        </div>
      </div>
    </div>
  );
}
