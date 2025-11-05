'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ url, type, channelName }) {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Shaka Player dynamically
    const loadShakaPlayer = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Load Shaka Player CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.6/controls.min.css';
          document.head.appendChild(link);

          // Load Shaka Player script
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/shaka-player/4.7.6/shaka-player.ui.min.js';
          script.crossOrigin = 'anonymous';
          
          script.onload = initializePlayer;
          script.onerror = () => setError('Failed to load video player');
          
          document.head.appendChild(script);
        } catch (err) {
          console.error('Error loading Shaka Player:', err);
          setError('Failed to load video player');
        }
      }
    };

    const initializePlayer = () => {
      if (!videoRef.current) return;

      try {
        // Initialize Shaka Player
        const video = videoRef.current;
        
        // Install built-in polyfills
        shaka.polyfill.installAll();

        // Check if the browser supports the basic features
        if (!shaka.Player.isBrowserSupported()) {
          setError('Browser not supported!');
          return;
        }

        const shakaPlayer = new shaka.Player(video);
        const ui = new shaka.ui.Overlay(
          shakaPlayer,
          video.parentElement,
          video
        );

        // Configure player
        shakaPlayer.configure({
          drm: {
            clearKeys: {}
          },
          streaming: {
            bufferingGoal: 30,
            rebufferingGoal: 2,
            bufferBehind: 30
          }
        });

        setPlayer(shakaPlayer);

        // Load the stream
        loadStream(shakaPlayer);

      } catch (err) {
        console.error('Error initializing player:', err);
        setError('Failed to initialize player');
        setLoading(false);
      }
    };

    const loadStream = async (shakaPlayer) => {
      try {
        setLoading(true);
        setError('');

        if (type === 'dash' || url.includes('.mpd')) {
          await shakaPlayer.load(url);
        } else if (type === 'hls' || url.includes('.m3u8')) {
          await shakaPlayer.load(url);
        } else {
          // For other formats, try to play directly
          videoRef.current.src = url;
          await videoRef.current.play();
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading stream:', err);
        setError('Failed to load stream. The channel might be offline.');
        setLoading(false);
      }
    };

    loadShakaPlayer();

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [url, type]);

  if (error) {
    return (
      <div style={{ 
        background: '#1a1a1a', 
        padding: '40px', 
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #333'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ marginBottom: '10px', color: '#ff4757' }}>Playback Error</h3>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid #333',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading stream...</p>
          </div>
        </div>
      )}
      
      <div 
        data-shaka-player-container="" 
        className="shaka-video-container"
        style={{ 
          width: '100%', 
          maxWidth: '1000px',
          margin: '0 auto',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '400px',
            background: '#000'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
