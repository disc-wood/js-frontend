import { useState, useEffect } from "react";

// ─── API helpers ────────────────────────────────────────────────────────────
const API = "/api/oakton-info"; // adjust if your base path differs

async function fetchTermDates() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/oaktonInfo/term-dates`);
  if (!res.ok) throw new Error("Failed to fetch term dates");
  return res.json();
}

async function upsertTermDate(payload) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/oaktonInfo/term-dates`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save term date");
  return res.json();
}

async function deleteTermDate(id) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/oaktonInfo/term-dates/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete term date");
  return res.json();
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SEASONS = ["Fall", "Spring", "Summer"];
const SUMMER_SESSIONS = [
  "Three-week session",
  "Four-week session",
  "Seven-week session",
  "Eight-week session",
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) =>
  String(currentYear - 1 + i)
);

const emptyForm = {
  year: String(currentYear),
  season: "Fall",
  session: "",
  startDate: "",
  endDate: "",
};

// ─── Formatting helpers ──────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

function termLabel(row) {
  return row.session
    ? `${row.season} ${row.year} — ${row.session}`
    : `${row.season} ${row.year}`;
}

// ─── Main modal ──────────────────────────────────────────────────────────────
export default function TermDatesModal({ onClose }) {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTermDates();
      setTerms(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      year: row.year,
      season: row.season,
      session: row.session || "",
      startDate: row.start_date?.slice(0, 10) || "",
      endDate: row.end_date?.slice(0, 10) || "",
    });
    setFormError(null);
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function handleSave() {
    if (!form.startDate || !form.endDate) {
      setFormError("Start date and end date are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await upsertTermDate({
        year: form.year,
        season: form.season,
        session: form.season === "Summer" ? form.session || null : null,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      await load();
      setEditingId(null);
      setForm(emptyForm);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTermDate(id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop — button so it's keyboard accessible */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 999,
          border: "none",
          cursor: "default",
          padding: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="term-dates-title"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          width: "min(780px, 95vw)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #e8eaed",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h2 id="term-dates-title" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111" }}>
              Manage Term Dates
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6b7280" }}>
              Start/end dates are auto-applied to all students enrolled in that term.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: "#9ca3af", lineHeight: 1, padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: "auto", flexGrow: 1, padding: "0 24px 24px" }}>

          {/* ── Add / Edit form ── */}
          <div style={{
            background: "#f8f9fb",
            border: "1px solid #e4e6ea",
            borderRadius: 10,
            padding: "16px 18px",
            margin: "18px 0 4px",
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: "#374151",
              marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              {editingId ? "Edit Term" : "Add Term"}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
              {/* Year */}
              <div>
                <label htmlFor="term-year" style={labelStyle}>Year</label>
                <select
                  id="term-year"
                  value={form.year}
                  onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                  style={selectStyle}
                >
                  {YEAR_OPTIONS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>

              {/* Season */}
              <div>
                <label htmlFor="term-season" style={labelStyle}>Season</label>
                <select
                  id="term-season"
                  value={form.season}
                  onChange={e => setForm(f => ({ ...f, season: e.target.value, session: "" }))}
                  style={selectStyle}
                >
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Session (Summer only) */}
              {form.season === "Summer" && (
                <div>
                  <label htmlFor="term-session" style={labelStyle}>Session</label>
                  <select
                    id="term-session"
                    value={form.session}
                    onChange={e => setForm(f => ({ ...f, session: e.target.value }))}
                    style={selectStyle}
                  >
                    <option value="">— select —</option>
                    {SUMMER_SESSIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}

              {/* Start date */}
              <div>
                <label htmlFor="term-start-date" style={labelStyle}>Start Date</label>
                <input
                  id="term-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* End date */}
              <div>
                <label htmlFor="term-end-date" style={labelStyle}>End Date</label>
                <input
                  id="term-end-date"
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            {formError && (
              <p style={{ margin: "10px 0 0", fontSize: 13, color: "#dc2626" }}>{formError}</p>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={primaryBtnStyle}
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Add Term"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={startAdd}
                  style={ghostBtnStyle}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* ── Term list ── */}
          {loading ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0", fontSize: 14 }}>
              Loading…
            </p>
          ) : error ? (
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 16 }}>{error}</p>
          ) : terms.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 20, textAlign: "center" }}>
              No terms configured yet. Add one above.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 18, fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e4e6ea" }}>
                  {["Term", "Start Date", "End Date", ""].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {terms.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{
                      background: editingId === row.id ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#fafafa",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <td style={tdStyle}>{termLabel(row)}</td>
                    <td style={tdStyle}>{formatDate(row.start_date)}</td>
                    <td style={tdStyle}>{formatDate(row.end_date)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        style={smallBtnStyle("#2563eb")}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        style={{ ...smallBtnStyle("#ef4444"), marginLeft: 6 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Confirm delete dialog ── */}
      {deleteTarget && (
        <>
          {/* Delete backdrop — button for a11y */}
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => setDeleteTarget(null)}
            onKeyDown={(e) => e.key === "Escape" && setDeleteTarget(null)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 1001,
              border: "none",
              cursor: "default",
              padding: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-term-title"
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1002,
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              padding: "24px 28px",
              width: 360,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <h3 id="delete-term-title" style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#111" }}>
              Delete term?
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#4b5563", lineHeight: 1.5 }}>
              This will remove <strong>{termLabel(deleteTarget)}</strong> from the calendar.
              Students already enrolled keep their dates — this only affects future enrollments.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setDeleteTarget(null)} style={ghostBtnStyle}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget.id)}
                style={{ ...primaryBtnStyle, background: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Shared micro-styles ─────────────────────────────────────────────────────
const labelStyle = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13.5,
  color: "#111",
  background: "#fff",
  boxSizing: "border-box",
  outline: "none",
};

const selectStyle = { ...inputStyle };

const primaryBtnStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "8px 18px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
};

const ghostBtnStyle = {
  background: "transparent",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: 7,
  padding: "8px 16px",
  fontSize: 13.5,
  fontWeight: 500,
  cursor: "pointer",
};

const smallBtnStyle = (color) => ({
  background: "transparent",
  color,
  border: `1px solid ${color}`,
  borderRadius: 5,
  padding: "4px 10px",
  fontSize: 12.5,
  fontWeight: 500,
  cursor: "pointer",
});

const thStyle = {
  textAlign: "left",
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle = {
  padding: "10px 12px",
  color: "#1f2937",
  verticalAlign: "middle",
};