"use client";

import { useState } from "react";

const message = <>مرحباً بكم في متجركم لأفضل العطور، مع خصم <bdi dir="ltr">20%</bdi> على جميع العطور.</>;

export function AnnouncementBar() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="announcement" role="region" aria-label="إعلان المتجر" lang="ar" data-paused={paused}>
      <span className="sr-only" dir="rtl">{message}</span>
      <div className="announcement-viewport" aria-hidden="true">
        <div className="announcement-track">
          {[0, 1].map((group) => (
            <div className="announcement-group" key={group}>
              {[0, 1].map((item) => (
                <div className="announcement-item" key={item}>
                  <span className="announcement-message" dir="rtl">{message}</span>
                  <span className="announcement-divider">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        className="announcement-toggle"
        type="button"
        aria-label={paused ? "تشغيل حركة الإعلان" : "إيقاف حركة الإعلان"}
        title={paused ? "تشغيل حركة الإعلان" : "إيقاف حركة الإعلان"}
        onClick={() => setPaused((previous) => !previous)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {paused ? <path d="m8 4 13 8-13 8z" /> : <path d="M6 5h4v14H6zm8 0h4v14h-4z" />}
        </svg>
      </button>
    </div>
  );
}
