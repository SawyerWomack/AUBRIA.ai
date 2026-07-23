'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal, .gallery-card');
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

      <div className="section">
        <div className="section-header reveal">
          <span className="section-num">01 / VIDEO</span>
          <h2 className="section-title">AUBRIA keynote <span>video</span></h2>
        </div>

        <div className="gallery-video-card reveal">
          <div className="gallery-video-placeholder">
            <div>
              <div className="gallery-placeholder-label">YouTube Video</div>
              <p>Add the AUBRIA YouTube link here when it is ready.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section gallery-section-alt">
        <div className="section-header reveal">
          <span className="section-num">02 / EVENT</span>
          <h2 className="section-title">Alabama AI <span>Exchange</span></h2>
        </div>

        <p className="gallery-intro reveal">
          AUBRIA at the Alabama AI Exchange event, connecting with researchers, students, and AI leaders across Alabama.
        </p>

        <div className="gallery-grid">
          {['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'].map((label) => (
            <div className="gallery-card" key={label}>
              <div className="gallery-photo-placeholder">{label}</div>
            </div>
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
