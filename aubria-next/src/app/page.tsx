'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('js-ready');

    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 80) navRef.current.classList.add('scrolled');
        else navRef.current.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav ref={navRef} className="nav-index" id="nav">
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
          <li><a href="#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#story" className="nav-link" onClick={() => setMenuOpen(false)}>Our Story</a></li>
          <li><a href="#composite" className="nav-link" onClick={() => setMenuOpen(false)}>Composite</a></li>
          <li><Link href="/our-team" className="nav-link" onClick={() => setMenuOpen(false)}>Our Team</Link></li>
          <li><a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg">
          <img src="/Gemini_Generated_Image_i7aabji7aabji7aa.png" alt="AUBRIA AI Keynote Speaker" />
        </div>
        <div className="hero-grid"></div>

        <div className="hero-content">
          <div className="hero-label">Auburn University · AI-Generated Keynote System</div>
          <h1>Meet<br /><span className="accent">AUBRIA</span></h1>
          <p className="hero-sub">A student-built AI keynote speaker system from the AI@AU LAB, Auburn University Artificial Intelligence Initiative — delivering intelligent, data-driven presentations for conferences, workshops, and research communities.</p>
          <div className="hero-actions">
            <Link href="/request" className="btn btn-primary">Request a Keynote →</Link>
            <a href="#about" className="btn btn-ghost">Learn More</a>
          </div>
          <div className="hero-chips">
            <span className="chip chip-blue">Agentic AI</span>
            <span className="chip chip-blue">Cybersecurity</span>
            <span className="chip chip-blue">NLP</span>
            <span className="chip chip-orange">Auburn University</span>
            <span className="chip chip-orange">CSSE</span>
            <span className="chip chip-blue">AI@AU</span>
          </div>
        </div>

        <div className="scroll-hint">SCROLL TO EXPLORE</div>
      </div>

      <hr className="rule" />

      {/* ABOUT */}
      <div className="section" id="about">
        <div className="section-header reveal">
          <span className="section-num">01 / ABOUT</span>
          <h2 className="section-title">Who we are &amp; what we <span>build</span></h2>
        </div>
        <div className="about-grid">
          <div className="prose reveal">
            <p>We are a student-led team from the <strong>Department of Computer Science &amp; Software Engineering (CSSE)</strong> in the Samuel Ginn College of Engineering at Auburn University.</p>
            <p>Our passions lie at the intersection of Artificial Intelligence, Agentic AI, and Cybersecurity — fields we believe will reshape how knowledge is shared and communicated.</p>
            <p>We are currently developing <strong>AUBRIA Keynote Talks</strong> for the Auburn University community — for AU Conferences, Workshops, Office/Department/College Meetings, etc. — and for external organizations. If you are interested in our team developing an AUBRIA Talk for your event, please contact us or our faculty advisor <strong>Dr. Gerry Dozier</strong>.</p>
            <p>We are also available to develop a <strong>totally different AI personality</strong> for your department or organization — tailored to your voice, your mission, your audience.</p>
          </div>

          <div className="reveal">
            <div className="affil-section-label">// Affiliations</div>
            <div className="affil-stack">
              <div className="affil-card">
                <div className="affil-label">A project of</div>
                <div className="affil-name">AI@AU — Auburn University Artificial Intelligence Initiative</div>
                <a className="affil-link" href="https://eng.auburn.edu/ai-au/" target="_blank" rel="noopener noreferrer">eng.auburn.edu/ai-au →</a>
              </div>
              <div className="affil-card">
                <div className="affil-label">Research Center</div>
                <div className="affil-name">AU-CAICE — Auburn University Center for AI &amp; Cybersecurity Engineering</div>
                <a className="affil-link" href="https://eng.auburn.edu/au-caice/" target="_blank" rel="noopener noreferrer">eng.auburn.edu/au-caice →</a>
              </div>
              <div className="affil-card">
                <div className="affil-label">Home Department</div>
                <div className="affil-name">Computer Science &amp; Software Engineering — Samuel Ginn College of Engineering</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="rule" />

      {/* STORY */}
      <div className="section" id="story">
        <div className="section-header reveal">
          <span className="section-num">02 / ORIGIN</span>
          <h2 className="section-title">How <span>AUBRIA</span> came to life</h2>
        </div>

        <div className="story-grid">
          <div className="timeline reveal">
            <div className="timeline-item">
              <div className="timeline-label">The Spark</div>
              <p>AUBRIA is the brainchild of <strong>Auburn University PSFS Director Christine Cline</strong>. During the development of the 2026 AI@AU/Team Sciences: Building Research Communities in AI (Showcase &amp; Workshop), Christine mentioned the idea of having an AI-Generated Keynote Speaker to <strong>Dr. Jennifer Kerpelman</strong> (Associate Vice President for Research), who in turn mentioned the idea to <strong>Dr. Gerry Dozier</strong> (Faculty Advisor).</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-label">The Team</div>
              <p>Dr. Dozier set out to find a team of students from the CSSE student body to develop an AI-Generated Keynote Speaker. Dr. Dozier found us — <em>a PhD student, a Master&apos;s student in Data Engineering, and a sophomore BS student.</em> Three perspectives. One shared mission.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-label">The Build</div>
              <p>Under the auspices and guidance of <strong>Dr. Jennifer Kerpelman</strong>, <strong>Dr. Gerry Dozier</strong> (McCrary Professor of AI and Cybersecurity in CSSE), and <strong>Christine Cline</strong> (Director of PSFS), we developed the AUBRIA Keynote Talk that you now see on this website.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-label">What&apos;s Next</div>
              <p>The AUBRIA Team is passionate about developing AI-Generated Keynote Talks for Conferences, Workshops, Meetings, and more. We are currently working on enabling AUBRIA to interact with the audience by taking and answering questions. If you are interested in our team developing an AI-Generated Keynote talk for you or your organization — <strong>contact us!</strong></p>
            </div>
          </div>

          <div className="reveal">
            <div className="story-card">
              <div className="story-card-label">// Key Figures</div>
              <div className="story-person">
                <div className="person-name">Christine Cline</div>
                <div className="person-role">PSFS Director · Auburn University</div>
                <div className="person-note">Originator of the AUBRIA concept</div>
              </div>
              <div className="story-person">
                <div className="person-name">Dr. Jennifer Kerpelman</div>
                <div className="person-role">Associate Vice President for Research · Office of the Senior Vice President for Research and Economic Development</div>
                <div className="person-note">Project champion &amp; faculty guidance</div>
              </div>
              <div className="story-person">
                <div className="person-name">Dr. Gerry Dozier</div>
                <div className="person-role">Faculty Advisor</div>
                <div className="person-note">Team lead &amp; technical advisor</div>
              </div>
              <div className="story-person">
                <div className="person-name">Dr. Hari Naryanan</div>
                <div className="person-role">CSSE Department Chair</div>
                <div className="person-note">Departmental oversight &amp; support</div>
              </div>
            </div>

            <div className="story-card">
              <div className="story-card-label">// The Student Team</div>
              <div className="team-chips">
                <div className="team-chip">
                  <span className="team-chip-icon">⬡</span>
                  <div>
                    <div className="team-chip-title">Jahidul Arafat</div>
                    <div className="team-chip-sub">PhD Student · Computer Science</div>
                  </div>
                </div>
                <div className="team-chip">
                  <span className="team-chip-icon">⬡</span>
                  <div>
                    <div className="team-chip-title">Bhuvaneshwari Bodakuntla</div>
                    <div className="team-chip-sub">Master&apos;s Student · Data Engineering</div>
                  </div>
                </div>
                <div className="team-chip">
                  <span className="team-chip-icon">⬡</span>
                  <div>
                    <div className="team-chip-title">Sawyer Womack</div>
                    <div className="team-chip-sub">Sophomore BS Student · Software Engineering</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPOSITE */}
      <div className="composite-section" id="composite">
        <div className="composite-inner">
          <div className="video-header reveal">
            <span className="section-num">03 / COMPOSITE</span>
            <h2 className="section-title"><span>AUBRIA</span> &amp; the people behind her</h2>
          </div>
          <p className="composite-tagline reveal">AUBRIA is a composite — an AI avatar shaped by the expertise, vision, and collaboration of the Auburn University community. This image brings her together with the faculty, staff, and administrators who made her possible.</p>

          <div className="composite-frame reveal">
            <img src="/aubria_composite.png" alt="AUBRIA composite — AI avatar surrounded by the Auburn University team members who built her" />
          </div>

          <div className="composite-caption reveal">
            <div className="composite-caption-item">
              <span className="composite-dot"></span>
              AUBRIA — AI Keynote Avatar
            </div>
            <div className="composite-caption-item">
              <span className="composite-dot" style={{ background: 'var(--blue-bright)' }}></span>
              Auburn University Faculty &amp; Staff
            </div>
            <div className="composite-caption-item">
              <span className="composite-dot" style={{ background: 'var(--gray-400)' }}></span>
              AI@AU · AU-CAICE · PSFS
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="video-section" id="keynote-demo">
        <div className="video-inner">
          <div className="video-header reveal">
            <span className="section-num">04 / DEMO</span>
            <h2 className="section-title">See <span>AUBRIA</span> in action</h2>
          </div>
          <p className="video-tagline reveal">Watch a live keynote talk — engineered by Auburn students, delivered by AI.</p>

          <div className="video-frame-wrap reveal">
            <iframe
              src="https://www.youtube.com/embed/Eqb21_NHj7o?rel=0&modestbranding=1&color=white"
              title="AUBRIA AI Keynote Speaker Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-meta reveal">
            <div className="video-meta-item">
              <span className="video-meta-dot"></span>
              Auburn University · CSSE
            </div>
            <div className="video-meta-item">
              <span className="video-meta-dot" style={{ background: 'var(--blue-bright)' }}></span>
              AI@AU Showcase &amp; Workshop · 2026
            </div>
            <div className="video-meta-item">
              <span className="video-meta-dot" style={{ background: 'var(--gray-400)' }}></span>
              AI-Generated Keynote Talk
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-band" id="contact">
        <div className="cta-inner">
          <span className="section-num">05 / DEPLOY</span>
          <h2>Deploy <span>AUBRIA</span> at your next event.</h2>
          <p>AI-generated keynotes engineered for conferences, workshops, meetings, and beyond.</p>
          <div className="btn-group">
            <Link href="/request" className="btn-cta-primary">Contact Our Team →</Link>
            <a href="https://eng.auburn.edu/ai-au/" target="_blank" rel="noopener noreferrer" className="btn-cta-outline">Learn About AI@AU</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">[<span>AUBRIA</span>]</div>
        <div className="footer-info">
          Faculty Advisor: Dr. Gerry Dozier · Department of CSSE<br />
          Samuel Ginn College of Engineering · Auburn University
        </div>
      </footer>
    </>
  );
}
