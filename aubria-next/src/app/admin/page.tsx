'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RequestItem {
  requestId: string;
  name: string;
  email: string;
  department: string;
  eventTitle: string;
  eventDate: string;
  requestedVideoLength: string;
  revisionRounds: string;
  estimatedPrice: number;
  status: string;
  submittedAt: string;
  [key: string]: unknown;
}

const STATUS_OPTIONS = ['Submitted', 'In Review', 'Approved', 'Delivered'];

function statusClass(status: string) {
  switch (status) {
    case 'Submitted': return 'status-submitted';
    case 'In Review': return 'status-in-review';
    case 'Approved': return 'status-approved';
    case 'Delivered': return 'status-delivered';
    default: return 'status-submitted';
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [storedPassword, setStoredPassword] = useState('');

  const handleLogin = async () => {
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        setStoredPassword(password);
        fetchRequests(password);
      } else {
        setAuthError('Invalid password');
      }
    } catch {
      setAuthError('Login failed');
    }
  };

  const fetchRequests = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        headers: { 'x-admin-password': pwd },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests.sort((a: RequestItem, b: RequestItem) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
    setLoading(false);
  };

  const updateStatus = async (requestId: string, newStatus: string) => {
    try {
      await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': storedPassword,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setRequests(prev => prev.map(r =>
        r.requestId === requestId ? { ...r, status: newStatus } : r
      ));
      if (selectedRequest?.requestId === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const fetchDetail = async (requestId: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        headers: { 'x-admin-password': storedPassword },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedRequest(data.request);
      }
    } catch (err) {
      console.error('Failed to fetch detail:', err);
    }
  };

  const downloadFile = async (key: string) => {
    try {
      const res = await fetch(`/api/download?key=${encodeURIComponent(key)}`, {
        headers: { 'x-admin-password': storedPassword },
      });
      if (res.ok) {
        const { url } = await res.json();
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleAdminPdf = async (r: RequestItem) => {
    const html2pdf = (await import('html2pdf.js')).default;
    const fields = [
      ['Request ID', r.requestId],
      ['Status', r.status],
      ['Submitted', new Date(r.submittedAt).toLocaleString()],
      ['Name', r.name],
      ['Email', r.email],
      ['Department', r.department],
      ['Purpose', r.purpose as string],
      ['Event Coordinator', r.eventCoordinator as string],
      ['Event Website', r.eventWebsite as string],
      ['Event Title', r.eventTitle],
      ['Event Date', r.eventDate],
      ['Audience Type', r.audienceType as string],
      ['Keynote Topic', r.keynoteTopic as string],
      ['Primary Message', r.primaryMessage as string],
      ['Keynote Objectives', Array.isArray(r.keynoteObjectives) ? (r.keynoteObjectives as string[]).join(', ') : r.keynoteObjectives as string],
      ['Video Length', r.requestedVideoLength],
      ['Revision Rounds', r.revisionRounds],
      ['Estimated Price', r.estimatedPrice ? `$${Number(r.estimatedPrice).toLocaleString()}` : 'N/A'],
      ['Presentation Style', r.presentationStyle as string],
      ['Script Preference', r.scriptPreference as string],
      ['Background Music', r.backgroundMusic as string],
      ['Music Style', r.musicStyle as string],
      ['Deliverables', Array.isArray(r.deliverables) ? (r.deliverables as string[]).join(', ') : r.deliverables as string],
      ['Additional Instructions', r.additionalInstructions as string],
    ];

    const html = `
      <div style="font-family: 'Space Grotesk', Arial, sans-serif; padding: 40px; color: #0a1628;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-family: monospace; font-size: 18px; font-weight: 500;">[<span style="color: #0f2d6e;">AUBRIA</span>]</span>
          <span style="font-family: monospace; font-size: 9px; background: #e85a0a; color: white; padding: 2px 8px; border-radius: 2px;">v1.0</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">Keynote Request — ${r.eventTitle || r.name}</h1>
        <p style="font-family: monospace; font-size: 11px; color: #8a9ec4; margin-bottom: 24px;">Submitted on ${new Date(r.submittedAt).toLocaleDateString()}</p>
        <hr style="border: none; border-top: 1px solid #d8e2f4; margin-bottom: 24px;" />
        ${fields.map(([label, value]) => `
          <div style="display: flex; border-bottom: 1px solid #eef2fa; padding: 10px 0;">
            <div style="width: 200px; flex-shrink: 0; font-family: monospace; font-size: 10px; color: #8a9ec4; text-transform: uppercase; letter-spacing: 0.06em; padding-top: 2px;">${label}</div>
            <div style="font-size: 13px; color: #4a5e82; line-height: 1.6; word-break: break-word;">${value || '—'}</div>
          </div>
        `).join('')}
        <div style="margin-top: 24px; padding: 16px; background: #f8faff; border: 1px solid #d8e2f4; border-radius: 6px; border-left: 3px solid #e85a0a;">
          <div style="font-family: monospace; font-size: 10px; color: #e85a0a; text-transform: uppercase; margin-bottom: 4px;">// Estimated Price</div>
          <div style="font-size: 28px; font-weight: 700;">${r.estimatedPrice ? `$${Number(r.estimatedPrice).toLocaleString()}` : 'N/A'}</div>
        </div>
        <p style="font-family: monospace; font-size: 9px; color: #8a9ec4; margin-top: 24px; text-align: center;">Samuel Ginn College of Engineering · Auburn University · Department of CSSE</p>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    html2pdf().set({
      margin: 0.5,
      filename: `AUBRIA-Request-${r.name || r.requestId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).from(container).save().then(() => {
      document.body.removeChild(container);
    });
  };

  if (!authenticated) {
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
          </ul>
        </nav>
        <div className="page-header">
          <div className="page-header-inner">
            <div className="page-header-label">Admin Access</div>
            <h1>Request <span>Dashboard</span></h1>
            <p className="page-header-sub">Enter your admin password to view and manage keynote requests.</p>
          </div>
        </div>
        <div className="admin-login">
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter password"
            />
          </div>
          {authError && <p style={{ color: 'var(--orange)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{authError}</p>}
          <button
            className="form-btn form-btn-next"
            onClick={handleLogin}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Login →
          </button>
        </div>
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

  if (selectedRequest) {
    const r = selectedRequest;
    const fields = [
      ['Request ID', r.requestId],
      ['Status', r.status],
      ['Submitted', new Date(r.submittedAt).toLocaleString()],
      ['Name', r.name],
      ['Email', r.email],
      ['Department', r.department],
      ['Purpose', r.purpose],
      ['Event Coordinator', r.eventCoordinator],
      ['Event Website', r.eventWebsite],
      ['Event Title', r.eventTitle],
      ['Event Date', r.eventDate],
      ['Audience Type', r.audienceType],
      ['Keynote Topic', r.keynoteTopic],
      ['Primary Message', r.primaryMessage],
      ['Keynote Objectives', Array.isArray(r.keynoteObjectives) ? (r.keynoteObjectives as string[]).join(', ') : r.keynoteObjectives],
      ['Key Points', r.keyPoints],
      ['Topics to Avoid', r.topicsToAvoid],
      ['Presentation Style', r.presentationStyle],
      ['Visual Elements', Array.isArray(r.visualElements) ? (r.visualElements as string[]).join(', ') : r.visualElements],
      ['Other Requirements', r.otherRequirements],
      ['Video Length', r.requestedVideoLength],
      ['Interactive Version', r.interactiveVersion],
      ['Aspect Ratio', r.aspectRatio],
      ['Desired Tone', r.desiredTone],
      ['Branding Guidelines', r.brandingGuidelines],
      ['Script Preference', r.scriptPreference],
      ['Script Content', r.scriptContent],
      ['Script Approver', r.scriptApprover],
      ['Revision Rounds', r.revisionRounds],
      ['Background Music', r.backgroundMusic],
      ['Music Style', r.musicStyle],
      ['Deliverables', Array.isArray(r.deliverables) ? (r.deliverables as string[]).join(', ') : r.deliverables],
      ['Problem to Solve', r.problemToSolve],
      ['Additional Instructions', r.additionalInstructions],
      ['Estimated Price', r.estimatedPrice ? `$${Number(r.estimatedPrice).toLocaleString()}` : 'N/A'],
    ];

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
            <li><button className="nav-link" onClick={() => { setSelectedRequest(null); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>← Back to List</button></li>
          </ul>
        </nav>

        <div className="page-header">
          <div className="page-header-inner">
            <div className="page-header-label">Request Detail</div>
            <h1>{r.eventTitle || <span>Request</span>}</h1>
            <p className="page-header-sub">Submitted by {r.name} on {new Date(r.submittedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="admin-container">
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--gray-400)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Update Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={r.status}
              onChange={e => updateStatus(r.requestId, e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fields.map(([label, value]) => (
              <div key={label as string} style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '1rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--gray-200)',
              }}>
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.7rem',
                  color: 'var(--gray-400)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  paddingTop: '0.15rem',
                }}>{label as string}</div>
                <div style={{
                  fontSize: '0.88rem',
                  color: 'var(--gray-600)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>{(value as string) || '—'}</div>
              </div>
            ))}
          </div>

          {/* Uploaded Files */}
          {(Array.isArray(r.backgroundStyleKeys) && r.backgroundStyleKeys.length > 0 && (r.backgroundStyleKeys as string[])[0] !== '-') && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.75rem' }}>// Background Style Files</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(r.backgroundStyleKeys as string[]).map((key: string, i: number) => (
                  <button
                    key={key}
                    onClick={() => downloadFile(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '4px',
                      padding: '0.5rem 0.75rem', cursor: 'pointer', fontFamily: 'var(--mono)',
                      fontSize: '0.72rem', color: 'var(--blue-bright)', transition: 'all 0.2s',
                      textAlign: 'left' as const,
                    }}
                  >
                    ↓ File {i + 1}: {key.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(Array.isArray(r.logoKeys) && r.logoKeys.length > 0 && (r.logoKeys as string[])[0] !== '-') && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.75rem' }}>// Logo / Branding Files</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(r.logoKeys as string[]).map((key: string, i: number) => (
                  <button
                    key={key}
                    onClick={() => downloadFile(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '4px',
                      padding: '0.5rem 0.75rem', cursor: 'pointer', fontFamily: 'var(--mono)',
                      fontSize: '0.72rem', color: 'var(--blue-bright)', transition: 'all 0.2s',
                      textAlign: 'left' as const,
                    }}
                  >
                    ↓ File {i + 1}: {key.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Download PDF */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
            <button
              onClick={() => handleAdminPdf(r)}
              className="form-btn form-btn-next"
            >
              Download as PDF ↓
            </button>
          </div>
        </div>

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
        </ul>
      </nav>

      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-header-label">Admin Dashboard</div>
          <h1>Keynote <span>Requests</span></h1>
          <p className="page-header-sub">View and manage all AUBRIA keynote speaker requests.</p>
        </div>
      </div>

      <div className="admin-container">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem 0' }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '3rem 0' }}>No requests found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Video Length</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.requestId}>
                    <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{r.name}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--gray-400)' }}>{r.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{r.eventTitle}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--gray-400)' }}>{r.department}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>{r.requestedVideoLength}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>
                      {r.estimatedPrice ? `$${Number(r.estimatedPrice).toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => fetchDetail(r.requestId)}
                        style={{
                          background: 'none',
                          border: '1px solid var(--gray-200)',
                          borderRadius: '4px',
                          padding: '0.35rem 0.75rem',
                          fontFamily: 'var(--mono)',
                          fontSize: '0.65rem',
                          color: 'var(--blue-bright)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          letterSpacing: '0.04em',
                        }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
