'use client';

import Link from 'next/link';
import { generateLogo } from '../lib/utils';

export default function ChannelCard({ channel }) {
  return (
    <Link href={`/player/${channel.id}`} style={{ textDecoration: 'none' }}>
      <div className="channel-card">
        <div className="channel-logo">
          {channel.tvgLogo ? (
            <img 
              src={channel.tvgLogo} 
              alt={channel.name}
              style={{ width: '100%', height: '100%', borderRadius: '10px' }}
            />
          ) : (
            <span>{generateLogo(channel.name)}</span>
          )}
        </div>
        <h3 style={{ marginBottom: '5px', color: 'white' }}>{channel.name}</h3>
        <p style={{ color: '#ccc', fontSize: '14px' }}>{channel.group}</p>
        <div style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          background: '#333', 
          borderRadius: '15px', 
          fontSize: '12px',
          display: 'inline-block'
        }}>
          {channel.url.includes('.m3u8') ? 'HLS' : 
           channel.url.includes('.mpd') ? 'DASH' : 'LIVE'}
        </div>
      </div>
    </Link>
  );
}
