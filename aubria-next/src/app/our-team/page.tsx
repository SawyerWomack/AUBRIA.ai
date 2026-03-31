'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OurTeamPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal, .story-entry, .team-section-card');
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
      {/* NAV */}
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
          <li><a href="#story" className="nav-link" onClick={() => setMenuOpen(false)}>Our Team</a></li>
          <li><a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </nav>

      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-header-label">Auburn University · Meet the Team</div>
          <h1>Our Team,<br /><span>Auburn-Built</span></h1>
          <p className="page-header-sub">The faculty, researchers, and students behind AUBRIA — a conference-ready AI keynote experience built within Auburn&apos;s research community.</p>
        </div>
      </div>

      <hr className="rule" />

      {/* STORY SECTION */}
      <div className="section" id="story">
        <div className="section-header reveal">
          <span className="section-num">01 / TEAM</span>
          <h2 className="section-title">The people behind <span>AUBRIA</span></h2>
        </div>

        <div className="story-entries">
          {/* Christine Cline */}
          <div className="story-entry">
            <div className="story-photo">
              <img src="/our-story/cc.png" alt="Christine Cline" />
            </div>
            <div className="story-info">
              <div className="story-info-inner">
                <div className="story-mono-label">The Spark</div>
                <div className="story-name">Christine Cline</div>
                <div className="story-role">Director, Proposal Services &amp; Faculty Support (PSFS)</div>
                <p className="story-body">
                  AUBRIA began at Auburn University as a bold Team Science idea. While planning the 2026
                  <strong> AI@AU / Team Science Series: Building Research Communities in AI</strong>
                  {' '}(Showcase &amp; Workshop), Christine envisioned opening the event with something entirely
                  new — an AI-generated keynote speaker built to represent Auburn&apos;s research community in
                  a modern, engaging way.
                </p>
              </div>
            </div>
          </div>

          {/* Dr. Jennifer Kerpelman (reversed) */}
          <div className="story-entry reverse">
            <div className="story-photo">
              <img src="/our-story/jk.png" alt="Dr. Jennifer Kerpelman" />
            </div>
            <div className="story-info">
              <div className="story-info-inner">
                <div className="story-mono-label">The Vision</div>
                <div className="story-name">Dr. Jennifer Kerpelman</div>
                <div className="story-role">Associate Vice President for Research · Office of the Senior Vice President for Research and Economic Development · Auburn University</div>
                <p className="story-body">
                  Christine shared the idea with <strong>Dr. Jennifer Kerpelman</strong>, who helped
                  shape it into a clear event vision. She then carried the concept forward to
                  <strong> Dr. Gerry Dozier</strong> so the idea could move from &quot;what if&quot; to
                  &quot;let&apos;s build it.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Dr. Gerry Dozier */}
          <div className="story-entry">
            <div className="story-photo">
              <img src="/our-story/gd.png" alt="Dr. Gerry Dozier" />
            </div>
            <div className="story-info">
              <div className="story-info-inner">
                <div className="story-mono-label">The Build</div>
                <div className="story-name">Dr. Gerry Dozier</div>
                <div className="story-role">Faculty Advisor</div>
                <p className="story-body">
                  <strong>Dr. Dozier</strong> assembled a student development team from CSSE to bring
                  AUBRIA to life, combining AI generation, storytelling, and media production into a
                  conference-ready keynote experience designed for Auburn audiences.
                </p>
              </div>
            </div>
          </div>

          {/* Dr. Hari Narayanan (reversed) */}
          <div className="story-entry reverse">
            <div className="story-photo">
              <img src="/our-story/hn.png" alt="Dr. Hari Narayanan" />
            </div>
            <div className="story-info">
              <div className="story-info-inner">
                <div className="story-mono-label">The Polish</div>
                <div className="story-name">Dr. Hari Narayanan</div>
                <div className="story-role">Chair, CSSE Department</div>
                <p className="story-body">
                  With guidance from <strong>Dr. Jennifer Kerpelman</strong>, <strong>Dr. Hari Narayanan</strong>,
                  and <strong>Christine Cline</strong>, the student team refined AUBRIA into a polished
                  keynote experience built with care for clarity, credibility, and an Auburn-proud
                  visual identity.
                </p>
              </div>
            </div>
          </div>

          {/* Student Team — wide card */}
          <div className="team-section-card">
            <div className="team-section-inner">
              <div className="team-card-header">
                <div className="team-card-mono">The Student Team</div>
                <div className="team-card-title">The AUBRIA Student Team</div>
                <div className="team-card-role">CSSE · Samuel Ginn College of Engineering, Auburn University</div>
                <p className="team-card-body">
                  AUBRIA is a student-led team within CSSE, passionate about Artificial Intelligence,
                  Agentic AI, and Cybersecurity. We are affiliated with <strong>AI@AU</strong> (Auburn
                  University Artificial Intelligence Initiative) and <strong>AU-CAICE</strong> (Auburn
                  University Center for AI &amp; Cybersecurity Engineering). Currently, we develop AUBRIA
                  Keynote Talks for Auburn University conferences, workshops, meetings, and research events.
                </p>
              </div>

              <div className="student-row">
                <div className="student-chip">
                  <div className="student-avatar">
                    <img src="/our-story/team1.png" alt="Jahidul Arafat" />
                  </div>
                  <div className="student-chip-text">
                    <div className="student-chip-name">Jahidul Arafat</div>
                    <div className="student-chip-role">PhD CSSE Student</div>
                  </div>
                </div>

                <div className="student-chip">
                  <div className="student-avatar">
                    <img src="/our-story/team2.png" alt="Bhuvaneshwari Bodakuntla" />
                  </div>
                  <div className="student-chip-text">
                    <div className="student-chip-name">Bhuvaneshwari Bodakuntla</div>
                    <div className="student-chip-role">MS Data Engineering Student</div>
                  </div>
                </div>

                <div className="student-chip">
                  <div className="student-avatar">
                    <img src="/our-story/team3.png" alt="Sawyer Womack" />
                  </div>
                  <div className="student-chip-text">
                    <div className="student-chip-name">Sawyer Womack</div>
                    <div className="student-chip-role">BS CSSE Student</div>
                  </div>
                </div>
              </div>

              <div className="team-affil-row">
                <span className="team-affil-label">Affiliated with</span>
                <span className="affil-tag affil-tag-orange">AI@AU</span>
                <span className="affil-tag affil-tag-orange">AU-CAICE</span>
                <span className="affil-tag affil-tag-blue">CSSE Department</span>
                <span className="affil-tag affil-tag-blue">Samuel Ginn College of Engineering</span>
                <span className="affil-tag affil-tag-blue">Auburn University</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-band" id="contact">
        <div className="cta-inner">
          <span className="section-num">02 / DEPLOY</span>
          <h2>Interested in an <span>AUBRIA</span> Keynote Talk?</h2>
          <p>If you&apos;d like our team to develop an AUBRIA keynote for your conference, workshop, meeting, or event, reach out to us or our faculty advisor, Dr. Gerry Dozier.</p>
          <div className="btn-group">
            <Link href="/request" className="btn-cta-primary">Get Started →</Link>
            <Link href="/" className="btn-cta-outline">Back to Home</Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">[<span>AUBRIA</span>]</div>
        <div className="footer-info">
          Samuel Ginn College of Engineering · Auburn University<br />
          Department of CSSE · Faculty Advisor: Dr. Gerry Dozier
        </div>
      </footer>
    </>
  );
}
