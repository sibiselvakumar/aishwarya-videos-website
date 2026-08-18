import { useState } from 'react';
import { STUDIO } from '../data/studio.js';
import { useReveal } from '../lib/hooks.js';

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'date', label: 'Date (if known)', type: 'date', optional: true },
  { name: 'place', label: 'Location', type: 'text', optional: true },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please tell us your name.';
  if (!data.email.trim()) errors.email = 'We need an email to reply to.';
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = 'That email doesn’t look right.';
  if (data.message.trim().length < 10) errors.message = 'A sentence or two, so we can help.';
  return errors;
}

const EMPTY = { name: '', email: '', date: '', place: '', message: '' };

export default function Contact() {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const head = useReveal();
  const form = useReveal();

  const set = (k) => (e) => {
    const v = e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    // Clear a field's error as soon as the user starts fixing it.
    setErrors((err) => (err[k] ? { ...err, [k]: undefined } : err));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    // No endpoint in this build — swap for your form service / API route here.
    setSent(true);
    setData(EMPTY);
  };

  return (
    <section className="section contact" id="contact">
      <header className="contact__head reveal" ref={head}>
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Enquiries
        </p>
        <h2 className="contact__title">
          Tell us about
          <em> your day</em>
        </h2>
        <div className="contact__details">
          <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
          <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>
          <address>
            {STUDIO.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p>{STUDIO.replyWindow}</p>
        </div>
      </header>

      <div className="contact__form reveal" ref={form}>
        {sent ? (
          <div className="sent" role="status">
            <h3>Thank you — that’s with us.</h3>
            <p>We reply to every enquiry within two working days.</p>
            <p className="sent__note">
              Demo build: this form validates but has no endpoint. Wire{' '}
              <code>onSubmit</code> in <code>Contact.jsx</code> to your form service.
            </p>
            <button className="link" onClick={() => setSent(false)}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="fields">
              {FIELDS.map((f) => (
                <p key={f.name} className={`field ${errors[f.name] ? 'has-error' : ''}`}>
                  <label htmlFor={f.name}>
                    {f.label}
                    {!f.optional && <span aria-hidden="true"> *</span>}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    value={data[f.name]}
                    onChange={set(f.name)}
                    aria-invalid={errors[f.name] ? 'true' : undefined}
                    aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
                  />
                  {errors[f.name] && (
                    <span className="err" id={`${f.name}-err`}>
                      {errors[f.name]}
                    </span>
                  )}
                </p>
              ))}
            </div>

            <p className={`field ${errors.message ? 'has-error' : ''}`}>
              <label htmlFor="message">
                What are you planning?<span aria-hidden="true"> *</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={data.message}
                onChange={set('message')}
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'message-err' : undefined}
              />
              {errors.message && (
                <span className="err" id="message-err">
                  {errors.message}
                </span>
              )}
            </p>

            <button className="btn btn--solid" type="submit">
              <span>Send enquiry</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
