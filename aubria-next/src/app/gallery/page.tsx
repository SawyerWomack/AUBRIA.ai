'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAiExchangePhoto, setActiveAiExchangePhoto] = useState(0);
  const [activeDcsitePhoto, setActiveDcsitePhoto] = useState(0);
  const [activeEthicsPhoto, setActiveEthicsPhoto] = useState(0);
  const aiExchangePhotos = ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'];
  const dcsitePhotos = ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'];
  const ethicsPhotos = ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'];

  const showPreviousAiExchangePhoto = () => {
    setActiveAiExchangePhoto((current) => (current === 0 ? aiExchangePhotos.length - 1 : current - 1));
  };

  const showNextAiExchangePhoto = () => {
    setActiveAiExchangePhoto((current) => (current === aiExchangePhotos.length - 1 ? 0 : current + 1));
  };

  const showPreviousDcsitePhoto = () => {
    setActiveDcsitePhoto((current) => (current === 0 ? dcsitePhotos.length - 1 : current - 1));
  };

  const showNextDcsitePhoto = () => {
    setActiveDcsitePhoto((current) => (current === dcsitePhotos.length - 1 ? 0 : current + 1));
  };

  const showPreviousEthicsPhoto = () => {
    setActiveEthicsPhoto((current) => (current === 0 ? ethicsPhotos.length - 1 : current - 1));
  };

  const showNextEthicsPhoto = () => {
    setActiveEthicsPhoto((current) => (current === ethicsPhotos.length - 1 ? 0 : current + 1));
  };

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

      <div className="section gallery-event-section">
        <div className="gallery-event-header reveal">
          <span className="section-num">EVENT</span>
          <h2 className="section-title">Alabama AI <span>Exchange 2026</span></h2>
        </div>

        <p className="gallery-intro reveal">
          AUBRIA at Alabama AI Exchange 2026, sharing project highlights and connecting with the broader AI community.
        </p>

        <div className="gallery-video-card reveal">
          <div className="gallery-video-frame">
            <iframe
              src="https://www.youtube.com/embed/sMQZp5-MhAk"
              title="AUBRIA Alabama AI Exchange 2026 video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="gallery-carousel reveal">
          <button className="gallery-arrow gallery-arrow-left" onClick={showPreviousAiExchangePhoto} aria-label="Previous Alabama AI Exchange photo">
            ‹
          </button>
          <div className="gallery-slide">
            <div className="gallery-photo-placeholder">{aiExchangePhotos[activeAiExchangePhoto]}</div>
          </div>
          <button className="gallery-arrow gallery-arrow-right" onClick={showNextAiExchangePhoto} aria-label="Next Alabama AI Exchange photo">
            ›
          </button>
        </div>

        <div className="gallery-dots" aria-label="Alabama AI Exchange photo navigation">
          {aiExchangePhotos.map((label, index) => (
            <button
              key={label}
              className={`gallery-dot ${activeAiExchangePhoto === index ? 'active' : ''}`}
              onClick={() => setActiveAiExchangePhoto(index)}
              aria-label={`Show Alabama AI Exchange ${label}`}
            />
          ))}
        </div>
      </div>

      <div className="section gallery-event-section">
        <div className="gallery-event-header reveal">
          <span className="section-num">EVENT</span>
          <h2 className="section-title">AUCVM External Advisory Council <span>(DCSITE)</span></h2>
        </div>

        <p className="gallery-intro reveal">
          AUBRIA presentation and media from the AUCVM External Advisory Council event for DCSITE.
        </p>

        <div className="gallery-video-card reveal">
          <div className="gallery-video-frame">
            <iframe
              src="https://www.youtube.com/embed/sGyA4JV6494"
              title="AUBRIA AUCVM External Advisory Council DCSITE video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="gallery-carousel reveal">
          <button className="gallery-arrow gallery-arrow-left" onClick={showPreviousDcsitePhoto} aria-label="Previous DCSITE photo">
            ‹
          </button>
          <div className="gallery-slide">
            <div className="gallery-photo-placeholder">{dcsitePhotos[activeDcsitePhoto]}</div>
          </div>
          <button className="gallery-arrow gallery-arrow-right" onClick={showNextDcsitePhoto} aria-label="Next DCSITE photo">
            ›
          </button>
        </div>

        <div className="gallery-dots" aria-label="DCSITE photo navigation">
          {dcsitePhotos.map((label, index) => (
            <button
              key={label}
              className={`gallery-dot ${activeDcsitePhoto === index ? 'active' : ''}`}
              onClick={() => setActiveDcsitePhoto(index)}
              aria-label={`Show DCSITE ${label}`}
            />
          ))}
        </div>
      </div>

      <div className="section gallery-event-section">
        <div className="gallery-event-header reveal">
          <span className="section-num">EVENT</span>
          <h2 className="section-title">AI Ethics <span>Iron Bowl</span></h2>
        </div>

        <p className="gallery-intro reveal">
          AUBRIA media from the AI Ethics Iron Bowl event.
        </p>

        <div className="gallery-video-card reveal">
          <div className="gallery-video-frame">
            <iframe
              src="https://www.youtube.com/embed/vF6NjhEK42k"
              title="AUBRIA AI Ethics Iron Bowl video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="gallery-carousel reveal">
          <button className="gallery-arrow gallery-arrow-left" onClick={showPreviousEthicsPhoto} aria-label="Previous AI Ethics Iron Bowl photo">
            ‹
          </button>
          <div className="gallery-slide">
            <div className="gallery-photo-placeholder">{ethicsPhotos[activeEthicsPhoto]}</div>
          </div>
          <button className="gallery-arrow gallery-arrow-right" onClick={showNextEthicsPhoto} aria-label="Next AI Ethics Iron Bowl photo">
            ›
          </button>
        </div>

        <div className="gallery-dots" aria-label="AI Ethics Iron Bowl photo navigation">
          {ethicsPhotos.map((label, index) => (
            <button
              key={label}
              className={`gallery-dot ${activeEthicsPhoto === index ? 'active' : ''}`}
              onClick={() => setActiveEthicsPhoto(index)}
              aria-label={`Show AI Ethics Iron Bowl ${label}`}
            />
          ))}
        </div>
      </div>

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
