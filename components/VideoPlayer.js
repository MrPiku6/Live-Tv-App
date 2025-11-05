'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import dashjs from 'dashjs';

export default function VideoPlayer({ url, type }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;
    let dash;

    const initializePlayer = () => {
      // Clean up previous instances
      if (hls) {
        hls.destroy();
      }
      if (dash) {
        dash.reset();
      }

      if (type === 'hls' && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(console.error);
        });

      } else if (type === 'dash') {
        dash = dashjs.MediaPlayer().create();
        dash.initialize(video, url, true);
        dash.on('streamInitialized', () => {
          video.play().catch(console.error);
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(console.error);
        });

      } else {
        console.error('Unsupported stream type or format');
      }
    };

    initializePlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (dash) {
        dash.reset();
      }
    };
  }, [url, type]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
