"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function HeroVideo({ children, action }: { children: ReactNode; action: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackIntent = useRef<"play" | "pause">("pause");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = false;
    let disposed = false;
    video.muted = true;

    function syncPlayback() {
      if (!video || disposed) return;
      if (inView && document.visibilityState === "visible" && playbackIntent.current === "play") {
        // Start only after a visitor chooses Play, then resume after returning
        // to the banner or tab unless they explicitly paused the film.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 });

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      playbackIntent.current = "play";
      void video.play().catch(() => {});
    } else {
      playbackIntent.current = "pause";
      video.pause();
    }
  }

  return (
    <div className="hero-media">
      <video
        ref={videoRef}
        id="hero-film"
        className="hero-video"
        src="/videos/perfume-water.mp4#t=0.1"
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Flacon de parfum en verre et mouvement de l’eau"
        hidden={failed}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <div className="hero-content">
        <div className="hero-copy">{children}</div>
        {!failed && (
          <button
            type="button"
            className="hero-video-toggle"
            onClick={togglePlayback}
            aria-controls="hero-film"
            aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
            title={playing ? "Mettre en pause" : "Lire la vidéo"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> : <path d="m8 4 13 8-13 8z" />}
            </svg>
          </button>
        )}
        <div className="hero-action">{action}</div>
      </div>
    </div>
  );
}
