import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useIsMobile } from "../useIsMobile";
import { TEAM_COLORS } from "../constants";
import { api } from "../api";

const TEAMS = ["Home Office", "NCM", "SP", "Sales"];
const ROLES = ["admin", "partner"];

// ── Generic field row ────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", options }) {
  const theme = useTheme();
  const style = { width: "100%", padding: "9px 12px", background: theme.inputBg, border: `1px solid ${theme.borderInput}`, borderRadius: 7, color: theme.text, fontSize: 13, outline: "none", fontFamily: "inherit" };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: 1.5, color: theme.textMuted, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
      {options
        ? <select value={value || ""} onChange={e => onChange(e.target.value)} style={style}>
            <option value="">—</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

// ── User modal ───────────────────────────────────────────────────────────────
function UserModal({ user, onSave, onClose }) {
  const theme  = useTheme();
  const isNew  = !user.id;
  const [form, setForm]     = useState({ username: user.username || "", name: user.name || "", team: user.team || "NCM", role: user.role || "partner", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.username || !form.name) { setError("Username and name are required."); return; }
    if (isNew && !form.password)      { setError("Password is required for new users."); return; }
    setSaving(true);
    try {
      const payload = { username: form.username, name: form.name, team: form.team, role: form.role };
      if (form.password) payload.password = form.password;
      const saved = isNew ? await api.createUser(payload) : await api.updateUser(user.id, payload);
      onSave(saved);
    } catch (e) { setError(e.message || "Failed to save."); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "min(440px,100%)", background: theme.panelBg, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 20 }}>{isNew ? "Add User" : "Edit User"}</div>
        <Field label="Full Name"  value={form.name}     onChange={v => set("name", v)} />
        <Field label="Username"   value={form.username} onChange={v => set("username", v)} />
        <Field label="Password"   value={form.password} onChange={v => set("password", v)} type="password" />
        <Field label="Team"       value={form.team}     onChange={v => set("team", v)} options={TEAMS} />
        <Field label="Role"       value={form.role}     onChange={v => set("role", v)} options={ROLES} />
        {error && <div style={{ fontSize: 12, color: "#e74c3c", marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "11px", background: "#4f8ef7", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={onClose}
            style={{ padding: "11px 18px", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textMuted, fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Patient modal ────────────────────────────────────────────────────────────
function PatientModal({ patient, onSave, onClose }) {
  const theme  = useTheme();
  const [form, setForm]     = useState({ ...patient });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await api.updatePatient(patient.id, form);
      onSave(saved);
    } finally { setSaving(false); }
  };

  const fields = [
    ["Prescriber",       "prescriber"],
    ["SP Partner",       "latest_sp_partner"],
    ["SP Status",        "latest_sp_status"],
    ["SP Substatus",     "latest_sp_substatus"],
    ["HUB Substatus",    "latest_hub_sub_status"],
    ["Primary Channel",  "primary_channel"],
    ["Primary Payer",    "primary_payer"],
    ["Primary PBM",      "primary_pbm"],
    ["Secondary Channel","secondary_channel"],
    ["Territory",        "territory"],
    ["Region",           "region"],
    ["Language",         "language"],
    ["Program Type",     "program_type"],
    ["HIPAA Consent",    "hippa_consent"],
    ["Referral Date",    "referral_date"],
    ["First Ship Date",  "first_ship_date"],
    ["Last Ship Date",   "last_ship_date"],
    ["Aging (days)",     "aging_of_status"],
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "min(680px,100%)", maxHeight: "88vh", background: theme.panelBg, border: `1px solid ${theme.border}`, borderRadius: 16, display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>Edit Patient</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {fields.map(([label, key]) => (
              <div key={key} style={{ gridColumn: key === "prescriber" ? "1/-1" : undefined }}>
                <Field label={label} value={form[key]} onChange={v => set(key, key === "aging_of_status" ? Number(v) : v)} type={key === "aging_of_status" ? "number" : "text"} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4 }}>
            <label style={{ fontSize: 10, letterSpacing: 1.5, color: theme.textMuted, textTransform: "uppercase", display: "block", marginBottom: 5 }}>Last Comment</label>
            <textarea value={form.last_comment || ""} onChange={e => set("last_comment", e.target.value)} rows={3}
              style={{ width: "100%", padding: "9px 12px", background: theme.inputBg, border: `1px solid ${theme.borderInput}`, borderRadius: 7, color: theme.text, fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          </div>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${theme.border}`, display: "flex", gap: 10 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "11px", background: "#4f8ef7", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button onClick={onClose}
            style={{ padding: "11px 18px", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, color: theme.textMuted, fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings page ───────────────────────────────────────────────────────
export default function SettingsPage({ isDark, onToggleTheme }) {
  const theme    = useTheme();
  const isMobile = useIsMobile();

  const [users, setUsers]           = useState([]);
  const [patients, setPatients]     = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [editingUser, setEditingUser]     = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab]   = useState("appearance");
  const [loadingUsers, setLoadingUsers]     = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);

  useEffect(() => {
    api.getUsers().then(u => { setUsers(u); setLoadingUsers(false); });
    api.getPatients().then(p => { setPatients(p); setLoadingPatients(false); });
  }, []);

  const handleUserSave = (saved) => {
    setUsers(prev => { const i = prev.findIndex(u => u.id === saved.id); if (i === -1) return [...prev, saved]; const n = [...prev]; n[i] = saved; return n; });
    setEditingUser(null);
  };

  const handleUserDelete = async (id) => {
    setDeletingId(id);
    try { await api.deleteUser(id); setUsers(prev => prev.filter(u => u.id !== id)); }
    finally { setDeletingId(null); }
  };

  const handlePatientSave = (saved) => {
    setPatients(prev => { const i = prev.findIndex(p => p.id === saved.id); if (i === -1) return prev; const n = [...prev]; n[i] = saved; return n; });
    setEditingPatient(null);
  };

  const handlePatientDelete = async (id) => {
    if (!window.confirm("Delete this patient and all their notifications?")) return;
    setDeletingId(id);
    try { await api.deletePatient(id); setPatients(prev => prev.filter(p => p.id !== id)); }
    finally { setDeletingId(null); }
  };

  const filteredPatients = patients.filter(p =>
    !patientSearch || p.prescriber?.toLowerCase().includes(patientSearch.toLowerCase()) || p.territory?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const tabs = [
    { id: "appearance", label: "🎨  Appearance" },
    { id: "users",      label: "👥  Users" },
    { id: "patients",   label: "🗂  Patients" },
  ];

  const SectionCard = ({ children }) => (
    <div style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: theme.text, marginBottom: 20 }}>Settings</div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, borderBottom: `1px solid ${theme.border}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "10px 18px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t.id ? "#4f8ef7" : "transparent"}`, color: activeTab === t.id ? "#4f8ef7" : theme.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── APPEARANCE ── */}
      {activeTab === "appearance" && (
        <SectionCard>
          <div style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Theme</div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>Choose between dark and light mode</div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {[
                { id: "dark",  label: "Dark Mode",  icon: "🌙", desc: "Easy on the eyes at night" },
                { id: "light", label: "Light Mode",  icon: "☀️", desc: "Clean and bright" },
              ].map(opt => {
                const isSelected = isDark === (opt.id === "dark");
                return (
                  <button key={opt.id} onClick={() => { if (!isSelected) onToggleTheme(); }}
                    style={{ padding: "20px 24px", background: isSelected ? "rgba(79,142,247,0.12)" : theme.surfaceBg2, border: `2px solid ${isSelected ? "#4f8ef7" : theme.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>{opt.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{opt.desc}</div>
                    {isSelected && <div style={{ marginTop: 10, fontSize: 11, color: "#4f8ef7", fontWeight: 700 }}>✓ Active</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── USERS ── */}
      {activeTab === "users" && (
        <SectionCard>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>Users <span style={{ fontSize: 13, color: theme.textFaint, fontWeight: 400 }}>({users.length})</span></div>
            <button onClick={() => setEditingUser({})}
              style={{ padding: "7px 16px", background: "#4f8ef7", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add User</button>
          </div>
          {loadingUsers ? <div style={{ padding: 32, textAlign: "center", color: theme.textFaint }}>Loading…</div> : isMobile ? (
            <div style={{ padding: 12 }}>
              {users.map(u => {
                const tc = TEAM_COLORS[u.team] || { accent: "#888", light: "#eee", lightText: "#555" };
                return (
                  <div key={u.id} style={{ background: theme.surfaceBg2, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: tc.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: theme.textFaint, fontFamily: "monospace" }}>{u.username}</div>
                      </div>
                      <span style={{ padding: "3px 10px", background: theme.isDark ? tc.light + "22" : tc.light, color: theme.isDark ? tc.accent : tc.lightText, borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{u.team}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditingUser(u)} style={{ flex: 1, padding: 8, background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => handleUserDelete(u.id)} disabled={deletingId === u.id} style={{ flex: 1, padding: 8, background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 6, color: "#e74c3c", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{deletingId === u.id ? "…" : "Delete"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.surfaceBg2 }}>
                  {["Name", "Username", "Team", "Role", ""].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, color: theme.textFaint, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${theme.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const tc = TEAM_COLORS[u.team] || { accent: "#888", light: "#eee", lightText: "#555" };
                  return (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${theme.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background = theme.rowHover}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: tc.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                            {u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: theme.textMuted, fontFamily: "monospace" }}>{u.username}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ padding: "3px 10px", background: theme.isDark ? tc.light + "22" : tc.light, color: theme.isDark ? tc.accent : tc.lightText, borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{u.team}</span>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: theme.textMuted, textTransform: "capitalize" }}>{u.role}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setEditingUser(u)} style={{ padding: "5px 14px", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleUserDelete(u.id)} disabled={deletingId === u.id} style={{ padding: "5px 14px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 6, color: "#e74c3c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{deletingId === u.id ? "…" : "Delete"}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </SectionCard>
      )}

      {/* ── PATIENTS ── */}
      {activeTab === "patients" && (
        <SectionCard>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>Patients <span style={{ fontSize: 13, color: theme.textFaint, fontWeight: 400 }}>({patients.length})</span></div>
            <input value={patientSearch} onChange={e => setPatientSearch(e.target.value)}
              placeholder="Search by name or territory…"
              style={{ padding: "7px 12px", background: theme.inputBg, border: `1px solid ${theme.borderInput}`, borderRadius: 8, color: theme.text, fontSize: 13, outline: "none", width: isMobile ? "100%" : 240 }} />
          </div>
          {loadingPatients ? <div style={{ padding: 32, textAlign: "center", color: theme.textFaint }}>Loading…</div> : isMobile ? (
            <div style={{ padding: 12 }}>
              {filteredPatients.map(p => (
                <div key={p.id} style={{ background: theme.surfaceBg2, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{p.prescriber}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>{p.territory} · {p.region} · {p.primary_channel}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingPatient(p)} style={{ flex: 1, padding: 8, background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handlePatientDelete(p.id)} disabled={deletingId === p.id} style={{ flex: 1, padding: 8, background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 6, color: "#e74c3c", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{deletingId === p.id ? "…" : "Delete"}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.surfaceBg2 }}>
                  {["Prescriber", "Territory", "Region", "Channel", "SP Partner", "Aging", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, color: theme.textFaint, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${theme.border}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.rowHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: theme.text }}>{p.prescriber}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: theme.textMuted }}>{p.territory}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: theme.textMuted }}>{p.region}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: theme.textMuted }}>{p.primary_channel || "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: theme.textMuted }}>{p.latest_sp_partner || "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: theme.textMuted }}>{p.aging_of_status}d</td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEditingPatient(p)} style={{ padding: "5px 12px", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handlePatientDelete(p.id)} disabled={deletingId === p.id} style={{ padding: "5px 12px", background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 6, color: "#e74c3c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{deletingId === p.id ? "…" : "Delete"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      )}

      {editingUser   !== null && <UserModal    user={editingUser}       onSave={handleUserSave}    onClose={() => setEditingUser(null)} />}
      {editingPatient !== null && <PatientModal patient={editingPatient} onSave={handlePatientSave} onClose={() => setEditingPatient(null)} />}
    </div>
  );
}
