// Simple in-memory database for demo
// In production, use a proper database like MongoDB, PostgreSQL, etc.

let playlists = [];
let channels = [];

export const database = {
  // Playlist methods
  addPlaylist: (playlist) => {
    const newPlaylist = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...playlist
    };
    playlists.push(newPlaylist);
    return newPlaylist;
  },

  getPlaylists: () => {
    return [...playlists];
  },

  deletePlaylist: (id) => {
    playlists = playlists.filter(p => p.id !== id);
    // Also remove associated channels
    channels = channels.filter(c => c.playlistId !== id);
  },

  // Channel methods
  addChannels: (newChannels) => {
    channels.push(...newChannels);
    return newChannels;
  },

  getChannels: () => {
    return [...channels];
  },

  getChannel: (id) => {
    return channels.find(c => c.id === id);
  },

  deleteChannelsByPlaylist: (playlistId) => {
    channels = channels.filter(c => c.playlistId !== playlistId);
  }
};
