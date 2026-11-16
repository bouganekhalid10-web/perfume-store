"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackIntent = useRef<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let disposed = false;
    video.muted = true;

    function syncPlayback() {
      if (!video || disposed) return;
      const allowed = playbackIntent.current === "play" ||
        (playbackIntent.current === "auto" && !motion.matches);
      if (inView && document.visibilityState === "visible" && allowed) {
        // Autoplay can be blocked by battery-saving or browser settings.
        // The visible play button still lets the visitor start the film.
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
    motion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
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
        src="/videos/perfume-water.mp4"
        poster="/images/hero-perfume.png"
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Flacon de parfum en verre et mouvement de l’eau"
        hidden={failed}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      {!failed && (
        <button
          type="button"
          className="hero-video-toggle"
          onClick={togglePlayback}
          aria-controls="hero-film"
          aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
          title={playing ? "Mettre en pause" : "Lire la vidéo"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M6 5h4v14H6zm8 0h4v14h-4z" /> : <path d="m8 4 13 8-13 8z" />}
          </svg>
        </button>
      )}
    </div>
  );
}
