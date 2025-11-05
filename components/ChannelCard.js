'use client';

import Link from 'next/link';
import { generateLogo } from '../lib/utils';

export default function ChannelCard({ channel }) {
  return (
    <Link href={`/player/${channel.id}`} style={{ textDecoration: 'none' }}>
      <div className="channel-card">
        <div className="channel-image">
          {channel.tvgLogo ? (
            <img 
              src={channel.tvgLogo} 
              alt={channel.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="channel-logo"
            style={{ 
              display: channel.tvgLogo ? 'none' : 'flex',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {generateLogo(channel.name)}
          </div>
        </div>
        <div className="channel-info">
          <div className="channel-name">{channel.name}</div>
          <div className="channel-group">{channel.group}</div>
          <div className="channel-badge">
            {channel.url.includes('.m3u8') ? 'HLS' : 
             channel.url.includes('.mpd') ? 'DASH' : 
             channel.url.includes('.ts') ? 'TS' : 'LIVE'}
          </div>
        </div>
      </div>
    </Link>
  );
}
