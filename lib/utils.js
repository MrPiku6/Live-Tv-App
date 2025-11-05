export const parseM3U = async (m3uContent, playlistId) => {
  const lines = m3uContent.split('\n');
  const channels = [];
  let currentChannel = {};

  console.log('Total lines in playlist:', lines.length);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF line
      const extinf = line.substring(8);
      const commaIndex = extinf.lastIndexOf(',');
      
      if (commaIndex === -1) {
        console.log('Skipping invalid EXTINF line:', line);
        continue;
      }
      
      const attributes = extinf.substring(0, commaIndex);
      const name = extinf.substring(commaIndex + 1);
      
      // Parse attributes
      const attrRegex = /([a-zA-Z-]+)=("([^"]*)"|([^" \n]*))/g;
      const attrs = {};
      let match;
      
      while ((match = attrRegex.exec(attributes)) !== null) {
        attrs[match[1]] = match[3] || match[4] || match[2];
      }
      
      currentChannel = {
        id: `channel_${Date.now()}_${i}`,
        playlistId,
        name: name.trim() || 'Unknown Channel',
        tvgId: attrs['tvg-id'] || '',
        tvgName: attrs['tvg-name'] || '',
        tvgLogo: attrs['tvg-logo'] || attrs['tvg-logo-url'] || '',
        group: attrs['group-title'] || attrs['group-title'] || 'General',
        url: ''
      };
      
      console.log('Found channel:', currentChannel.name);
      
    } else if (line && !line.startsWith('#') && currentChannel.name) {
      // This is the URL line
      if (line.startsWith('http') || line.startsWith('https') || line.startsWith('rtmp') || line.startsWith('rtsp')) {
        currentChannel.url = line;
        channels.push({ ...currentChannel });
        console.log('Added channel with URL:', currentChannel.name, currentChannel.url);
        currentChannel = {};
      }
    }
  }

  console.log('Total channels parsed:', channels.length);
  return channels;
};

export const getStreamType = (url) => {
  if (!url) return 'unknown';
  
  const urlLower = url.toLowerCase();
  if (urlLower.includes('.m3u8')) return 'hls';
  if (urlLower.includes('.mpd')) return 'dash';
  if (urlLower.includes('.m3u')) return 'm3u';
  if (urlLower.includes('.ts')) return 'ts';
  if (urlLower.includes('rtmp')) return 'rtmp';
  if (urlLower.includes('rtsp')) return 'rtsp';
  return 'unknown';
};

export const generateLogo = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'TV';
};
