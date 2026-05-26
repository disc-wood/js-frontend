import { useState, useEffect } from 'react';
import { authFetch } from '@/common/utils/authFetch';

const PROGRAM_LABELS = {
  oakton: 'Oakton College',
  ihtu: 'IHTU',
};

export default function CustomQuestionModal({ programId, onClose }) {
  const [questionText, setQuestionText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  const programLabel = PROGRAM_LABELS[programId] || programId;

  useEffect(() => {
    authFetch(`${baseUrl}/customQuestions/${programId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestionText(data.question_text || '');
        setIsActive(data.is_active ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [programId, baseUrl]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/customQuestions/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_text: questionText, is_active: isActive }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 999,
          border: 'none', cursor: 'default',
          padding: 0, width: '100%', height: '100%',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-question-title"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          width: 'min(560px, 95vw)',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #e8eaed',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h2 id="custom-question-title" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>
              Custom intake question
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>
              {programLabel} — shown to applicants at the end of the intake form
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flexGrow: 1, padding: '20px 24px 24px' }}>
          {loading ? (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading…</p>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="q-text" style={labelStyle}>Question text</label>
                <textarea
                  id="q-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={4}
                  placeholder="e.g. Do you have any remaining thoughts or notes you would like to include with your application?"
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #d1d5db', borderRadius: 8,
                    fontSize: 14, fontFamily: 'inherit', color: '#111',
                    resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', lineHeight: 1.5,
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', marginBottom: 20 }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#0C447C', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>
                  Show this question on the intake form
                </span>
              </label>

              {error && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#dc2626' }}>{error}</p>}
              {saved && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#16a34a' }}>Saved successfully.</p>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={handleSave} disabled={saving} style={primaryBtnStyle}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={onClose} style={ghostBtnStyle}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block', fontSize: 11.5, fontWeight: 600, color: '#6b7280',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em',
};

const primaryBtnStyle = {
  background: '#0C447C', color: '#fff', border: 'none',
  borderRadius: 7, padding: '9px 18px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
};

const ghostBtnStyle = {
  background: 'transparent', color: '#374151', border: '1px solid #d1d5db',
  borderRadius: 7, padding: '9px 16px', fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
};
