'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';

// Web3Forms delivers straight to the mailbox registered against this key.
// The access key is public by design (Web3Forms documents that it may be
// shared in client-side code), so the form posts from the browser and the
// site stays a pure static export — no server route, no secrets to manage.
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function Enquiry() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot: silently accept bot submissions without sending anything.
    if ((formData.get('company') as string)?.trim()) {
      setSent(true);
      form.reset();
      return;
    }

    if (!ACCESS_KEY) {
      setError('Email delivery is not configured yet. Please try again later.');
      return;
    }

    setSending(true);
    setSent(false);
    setError('');

    const name = ((formData.get('name') as string) || '').trim();
    const email = ((formData.get('email') as string) || '').trim();

    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', `New website enquiry from ${name || 'the website'}`);
    formData.append('from_name', 'Zinat Al Ruh Website');
    formData.append('replyto', email);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? ((await response.json()) as { success?: boolean; message?: string })
        : { success: false, message: 'Unable to send your enquiry right now.' };

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your enquiry right now.');
      }

      setSent(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your enquiry right now.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="enquiry" className="section" data-section="enquiry">
      <div className="max-w-[1100px] w-full mx-auto">
        <Reveal className="eyebrow" >
          <span style={{ display: 'inline-block', marginBottom: 28 }}>PROJECT ENQUIRY</span>
        </Reveal>
        <Reveal className="enquiry-wrap">
          <div className="enquiry-left">
            <h2 className="font-display text-[clamp(34px,4.2vw,60px)] leading-[1.05] font-light">
              Start Your
              <br />
              <em className="text-[var(--gold-warm)]">Project Enquiry.</em>
            </h2>
            <p className="mt-6 text-[14px] leading-[1.85] text-[var(--ink-dim)] max-w-sm">
              Fill in the form and our team will respond within one business day with a clear next
              step — no pressure, no obligation.
            </p>
            <div className="enquiry-detail-list mt-10">
              <div className="enq-detail">
                <span className="enq-dot" />Residential &amp; Commercial Fit-Out
              </div>
              <div className="enq-detail">
                <span className="enq-dot" />Glass, Joinery &amp; Technical Works
              </div>
              <div className="enq-detail">
                <span className="enq-dot" />Design Consultation &amp; 3D Visualisation
              </div>
            </div>
          </div>

          <form className="enquiry-form" onSubmit={onSubmit}>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="enq-honeypot" />
            <div className="enq-row">
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-name">Full Name</label>
                <input className="enq-input" id="enq-name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-email">Email Address</label>
                <input className="enq-input" id="enq-email" name="email" type="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="enq-row">
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-phone">Contact Number</label>
                <input className="enq-input" id="enq-phone" name="phone" type="tel" placeholder="+971 xx xxx xxxx" />
              </div>
              <div className="enq-field">
                <label className="enq-label" htmlFor="enq-service">Service Required</label>
                <div className="enq-select-wrap">
                  <select className="enq-input enq-select" id="enq-service" name="service" defaultValue="">
                    <option value="" disabled>Select a service</option>
                    <option value="Design Consultation">Design Consultation</option>
                    <option value="Fit-Out Work">Fit-Out Work</option>
                    <option value="Glass Work">Glass Work</option>
                    <option value="Joinery Work">Joinery Work</option>
                  </select>
                  <svg className="enq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="enq-field enq-field-full">
              <label className="enq-label" htmlFor="enq-message">Message</label>
              <textarea
                className="enq-input enq-textarea"
                id="enq-message"
                name="message"
                rows={5}
                placeholder="Tell us about your project — space type, size, timeline, or anything you'd like us to know."
              />
            </div>

            {error ? <p className="enq-error" role="alert">{error}</p> : null}

            {!sent ? (
              <div className="enq-footer">
                <button type="submit" className="cta-btn solid enq-submit" disabled={sending}>
                  {sending ? 'Sending…' : <>Send Enquiry <span className="arrow" /></>}
                </button>
                <p className="enq-note">We respond within 1 business day.</p>
              </div>
            ) : (
              <div className="enq-success" style={{ display: 'flex' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold-bright)" strokeWidth="1.5" width="28" height="28">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Enquiry received — thank you.</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 4 }}>
                    Our team will be in touch within one business day.
                  </div>
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
