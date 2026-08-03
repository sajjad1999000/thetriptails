'use client';
// components/story-extras/ImageCarousel.jsx
//
// Single-story page image gallery.
// Desktop (>=900px): sticky on the right, stays in view while the
//   story text scrolls past on the left.
// Mobile (<900px): stacked above the story text, not sticky.
//
// Auto-advances every 4s; pauses while the mouse is over it or briefly
// after the reader manually navigates.

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const AUTOPLAY_MS = 4000;

export default function ImageCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const count = images?.length ?? 0;

  function goTo(i) {
    setIndex(i);
  }
  function prev() {
    setIndex((i) => (i === 0 ? count - 1 : i - 1));
  }
  function next() {
    setIndex((i) => (i === count - 1 ? 0 : i + 1));
  }

  useEffect(() => {
    if (count <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i === count - 1 ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [count, paused]);

  if (!count) return null;

  function handleManualNav(fn) {
    fn();
    setPaused(true);
    setTimeout(() => setPaused(false), AUTOPLAY_MS);
  }

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-frame">
        <Image
          key={images[index]}
          src={images[index]}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 420px"
          style={{ objectFit: 'cover' }}
        />

        {count > 1 && (
          <>
            <button type="button" className="carousel-nav carousel-nav-prev" onClick={() => handleManualNav(prev)} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" className="carousel-nav carousel-nav-next" onClick={() => handleManualNav(next)} aria-label="Next photo">
              ›
            </button>
            <div className="carousel-count">
              {index + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="carousel-thumbs">
          {images.map((url, i) => (
            <button
              type="button"
              key={url}
              className={`carousel-thumb ${i === index ? 'active' : ''}`}
              onClick={() => handleManualNav(() => goTo(i))}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={url} alt="" fill sizes="60px" style={{ objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .carousel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .carousel-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 14px;
          overflow: hidden;
          background: var(--mist);
        }
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(23, 59, 46, 0.65);
          color: #fff;
          font-size: 1.4rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .carousel-nav-prev {
          left: 0.6rem;
        }
        .carousel-nav-next {
          right: 0.6rem;
        }
        .carousel-count {
          position: absolute;
          bottom: 0.6rem;
          right: 0.6rem;
          background: rgba(23, 59, 46, 0.65);
          color: #fff;
          font-family: var(--body);
          font-size: 0.75rem;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }
        .carousel-thumbs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }
        .carousel-thumb {
          position: relative;
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          padding: 0;
          cursor: pointer;
        }
        .carousel-thumb.active {
          border-color: var(--sun, #d98e2f);
        }
      `}</style>
    </div>
  );
}