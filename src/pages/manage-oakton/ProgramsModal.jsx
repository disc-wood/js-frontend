import { useState, useEffect } from 'react';
import { authFetch } from '@/common/utils/authFetch';

function ProgramRow({ program, onToggleActive, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(program.label);
  const [saving, setSaving] = useState(false);

  async function saveEdit() {
    const trimmed = editLabel.trim();
    if (!trimmed || trimmed === program.label) {
      setEditing(false);
      setEditLabel(program.label);
      return;
    }
    setSaving(true);
    await onEdit(program.id, trimmed);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      border: '1px solid #e4e6ea', borderRadius: 8,
      background: program.is_active ? '#fff' : '#fafafa',
    }}>
      {editing ? (
        <input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') { setEditing(false); setEditLabel(program.label); }
          }}
          autoFocus
          style={{
            flex: 1, padding: '6px 10px',
            border: '1px solid #0C447C', borderRadius: 6,
            fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
          }}
        />
      ) : (
        <span style={{
          flex: 1, fontSize: 13.5,
          color: program.is_active ? '#1f2937' : '#9ca3af',
          textDecoration: program.is_active ? 'none' : 'line-through',
        }}>
          {program.label}
        </span>
      )}

      <button
        type="button"
        onClick={() => onToggleActive(program.id, !program.is_active)}
        style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 12,
          border: program.is_active ? '1px solid #cde0d5' : '1px solid #d1d5db',
          background: program.is_active ? '#e8f4ef' : '#f3f4f6',
          color: program.is_active ? '#006853' : '#6b7280',
          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        }}
      >
        {program.is_active ? 'Active' : 'Hidden'}
      </button>

      {editing ? (
        <>
          <button type="button" onClick={saveEdit} disabled={saving} style={smallPrimaryBtn}>
            {saving ? '…' : 'Save'}
          </button>
          <button type="button" onClick={() => { setEditing(false); setEditLabel(program.label); }} style={smallGhostBtn}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => setEditing(true)} style={smallGhostBtn}>Edit</button>
          <button type="button" onClick={() => onDelete(program.id)} style={smallDeleteBtn}>Delete</button>
        </>
      )}
    </div>
  );
}

export default function ProgramsModal({ onClose }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${baseUrl}/oaktonInfo/programs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    const trimmed = newLabel.trim();
    if (!trimmed) { setAddError('Please enter a program name.'); return; }
    if (programs.some((p) => p.label === trimmed)) { setAddError('A program with this name already exists.'); return; }

    setAdding(true);
    setAddError(null);
    try {
      const res = await authFetch(`${baseUrl}/oaktonInfo/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: trimmed, sort_order: programs.length }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { program } = await res.json();
      setPrograms((prev) => [...prev, program]);
      setNewLabel('');
    } catch (e) {
      setAddError(e.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleActive(id, isActive) {
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, is_active: isActive } : p));
    try {
      const res = await authFetch(`${baseUrl}/oaktonInfo/programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  async function handleEdit(id, label) {
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, label } : p));
    try {
      const res = await authFetch(`${baseUrl}/oaktonInfo/programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  async function handleDelete(id) {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await authFetch(`${baseUrl}/oaktonInfo/programs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e.message);
      load();
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 999, border: 'none', cursor: 'default',
          padding: 0, width: '100%', height: '100%',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="programs-title"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000, background: '#fff', borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          width: 'min(620px, 95vw)', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid #e8eaed',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <h2 id="programs-title" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111' }}>
              Programs of interest
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>
              Manage the program options shown on the Oakton intake form and acceptance emails.
            </p>
          </div>
          <button
            type="button" aria-label="Close" onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af', lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flexGrow: 1, padding: '20px 24px 24px' }}>
          {/* Add form */}
          <div style={{
            background: '#f8f9fb', border: '1px solid #e4e6ea',
            borderRadius: 10, padding: '16px 18px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Add program
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => { setNewLabel(e.target.value); setAddError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Welding Certificate"
                style={{
                  flex: 1, padding: '8px 12px', border: '1px solid #d1d5db',
                  borderRadius: 7, fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button type="button" onClick={handleAdd} disabled={adding} style={primaryBtn}>
                {adding ? 'Adding…' : 'Add'}
              </button>
            </div>
            {addError && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#dc2626' }}>{addError}</p>}
          </div>

          {error && <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{error}</p>}

          {loading ? (
            <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>Loading…</p>
          ) : programs.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
              No programs yet. Add one above.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {programs.map((program) => (
                <ProgramRow
                  key={program.id}
                  program={program}
                  onToggleActive={handleToggleActive}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const primaryBtn = {
  background: '#0C447C', color: '#fff', border: 'none',
  borderRadius: 7, padding: '8px 16px', fontSize: 13.5, fontWeight: 600,
  cursor: 'pointer', whiteSpace: 'nowrap',
};

const smallPrimaryBtn = {
  background: '#0C447C', color: '#fff', border: 'none',
  borderRadius: 5, padding: '4px 10px', fontSize: 12.5, fontWeight: 500,
  cursor: 'pointer', flexShrink: 0,
};

const smallGhostBtn = {
  background: 'transparent', color: '#374151', border: '1px solid #d1d5db',
  borderRadius: 5, padding: '4px 10px', fontSize: 12.5, fontWeight: 500,
  cursor: 'pointer', flexShrink: 0,
};

const smallDeleteBtn = {
  background: 'transparent', color: '#ef4444', border: '1px solid #fecaca',
  borderRadius: 5, padding: '4px 10px', fontSize: 12.5, fontWeight: 500,
  cursor: 'pointer', flexShrink: 0,
};
