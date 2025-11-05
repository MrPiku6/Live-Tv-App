export const parseM3U = async (m3uContent, playlistId) => {
  const lines = m3uContent.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF line
      const extinf = line.substring(8);
      const commaIndex = extinf.lastIndexOf(',');
      const attributes = extinf.substring(0, commaIndex);
      const name = extinf.substring(commaIndex + 1);
      
      // Parse attributes
      const attrRegex = /([a-zA-Z-]+)="([^"]*)"/g;
      const attrs = {};
      let match;
      
      while ((match = attrRegex.exec(attributes)) !== null) {
        attrs[match[1]] = match[2];
      }
      
      currentChannel = {
        id: `channel_${Date.now()}_${i}`,
        playlistId,
        name: name.trim(),
        tvgId: attrs['tvg-id'] || '',
        tvgName: attrs['tvg-name'] || '',
        tvgLogo: attrs['tvg-logo'] || '',
        group: attrs['group-title'] || 'General',
        url: ''
      };
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the URL line
      currentChannel.url = line;
      channels.push({ ...currentChannel });
      currentChannel = {};
    }
  }

  return channels;
};

export const getStreamType = (url) => {
  if (url.includes('.m3u8')) return 'hls';
  if (url.includes('.mpd')) return 'dash';
  if (url.includes('.m3u')) return 'm3u';
  if (url.includes('.ts')) return 'ts';
  return 'unknown';
};

export const generateLogo = (name) => {
  return name.charAt(0).toUpperCase();
};
