import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../ThemeContext";
import { api } from "../api";

const AMBER = "#F59E0B";
const TEAL  = "#14B8A6";
const RED   = "#EF4444";

// ── Column reference ──────────────────────────────────────────────────────────
const CSV_SPECS = {
  patients: {
    required: ["id", "prescriber"],
    optional: [
      "referral_date","latest_sp_partner","latest_sp_status","latest_sp_substatus",
      "aging_of_status","last_comment","latest_hub_sub_status","primary_channel",
      "primary_payer","primary_pbm","secondary_channel","territory","region",
      "language","hipaa_consent","program_type","first_ship_date","last_ship_date",
    ],
    notes: "full_replace=true deletes patients not in the file (only if they have no notifications).",
  },
  users: {
    required: ["username"],
    optional: ["name", "team", "role"],
    notes: "New users are created with a temporary password 'ChangeMe123!'. Users are never deleted via ingest.",
  },
  alignment: {
    required: ["patient_id"],
    optional: ["territory", "region", "latest_sp_partner", "latest_sp_status"],
    notes: "Only updates the listed fields. All other patient data is untouched.",
  },
};

export default function DataFeedsPage({ currentUser }) {
  const theme = useTheme();

  // ── State ─────────────────────────────────────────────────────────────────
  const [tab, setTab]               = useState("keys");
  const [keys, setKeys]             = useState([]);
  const [logs, setLogs]             = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Key creation form
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null); // {key, name}
  const [creating, setCreating]     = useState(false);

  // Revoke confirm
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revoking, setRevoking]     = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const loadKeys = useCallback(() => {
    setLoadingKeys(true);
    fetch("/api/ingest/keys", { headers: { "X-User-ID": currentUser?.id || "" } })
      .then(r => r.json()).then(setKeys).catch(console.error)
      .finally(() => setLoadingKeys(false));
  }, [currentUser?.id]);

  const loadLogs = useCallback(() => {
    setLoadingLogs(true);
    fetch("/api/ingest/logs?limit=50", { headers: { "X-User-ID": currentUser?.id || "" } })
      .then(r => r.json()).then(setLogs).catch(console.error)
      .finally(() => setLoadingLogs(false));
  }, [currentUser?.id]);

  useEffect(() => { loadKeys(); loadLogs(); }, [loadKeys, loadLogs]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/ingest/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-ID": currentUser?.id || "" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCreatedKey(data);
      setNewKeyName("");
      loadKeys();
    } catch (e) { alert("Error creating key: " + e.message); }
    finally { setCreating(false); }
  };

  const handleRevoke = async (key) => {
    setRevoking(true);
    try {
      await fetch(`/api/ingest/keys/${key.id}`, {
        method: "DELETE",
        headers: { "X-User-ID": currentUser?.id || "" },
      });
      setRevokeTarget(null);
      loadKeys();
    } catch (e) { alert("Error revoking key"); }
    finally { setRevoking(false); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const card = {
    background: theme.panelBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  };

  const tabBtn = (active) => ({
    padding: "8px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    borderBottom: active ? `2px solid ${TEAL}` : "2px solid transparent",
    background: "transparent",
    color: active ? TEAL : theme.textFaint,
    transition: "color 0.15s",
  });

  const badge = (status) => ({
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    background: status === "ok" ? "rgba(20,184,166,0.12)" : "rgba(239,68,68,0.12)",
    color: status === "ok" ? TEAL : RED,
    border: `1px solid ${status === "ok" ? "rgba(20,184,166,0.25)" : "rgba(239,68,68,0.25)"}`,
  });

  const input = {
    flex: 1,
    background: theme.inputBg || theme.surfaceBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    color: theme.text,
    outline: "none",
  };

  const btn = (accent = TEAL) => ({
    padding: "8px 20px",
    background: accent,
    color: accent === RED ? "#fff" : "#0B1829",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
  });

  const mono = {
    fontFamily: "monospace",
    fontSize: 12,
    background: theme.surfaceBg || theme.pageBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 6,
    padding: "2px 8px",
    color: AMBER,
  };

  const thStyle = {
    padding: "8px 12px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: theme.textFaint,
    borderBottom: `1px solid ${theme.border}`,
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const tdStyle = (i) => ({
    padding: "10px 12px",
    fontSize: 13,
    color: i === 0 ? theme.text : theme.textMuted,
    fontWeight: i === 0 ? 600 : 400,
    verticalAlign: "middle",
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: TEAL, textTransform: "uppercase", marginBottom: 8 }}>
          Admin · Data Feeds
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: "-0.4px", margin: "0 0 8px" }}>
          Inbound Data Feeds
        </h1>
        <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
          Automate daily data refreshes by sending CSV files to our secure ingest API.
          Each customer gets their own API key. Supported tables: <strong>patients</strong>, <strong>users</strong>, and <strong>alignment</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}`, marginBottom: 28, gap: 0 }}>
        {[["keys","🔑 API Keys"], ["logs","📋 Ingest Log"], ["docs","📄 CSV Reference"]].map(([id, label]) => (
          <button key={id} style={tabBtn(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ── API Keys tab ─────────────────────────────────────────────────── */}
      {tab === "keys" && (
        <>
          {/* Newly created key banner */}
          {createdKey && (
            <div style={{ background: "rgba(245,158,11,0.08)", border: `1px solid rgba(245,158,11,0.3)`, borderLeft: `4px solid ${AMBER}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 8 }}>
                ✓ API key created — copy it now, it won't be shown again
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <code style={{ ...mono, fontSize: 13, padding: "6px 14px", flex: 1, overflowX: "auto", wordBreak: "break-all" }}>
                  {createdKey.key}
                </code>
                <button style={btn(AMBER)} onClick={() => { navigator.clipboard.writeText(createdKey.key); }}>
                  Copy
                </button>
                <button style={{ ...btn(), background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMuted }} onClick={() => setCreatedKey(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Create new key */}
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Create a new API key</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                style={input}
                placeholder="Key name, e.g. 'Acme Corp Daily Feed'"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateKey()}
              />
              <button style={btn(TEAL)} onClick={handleCreateKey} disabled={creating || !newKeyName.trim()}>
                {creating ? "Creating…" : "Create Key"}
              </button>
            </div>
          </div>

          {/* Key list */}
          <div style={{ background: theme.panelBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            {loadingKeys ? (
              <div style={{ padding: 32, textAlign: "center", color: theme.textFaint, fontSize: 13 }}>Loading…</div>
            ) : keys.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: theme.textFaint, fontSize: 13 }}>No API keys yet. Create one above.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name", "Prefix", "Created By", "Last Used", "Status", ""].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k, i) => (
                    <tr key={k.id} style={{ borderBottom: i < keys.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                      <td style={tdStyle(0)}>{k.name}</td>
                      <td style={tdStyle(1)}><code style={mono}>{k.key_prefix}…</code></td>
                      <td style={tdStyle(1)}>{k.created_by}</td>
                      <td style={tdStyle(1)}>{k.last_used_at ? new Date(k.last_used_at).toLocaleString() : "Never"}</td>
                      <td style={tdStyle(1)}>
                        <span style={badge(k.is_active ? "ok" : "error")}>
                          {k.is_active ? "Active" : "Revoked"}
                        </span>
                      </td>
                      <td style={{ ...tdStyle(1), textAlign: "right" }}>
                        {k.is_active && (
                          <button
                            onClick={() => setRevokeTarget(k)}
                            style={{ fontSize: 11, fontWeight: 700, color: RED, background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── Ingest Log tab ───────────────────────────────────────────────── */}
      {tab === "logs" && (
        <div style={{ background: theme.panelBg, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
          {loadingLogs ? (
            <div style={{ padding: 32, textAlign: "center", color: theme.textFaint, fontSize: 13 }}>Loading…</div>
          ) : logs.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: theme.textFaint, fontSize: 13 }}>No ingest runs yet.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["When", "Table", "Key", "Received", "Upserted", "Deleted", "Status", "Duration"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: i < logs.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                    <td style={tdStyle(0)}>{new Date(l.created_at).toLocaleString()}</td>
                    <td style={tdStyle(1)}><code style={{ ...mono, color: TEAL }}>{l.table_name}</code></td>
                    <td style={tdStyle(1)}>{l.key_name || "—"}</td>
                    <td style={tdStyle(1)}>{l.rows_received}</td>
                    <td style={tdStyle(1)}>{l.rows_upserted}</td>
                    <td style={tdStyle(1)}>{l.rows_deleted || "—"}</td>
                    <td style={tdStyle(1)}><span style={badge(l.status)}>{l.status}</span></td>
                    <td style={tdStyle(1)}>{l.duration_ms}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {logs.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${theme.border}` }}>
              <button onClick={loadLogs} style={{ fontSize: 12, color: theme.textFaint, background: "none", border: "none", cursor: "pointer" }}>↻ Refresh</button>
            </div>
          )}
        </div>
      )}

      {/* ── CSV Reference tab ────────────────────────────────────────────── */}
      {tab === "docs" && (
        <>
          {/* Quick start */}
          <div style={{ ...card, borderLeft: `4px solid ${TEAL}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 10 }}>Quick start</div>
            <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.8 }}>
              1. Create an API key on the <button onClick={() => setTab("keys")} style={{ color: TEAL, background: "none", border: "none", cursor: "pointer", fontWeight: 700, padding: 0 }}>API Keys</button> tab.<br/>
              2. Upload a UTF-8 CSV file with a <code style={mono}>POST</code> request to the relevant endpoint.<br/>
              3. Pass your key in the <code style={mono}>X-API-Key</code> header.
            </div>
          </div>

          {/* Endpoints */}
          {[
            { table: "patients", method: "POST", path: "/api/ingest/patients", extra: "?full_replace=true" },
            { table: "users",    method: "POST", path: "/api/ingest/users" },
            { table: "alignment",method: "POST", path: "/api/ingest/alignment" },
          ].map(({ table, method, path, extra = "" }) => {
            const spec = CSV_SPECS[table];
            return (
              <div key={table} style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: `${TEAL}20`, color: TEAL, border: `1px solid ${TEAL}40`, borderRadius: 4, padding: "2px 8px" }}>{method}</span>
                  <code style={{ fontSize: 13, color: theme.text, fontFamily: "monospace" }}>{path}</code>
                  {extra && <code style={{ fontSize: 11, color: theme.textFaint, fontFamily: "monospace" }}>{extra}</code>}
                </div>

                <div style={{ display: "flex", gap: 24, marginBottom: 14, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: theme.textFaint, textTransform: "uppercase", marginBottom: 6 }}>Required columns</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {spec.required.map(c => (
                        <code key={c} style={{ ...mono, color: RED, border: `1px solid rgba(239,68,68,0.3)` }}>{c}</code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: theme.textFaint, textTransform: "uppercase", marginBottom: 6 }}>Optional columns</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {spec.optional.map(c => (
                        <code key={c} style={mono}>{c}</code>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: theme.textFaint, lineHeight: 1.7, marginBottom: 14 }}>{spec.notes}</div>

                {/* Example curl */}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: theme.textFaint, textTransform: "uppercase", marginBottom: 8 }}>Example</div>
                <pre style={{ background: theme.surfaceBg || theme.pageBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 12, color: "#94A3B8", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{`curl -X POST https://conduit.fireflydigital.biz${path}${extra} \\
  -H "X-API-Key: cdt_your_key_here" \\
  -F "file=@${table}.csv"`}</pre>
              </div>
            );
          })}

          {/* Response format */}
          <div style={card}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Response format</div>
            <pre style={{ background: theme.surfaceBg || theme.pageBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 12, color: "#94A3B8", overflowX: "auto", margin: 0, lineHeight: 1.6 }}>{`{
  "upserted": 126,
  "deleted": 4,      // patients only, with full_replace=true
  "errors": []       // per-row error messages, if any
}`}</pre>
          </div>
        </>
      )}

      {/* ── Revoke confirm modal ─────────────────────────────────────────── */}
      {revokeTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "min(420px,100%)", background: theme.panelBg, border: `1px solid ${theme.border}`, borderTop: `4px solid ${RED}`, borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Revoke API Key?</div>
            <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
              "<strong>{revokeTarget.name}</strong>" will stop working immediately. Any automated processes using this key will fail. This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setRevokeTarget(null)} style={{ ...btn(), background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMuted }}>Cancel</button>
              <button onClick={() => handleRevoke(revokeTarget)} disabled={revoking} style={btn(RED)}>
                {revoking ? "Revoking…" : "Revoke Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
