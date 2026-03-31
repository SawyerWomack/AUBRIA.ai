'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const STEPS = [
  'Requestor Information',
  'Keynote Content',
  'Presentation',
  'Script',
  'Audio & Deliverables',
];

interface FormData {
  name: string;
  email: string;
  department: string;
  purpose: string;
  eventCoordinator: string;
  eventWebsite: string;
  eventTitle: string;
  eventDate: string;
  audienceType: string;
  keynoteTopic: string;
  primaryMessage: string;
  keynoteObjectives: string[];
  keyPoints: string;
  topicsToAvoid: string;
  presentationStyle: string;
  visualElements: string[];
  otherRequirements: string;
  backgroundStyleKeys: string[];
  requestedVideoLength: string;
  customMinutes: string;
  interactiveVersion: string;
  aspectRatio: string;
  desiredTone: string;
  logoKeys: string[];
  brandingGuidelines: string;
  scriptPreference: string;
  scriptContent: string;
  scriptApprover: string;
  revisionRounds: string;
  backgroundMusic: string;
  musicStyle: string;
  deliverables: string[];
  problemToSolve: string;
  additionalInstructions: string;
  permission: string;
  fundsContactName: string;
  fundsContactEmail: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  department: '',
  purpose: '',
  eventCoordinator: '',
  eventWebsite: '',
  eventTitle: '',
  eventDate: '',
  audienceType: '',
  keynoteTopic: '',
  primaryMessage: '',
  keynoteObjectives: [],
  keyPoints: '',
  topicsToAvoid: '',
  presentationStyle: '',
  visualElements: [],
  otherRequirements: '',
  backgroundStyleKeys: [],
  requestedVideoLength: '',
  customMinutes: '',
  interactiveVersion: '',
  aspectRatio: '',
  desiredTone: '',
  logoKeys: [],
  brandingGuidelines: '',
  scriptPreference: '',
  scriptContent: '',
  scriptApprover: '',
  revisionRounds: '',
  backgroundMusic: '',
  musicStyle: '',
  deliverables: [],
  problemToSolve: '',
  additionalInstructions: '',
  permission: '',
  fundsContactName: '',
  fundsContactEmail: '',
};

function calculatePrice(customMinutes: string, revisionRounds: string) {
  const minutes = parseInt(customMinutes) || 0;
  const baseCost = minutes * 250;
  const revisions = parseInt(revisionRounds.charAt(0)) || 1;
  const revisionCost = Math.max(0, revisions - 1) * 250;
  return { minutes, baseCost, revisions, revisionCost, total: baseCost + revisionCost };
}

