'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type GalleryEventProps = {
  title: string;
  accent: string;
  description: string;
  videoId: string;
  videoTitle: string;
  photoLabels?: string[];
};

function GalleryEvent({ title, accent, description, videoId, videoTitle, photoLabels = [] }: GalleryEventProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = ['Video', ...photoLabels];
  const hasMultipleSlides = slides.length > 1;

  const showPreviousSlide = () => {
    setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const showNextSlide = () => {
    setActiveSlide((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="section gallery-event-section">
      <div className="gallery-event-header reveal">
        <span className="section-num">EVENT</span>
        <h2 className="section-title">{title} <span>{accent}</span></h2>
      </div>

      <p className="gallery-intro reveal">{description}</p>

      <div className={`gallery-carousel reveal ${hasMultipleSlides ? '' : 'single-slide'}`}>
        {hasMultipleSlides && (
          <button className="gallery-arrow gallery-arrow-left" onClick={showPreviousSlide} aria-label={`Previous ${title} slide`}>
            ‹
          </button>
        )}

        <div className="gallery-slide">
          {activeSlide === 0 ? (
            <div className="gallery-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="gallery-photo-placeholder">{photoLabels[activeSlide - 1]}</div>
          )}
        </div>

        {hasMultipleSlides && (
          <button className="gallery-arrow gallery-arrow-right" onClick={showNextSlide} aria-label={`Next ${title} slide`}>
            ›
          </button>
        )}
      </div>

      {hasMultipleSlides && (
        <div className="gallery-dots" aria-label={`${title} slide navigation`}>
          {slides.map((label, index) => (
            <button
              key={label}
              className={`gallery-dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${title} ${label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal, .gallery-carousel');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="bracket">[</span>
          <span className="logo-name">AUBRIA</span>
          <span className="bracket">]</span>
          <span className="nav-badge">v1.0</span>
        </Link>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <ul className={`nav-ul ${menuOpen ? 'open' : ''}`}>
          <li><Link href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link href="/our-team" className="nav-link" onClick={() => setMenuOpen(false)}>Our Team</Link></li>
          <li><Link href="/gallery" className="nav-link" onClick={() => setMenuOpen(false)}>Our Gallery</Link></li>
          <li><Link href="/request" className="nav-link" onClick={() => setMenuOpen(false)}>Request</Link></li>
        </ul>
      </nav>

      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-header-label">AUBRIA Media</div>
          <h1>Our <span>Gallery</span></h1>
          <p className="page-header-sub">Videos, event moments, and community highlights from the AUBRIA project.</p>
        </div>
      </div>

      <hr className="rule" />

      <GalleryEvent
        title="Alabama AI"
        accent="Exchange 2026"
        description="AUBRIA at Alabama AI Exchange 2026, sharing project highlights and connecting with the broader AI community."
        videoId="sMQZp5-MhAk"
        videoTitle="AUBRIA Alabama AI Exchange 2026 video"
        photoLabels={['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4']}
      />

      <GalleryEvent
        title="AUCVM External Advisory Council"
        accent="(DCSITE)"
        description="AUBRIA presentation and media from the AUCVM External Advisory Council event for DCSITE."
        videoId="sGyA4JV6494"
        videoTitle="AUBRIA AUCVM External Advisory Council DCSITE video"
      />

      <GalleryEvent
        title="AI Ethics"
        accent="Iron Bowl"
        description="AUBRIA media from the AI Ethics Iron Bowl event."
        videoId="vF6NjhEK42k"
        videoTitle="AUBRIA AI Ethics Iron Bowl video"
      />

      <footer id="contact">
        <div className="footer-logo">[<span>AUBRIA</span>]</div>
        <div className="footer-info">
          Samuel Ginn College of Engineering · Auburn University<br />
          Department of CSSE · Faculty Advisor: Dr. Gerry Dozier
        </div>
      </footer>
    </>
  );
}