export default function RequestPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const requiredByStep: Record<number, { field: keyof FormData; label: string }[]> = {
    0: [
      { field: 'name', label: 'Name' },
      { field: 'email', label: 'Email ID' },
      { field: 'department', label: 'Department / Organization' },
      { field: 'purpose', label: 'Purpose of the keynote request' },
      { field: 'eventCoordinator', label: 'Event Coordinator' },
    ],
    1: [
      { field: 'keynoteTopic', label: 'Keynote Topic / Theme' },
      { field: 'primaryMessage', label: 'Primary Message of the Keynote' },
      { field: 'keynoteObjectives', label: 'Keynote Objectives' },
    ],
    2: [
      { field: 'presentationStyle', label: 'Preferred Presentation Style' },
      { field: 'visualElements', label: 'Visual Elements Needed' },
      { field: 'aspectRatio', label: 'Aspect Ratio Needed' },
    ],
    3: [],
    4: [
      { field: 'customMinutes', label: 'Requested Video Length (minutes)' },
      { field: 'revisionRounds', label: 'Number of Revision Rounds' },
      { field: 'permission', label: 'Permission to display on website' },
      { field: 'fundsContactName', label: 'Name of contact for funds transfer' },
      { field: 'fundsContactEmail', label: 'Email of contact' },
    ],
  };

  const validateStep = (currentStep: number): boolean => {
    const required = requiredByStep[currentStep] || [];
    const missing: string[] = [];
    for (const { field, label } of required) {
      const val = form[field];
      if (Array.isArray(val)) {
        if (val.length === 0) missing.push(label);
      } else if (!val || val.trim() === '') {
        missing.push(label);
      }
    }
    setFieldErrors(missing);
    return missing.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => prev.filter(e => e !== field));
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const arr = form[field] as string[];
    if (arr.includes(value)) {
      updateField(field, arr.filter(v => v !== value));
    } else {
      updateField(field, [...arr, value]);
    }
  };

  const handleFileUpload = async (files: FileList | null, field: 'backgroundStyleKeys' | 'logoKeys', setUploading: (v: boolean) => void) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const keys: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const { key } = await res.json();
        keys.push(key);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
    updateField(field, [...(form[field] as string[]), ...keys]);
    setUploading(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const price = calculatePrice(form.customMinutes, form.revisionRounds);
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, requestedVideoLength: `${form.customMinutes} minutes`, estimatedPrice: price.total }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setSubmitError(data.details || data.error || 'Submission failed');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error');
    }
    setSubmitting(false);
  };

  const price = calculatePrice(form.customMinutes, form.revisionRounds);

  const handleDownloadPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const summaryFields = [
      ['Name', form.name],
      ['Email', form.email],
      ['Department / Organization', form.department],
      ['Purpose', form.purpose],
      ['Event Coordinator', form.eventCoordinator],
      ['Event Website', form.eventWebsite],
      ['Event Title', form.eventTitle],
      ['Event Date', form.eventDate],
      ['Audience Type', form.audienceType],
      ['Keynote Topic / Theme', form.keynoteTopic],
      ['Primary Message', form.primaryMessage],
      ['Keynote Objectives', form.keynoteObjectives.join(', ')],
      ['Key Points', form.keyPoints],
      ['Topics to Avoid', form.topicsToAvoid],
      ['Presentation Style', form.presentationStyle],
      ['Visual Elements', form.visualElements.join(', ')],
      ['Other Requirements', form.otherRequirements],
      ['Interactive Version', form.interactiveVersion],
      ['Aspect Ratio', form.aspectRatio],
      ['Desired Tone', form.desiredTone],
      ['Branding Guidelines', form.brandingGuidelines],
      ['Script Preference', form.scriptPreference],
      ['Script Content', form.scriptContent],
      ['Script Approver', form.scriptApprover],
      ['Video Length', `${form.customMinutes} minutes`],
      ['Revision Rounds', form.revisionRounds],
      ['Background Music', form.backgroundMusic],
      ['Music Style', form.musicStyle],
      ['Deliverables', form.deliverables.join(', ')],
      ['Problem to Solve', form.problemToSolve],
      ['Additional Instructions', form.additionalInstructions],
      ['Permission to Display', form.permission],
      ['Estimated Price', `$${price.total.toLocaleString()}`],
    ];

    const html = `
      <div style="font-family: 'Space Grotesk', Arial, sans-serif; padding: 40px; color: #0a1628;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-family: monospace; font-size: 18px; font-weight: 500; letter-spacing: 0.05em;">[<span style="color: #0f2d6e;">AUBRIA</span>]</span>
          <span style="font-family: monospace; font-size: 9px; background: #e85a0a; color: white; padding: 2px 8px; border-radius: 2px; letter-spacing: 0.08em;">v1.0</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #0a1628;">Keynote Speaker Request</h1>
        <p style="font-family: monospace; font-size: 11px; color: #8a9ec4; margin-bottom: 24px;">Submitted on ${new Date().toLocaleDateString()}</p>
        <hr style="border: none; border-top: 1px solid #d8e2f4; margin-bottom: 24px;" />
        ${summaryFields.map(([label, value]) => `
          <div style="display: flex; border-bottom: 1px solid #eef2fa; padding: 10px 0;">
            <div style="width: 200px; flex-shrink: 0; font-family: monospace; font-size: 10px; color: #8a9ec4; text-transform: uppercase; letter-spacing: 0.06em; padding-top: 2px;">${label}</div>
            <div style="font-size: 13px; color: #4a5e82; line-height: 1.6; word-break: break-word;">${value || '—'}</div>
          </div>
        `).join('')}
        <div style="margin-top: 24px; padding: 16px; background: #f8faff; border: 1px solid #d8e2f4; border-radius: 6px; border-left: 3px solid #e85a0a;">
          <div style="font-family: monospace; font-size: 10px; color: #e85a0a; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">// Estimated Price</div>
          <div style="font-size: 28px; font-weight: 700; color: #0a1628;">$${price.total.toLocaleString()}</div>
        </div>
        <p style="font-family: monospace; font-size: 9px; color: #8a9ec4; margin-top: 24px; text-align: center;">Samuel Ginn College of Engineering · Auburn University · Department of CSSE</p>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    html2pdf().set({
      margin: 0.5,
      filename: `AUBRIA-Request-${form.name.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).from(container).save().then(() => {
      document.body.removeChild(container);
    });
  };

  if (submitted) {
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
          </ul>
        </nav>
        <div className="page-header">
          <div className="page-header-inner">
            <div className="page-header-label">Request Submitted</div>
            <h1>Thank <span>You!</span></h1>
            <p className="page-header-sub">Your AUBRIA keynote request has been submitted successfully. Our team will review your request and get back to you.</p>
          </div>
        </div>
        <div className="cta-band">
          <div className="cta-inner">
            <h2>What happens <span>next?</span></h2>
            <p>Our production team will review your request and contact you within 2-3 business days.</p>
            <div className="btn-group">
              <button onClick={handleDownloadPdf} className="btn-cta-primary" style={{ border: 'none', cursor: 'pointer' }}>Download as PDF ↓</button>
              <Link href="/" className="btn-cta-outline">Back to Home</Link>
            </div>
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
        <ul className="nav-ul">
          <li><Link href="/" className="nav-link">Home</Link></li>
          <li><Link href="/our-team" className="nav-link">Our Team</Link></li>
        </ul>
      </nav>

      <div className="page-header">
        <div className="page-header-inner">
          <div className="page-header-label">Keynote Speaker Request</div>
          <h1>Request an <span>AUBRIA</span> Keynote</h1>
          <p className="page-header-sub">Complete this form to help our production team customize the keynote content, visuals, and delivery for your event.</p>
        </div>
      </div>

      <div className="form-section">
        {/* Step indicator */}
        <div className="form-step-indicator">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`form-step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {fieldErrors.length > 0 && (
          <div style={{
            background: 'var(--orange-pale)',
            border: '1px solid rgba(232,90,10,0.3)',
            borderRadius: '6px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.65rem',
              color: 'var(--orange)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}>Please fill in the following required fields:</div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}>
              {fieldErrors.map(err => (
                <li key={err} style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-dark)',
                  paddingLeft: '0.75rem',
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--orange)' }}>*</span>
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION 1 */}
        {step === 0 && (
          <div>
            <div className="form-step-title">Section 1 of 5</div>
            <div className="form-step-heading">Requestor Information</div>

            <div className="form-group">
              <label className="form-label"><span className="form-label-num">1.</span>Name<span className="form-required">*</span></label>
              <input className="form-input" type="text" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">2.</span>Email ID<span className="form-required">*</span></label>
              <input className="form-input" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">3.</span>Department / Organization<span className="form-required">*</span></label>
              <input className="form-input" type="text" value={form.department} onChange={e => updateField('department', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">4.</span>Please describe the purpose of the keynote request.<span className="form-required">*</span></label>
              <textarea className="form-textarea" value={form.purpose} onChange={e => updateField('purpose', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">5.</span>Event Coordinator<span className="form-required">*</span></label>
              <input className="form-input" type="text" value={form.eventCoordinator} onChange={e => updateField('eventCoordinator', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">6.</span>Event Website</label>
              <input className="form-input" type="url" value={form.eventWebsite} onChange={e => updateField('eventWebsite', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">7.</span>Event Title</label>
              <input className="form-input" type="text" value={form.eventTitle} onChange={e => updateField('eventTitle', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">8.</span>Event Date</label>
              <input className="form-input" type="date" value={form.eventDate} onChange={e => updateField('eventDate', e.target.value)} />
            </div>
          </div>
        )}

        {/* SECTION 2 */}
        {step === 1 && (
          <div>
            <div className="form-step-title">Section 2 of 5</div>
            <div className="form-step-heading">Keynote Content</div>

            <div className="form-group">
              <label className="form-label"><span className="form-label-num">9.</span>Audience Type</label>
              <div className="form-radio-group">
                {['Students', 'Researchers', 'Faculty', 'Government', 'Industry Professional', 'Mixed Audience'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="audienceType" value={opt} checked={form.audienceType === opt} onChange={e => updateField('audienceType', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">10.</span>Keynote Topic / Theme<span className="form-required">*</span></label>
              <input className="form-input" type="text" value={form.keynoteTopic} onChange={e => updateField('keynoteTopic', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">11.</span>Primary Message of the Keynote<span className="form-required">*</span></label>
              <div className="form-hint">What should attendees remember after watching AUBRIA? (Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.primaryMessage} onChange={e => updateField('primaryMessage', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">12.</span>Keynote Objectives<span className="form-required">*</span></label>
              <div className="form-checkbox-group">
                {['Inspire audience', 'Showcase Research', 'Promote Collaboration', 'Introduce initiative/Program', 'Educate audience', 'Strategic vision announcement'].map(opt => (
                  <label key={opt} className="form-checkbox-label">
                    <input type="checkbox" checked={form.keynoteObjectives.includes(opt)} onChange={() => toggleArrayField('keynoteObjectives', opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">13.</span>Key Points or Programs to Highlight</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.keyPoints} onChange={e => updateField('keyPoints', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">14.</span>Topics to Avoid</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.topicsToAvoid} onChange={e => updateField('topicsToAvoid', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
          </div>
        )}

        {/* SECTION 3 */}
        {step === 2 && (
          <div>
            <div className="form-step-title">Section 3 of 5</div>
            <div className="form-step-heading">Presentation</div>

            <div className="form-group">
              <label className="form-label"><span className="form-label-num">15.</span>Preferred Presentation Style<span className="form-required">*</span></label>
              <div className="form-radio-group">
                {['AUBRIA speaking', 'AUBRIA with supporting visuals and images'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="presentationStyle" value={opt} checked={form.presentationStyle === opt} onChange={e => updateField('presentationStyle', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">16.</span>Visual Elements Needed<span className="form-required">*</span></label>
              <div className="form-checkbox-group">
                {['Research images', 'Event Photos', 'Charts/Graphs', 'Text Highlights', 'Other'].map(opt => (
                  <label key={opt} className="form-checkbox-label">
                    <input type="checkbox" checked={form.visualElements.includes(opt)} onChange={() => toggleArrayField('visualElements', opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">17.</span>Any other requirements</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.otherRequirements} onChange={e => updateField('otherRequirements', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">18.</span>Background style</label>
              <div className="form-hint">Upload file (max 10 files, 10MB each) — Word, Excel, PPT, PDF, Image, Video, Audio</div>
              <input
                ref={bgInputRef}
                type="file"
                className="form-file-input"
                multiple
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.gif,.mp4,.mov,.mp3,.wav"
                onChange={e => handleFileUpload(e.target.files, 'backgroundStyleKeys', setUploadingBg)}
              />
              {uploadingBg && <div className="form-hint">Uploading...</div>}
              {form.backgroundStyleKeys.length > 0 && <div className="form-hint">{form.backgroundStyleKeys.length} file(s) uploaded</div>}
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">19.</span>Would you like to have an interactive version of AUBRIA?</label>
              <div className="form-radio-group">
                {['Yes', 'No'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="interactiveVersion" value={opt} checked={form.interactiveVersion === opt} onChange={e => updateField('interactiveVersion', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">20.</span>Aspect Ratio Needed<span className="form-required">*</span></label>
              <div className="form-radio-group">
                {['16:9', '9:16', 'Both'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="aspectRatio" value={opt} checked={form.aspectRatio === opt} onChange={e => updateField('aspectRatio', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">21.</span>Desired Tone</label>
              <div className="form-radio-group">
                {['Inspirational', 'Academic', 'Visionary', 'Conversational', 'Other'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="desiredTone" value={opt} checked={form.desiredTone === opt} onChange={e => updateField('desiredTone', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">22.</span>Upload Logos / Branding Materials</label>
              <div className="form-hint">Upload file (max 3 files, 10MB each) — Word, Excel, PPT, PDF, Image, Video, Audio</div>
              <input
                ref={logoInputRef}
                type="file"
                className="form-file-input"
                multiple
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.gif,.mp4,.mov,.mp3,.wav"
                onChange={e => handleFileUpload(e.target.files, 'logoKeys', setUploadingLogo)}
              />
              {uploadingLogo && <div className="form-hint">Uploading...</div>}
              {form.logoKeys.length > 0 && <div className="form-hint">{form.logoKeys.length} file(s) uploaded</div>}
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">23.</span>Required Branding Guidelines</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.brandingGuidelines} onChange={e => updateField('brandingGuidelines', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
          </div>
        )}

        {/* SECTION 4 */}
        {step === 3 && (
          <div>
            <div className="form-step-title">Section 4 of 5</div>
            <div className="form-step-heading">Script</div>

            <div className="form-group">
              <label className="form-label"><span className="form-label-num">24.</span>Script Development Preference</label>
              <div className="form-radio-group">
                {['AUBRIA team drafts script', 'I will provide script'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="scriptPreference" value={opt} checked={form.scriptPreference === opt} onChange={e => updateField('scriptPreference', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">25.</span>Please provide the script</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.scriptContent} onChange={e => updateField('scriptContent', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">26.</span>Script Approver Name</label>
              <input className="form-input" type="text" value={form.scriptApprover} onChange={e => updateField('scriptApprover', e.target.value)} placeholder="Enter your answer" />
            </div>
          </div>
        )}

        {/* SECTION 5 */}
        {step === 4 && (
          <div>
            <div className="form-step-title">Section 5 of 5</div>
            <div className="form-step-heading">Audio, Deliverables &amp; Pricing</div>

            {/* Video Length & Revisions + Price at TOP */}
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">27.</span>Requested Video Length (minutes)<span className="form-required">*</span></label>
              <input className="form-input" type="number" min="1" value={form.customMinutes} onChange={e => updateField('customMinutes', e.target.value)} placeholder="Enter number of minutes" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">28.</span>Number of Revision Rounds Expected<span className="form-required">*</span></label>
              <div className="form-radio-group">
                {['1 revision', '2 revision', '3 revision'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="revisionRounds" value={opt} checked={form.revisionRounds === opt} onChange={e => updateField('revisionRounds', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Card */}
            {form.customMinutes && form.revisionRounds && (
              <div className="price-card">
                <div className="price-label">// Estimated Price</div>
                <div className="price-amount">${price.total.toLocaleString()}</div>
                <div className="price-breakdown">
                  <div className="price-line">
                    <span className="price-line-label">Video ({price.minutes} min x $250/min)</span>
                    <span className="price-line-value">${price.baseCost.toLocaleString()}</span>
                  </div>
                  <div className="price-line">
                    <span className="price-line-label">Revisions ({price.revisions} round{price.revisions > 1 ? 's' : ''}{price.revisions === 1 ? ' — included' : ''})</span>
                    <span className="price-line-value">{price.revisionCost === 0 ? 'Free' : `$${price.revisionCost.toLocaleString()}`}</span>
                  </div>
                  <div className="price-total-line">
                    <span>Total</span>
                    <span>${price.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label"><span className="form-label-num">29.</span>Background Music</label>
              <div className="form-radio-group">
                {['Yes', 'No'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="backgroundMusic" value={opt} checked={form.backgroundMusic === opt} onChange={e => updateField('backgroundMusic', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">30.</span>Music Style</label>
              <div className="form-radio-group">
                {['Inspirational', 'Corporate', 'Futuristic', 'Minimal', 'No preference'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="musicStyle" value={opt} checked={form.musicStyle === opt} onChange={e => updateField('musicStyle', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">31.</span>Deliverables Needed</label>
              <div className="form-checkbox-group">
                {['Final Keynote Video', 'Caption file', 'Thumbnail Image', 'Still Image from video'].map(opt => (
                  <label key={opt} className="form-checkbox-label">
                    <input type="checkbox" checked={form.deliverables.includes(opt)} onChange={() => toggleArrayField('deliverables', opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">32.</span>What problem should the keynote solve for your event?</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.problemToSolve} onChange={e => updateField('problemToSolve', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">33.</span>Additional Instructions or Special Requests</label>
              <div className="form-hint">(Limit: 4000 characters)</div>
              <textarea className="form-textarea" value={form.additionalInstructions} onChange={e => updateField('additionalInstructions', e.target.value.slice(0, 4000))} placeholder="Enter your answer" maxLength={4000} />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">34.</span>Do you grant permission for the generated AUBRIA keynote video to be displayed on our website or used as an example of our work?<span className="form-required">*</span></label>
              <div className="form-radio-group">
                {['Yes', 'No'].map(opt => (
                  <label key={opt} className="form-radio-label">
                    <input type="radio" name="permission" value={opt} checked={form.permission === opt} onChange={e => updateField('permission', e.target.value)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">35.</span>Name of contact for arranging transfer of funds to AI@AU Laboratory<span className="form-required">*</span></label>
              <input className="form-input" type="text" value={form.fundsContactName} onChange={e => updateField('fundsContactName', e.target.value)} placeholder="Enter your answer" />
            </div>
            <div className="form-group">
              <label className="form-label"><span className="form-label-num">36.</span>Email of contact<span className="form-required">*</span></label>
              <input className="form-input" type="email" value={form.fundsContactEmail} onChange={e => updateField('fundsContactEmail', e.target.value)} placeholder="Enter your answer" />
            </div>

          </div>
        )}

        {/* Navigation */}
        <div className="form-nav">
          {step > 0 ? (
            <button className="form-btn form-btn-back" onClick={() => { setFieldErrors([]); setStep(step - 1); window.scrollTo(0, 0); }}>
              ← Back
            </button>
          ) : <div />}
          {step < 4 ? (
            <button className="form-btn form-btn-next" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <div>
              {submitError && <p style={{ color: 'var(--orange)', fontSize: '0.85rem', marginBottom: '0.5rem', textAlign: 'right' }}>{submitError}</p>}
              <button className="form-btn form-btn-next" onClick={() => { if (validateStep(step)) handleSubmit(); }} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request →'}
              </button>
            </div>
          )}
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
