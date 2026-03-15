import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useIsMobile } from "../useIsMobile";
import { api } from "../api";

const TEAM_COLORS = {
  "Home Office": "#14B8A6",
  "NCM":         "#3B82F6",
  "SP":          "#A855F7",
  "ISS":         "#F59E0B",
};

const STATUS = {
  active:   { label: "Active",   color: "#2ecc71", bg: "#2ecc7118" },
  at_risk:  { label: "At Risk",  color: "#f0a500", bg: "#f0a50018" },
  inactive: { label: "Inactive", color: "#e74c3c", bg: "#e74c3c18" },
};

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function relativeTime(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso + (iso.endsWith("Z") ? "" : "Z")).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── 30-day trend bar chart
function TrendChart({ data, height = 80 }) {
  const theme = useTheme();
  const max   = Math.max(...data.map(d => d.count), 1);
  const w     = 100 / data.length;
  const [hovered, setHovered] = useState(null);

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }} overflow="visible">
      {data.map((d, i) => {
        const barH = Math.max((d.count / max) * (height - 14), d.count > 0 ? 3 : 0);
        const x = i * w;
        const y = height - barH;
        return (
          <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <rect x={x + w * 0.1} y={y} width={w * 0.8} height={barH}
              fill={hovered === i ? "#14B8A6" : "#14B8A655"} rx="1"
              style={{ transition: "fill 0.15s" }} />
            {hovered === i && (
              <text x={x + w / 2} y={y - 3} textAnchor="middle" fontSize="4.5" fill={theme.text}>
                {d.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Horizontal bar
function HBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ height: 8, background: "#ffffff10", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

export default function EngagementPage({ currentUser }) {
  const theme    = useTheme();
  const isMobile = useIsMobile();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.getEngagement()
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };
  useEffect(load, []);

  const card = (content) => (
    <div style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "20px 22px" }}>
      {content}
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 14, color: theme.textMuted }}>Loading engagement data…</div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 6 }}>Failed to load engagement data</div>
      <button onClick={load} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: "#14B8A6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Retry</button>
    </div>
  );

  const { summary, users, login_trend, team_breakdown } = data;
  const inactive = users.filter(u => u.status === "inactive");
  const maxTeamLogins = Math.max(...team_breakdown.map(t => t.logins), 1);
  const maxTeamNotifs = Math.max(...team_breakdown.map(t => t.notifications), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: theme.text }}>User Engagement</div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
            {summary.total_users} users · {summary.active_users} active · last 30 days
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={load} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surfaceBg, color: theme.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            ↻ Refresh
          </button>
          <div style={{ fontSize: 11, color: theme.textFaint, background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 12px" }}>
            Last 30 days
          </div>
        </div>
      </div>

      {/* KPI hero row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Sessions",   value: summary.total_logins_30d,        color: "#14B8A6", sub: "logins" },
          { label: "Active Users",     value: summary.active_users,             color: "#2ecc71", sub: `${summary.total_users} total` },
          { label: "At Risk",          value: summary.at_risk_users,            color: "#f0a500", sub: "1–4 logins" },
          { label: "Inactive",         value: summary.inactive_users,           color: "#e74c3c", sub: "0 logins" },
          { label: "Notifications",    value: summary.total_notifications_30d,  color: "#A855F7", sub: "sent" },
          { label: "Case Notes",       value: summary.total_notes_30d,          color: "#3B82F6", sub: "created" },
        ].map(({ label, value, color, sub }) => (
          <div key={label} style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: isMobile ? "14px 12px" : "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -10, top: -10, width: 60, height: 60, borderRadius: "50%", background: color + "10" }} />
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, letterSpacing: 0.3 }}>{label}</div>
            <div style={{ fontSize: 10, color: theme.textFaint, marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Trend + Team row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* 30-day login trend */}
        {card(
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2.5, color: "#14B8A6", textTransform: "uppercase", fontWeight: 700 }}>Login Activity</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>Daily sessions over the last 30 days</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#14B8A6" }}>{summary.total_logins_30d}</div>
            </div>
            <TrendChart data={login_trend} height={80} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: theme.textFaint }}>{login_trend[0]?.date}</span>
              <span style={{ fontSize: 10, color: theme.textFaint }}>Today</span>
            </div>
          </>
        )}

        {/* Team breakdown */}
        {card(
          <>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: "#14B8A6", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Team Activity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {team_breakdown.map(t => (
                <div key={t.team}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAM_COLORS[t.team] || "#94A3B8", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{t.team}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 11, color: theme.textMuted }}>{t.logins} logins</span>
                      <span style={{ fontSize: 11, color: theme.textFaint }}>{t.notifications} notifs</span>
                    </div>
                  </div>
                  <HBar value={t.logins} max={maxTeamLogins} color={TEAM_COLORS[t.team] || "#94A3B8"} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User engagement table */}
      <div style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderRadius: 14, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: "#14B8A6", textTransform: "uppercase", fontWeight: 700 }}>User Activity</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 3 }}>Sorted by total actions in the last 30 days</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                {["User", "Status", "7d Logins", "30d Logins", "Notifs Sent", "Notes", "Last Seen"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: theme.textFaint, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const s = STATUS[u.status];
                const tc = TEAM_COLORS[u.team] || "#94A3B8";
                return (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${theme.border}` : "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.surfaceBg2 || theme.border + "22"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: tc + "22", border: `1.5px solid ${tc}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: tc, flexShrink: 0 }}>
                          {initials(u.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: theme.text, fontSize: 13 }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: theme.textFaint }}>{u.team} · {u.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.color}44`, borderRadius: 20, padding: "3px 10px" }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: u.logins_7d > 0 ? theme.text : theme.textFaint, fontWeight: u.logins_7d > 0 ? 600 : 400 }}>{u.logins_7d}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: u.logins_30d > 0 ? theme.text : theme.textFaint, fontWeight: u.logins_30d > 0 ? 600 : 400 }}>{u.logins_30d}</span>
                        {u.logins_30d > 0 && (
                          <div style={{ flex: 1, height: 4, background: theme.border, borderRadius: 2, minWidth: 40, maxWidth: 80 }}>
                            <div style={{ width: `${Math.min((u.logins_30d / (summary.total_logins_30d || 1)) * 100 * users.length, 100)}%`, height: "100%", background: "#14B8A6", borderRadius: 2 }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: u.notifications_sent > 0 ? "#A855F7" : theme.textFaint }}>{u.notifications_sent}</td>
                    <td style={{ padding: "12px 16px", color: u.notes_created > 0 ? "#3B82F6" : theme.textFaint }}>{u.notes_created}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: theme.textMuted, whiteSpace: "nowrap" }}>{relativeTime(u.last_login)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Not using the app */}
      {inactive.length > 0 && (
        <div style={{ background: theme.surfaceBg, border: `1px solid #e74c3c44`, borderTop: `3px solid #e74c3c`, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(231,76,60,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🚨</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Not Using the App</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                {inactive.length} user{inactive.length !== 1 ? "s" : ""} with zero logins in the last 30 days
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {inactive.map(u => {
              const tc = TEAM_COLORS[u.team] || "#94A3B8";
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(231,76,60,0.05)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: 10, padding: "12px 16px", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: tc + "22", border: `1.5px solid ${tc}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: tc, flexShrink: 0 }}>
                      {initials(u.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: theme.text }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: theme.textFaint }}>{u.team} · {u.role}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: theme.textFaint }}>Last seen</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: u.last_login ? "#e74c3c" : theme.textFaint }}>{relativeTime(u.last_login)}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#e74c3c", background: "rgba(231,76,60,0.12)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 20, padding: "3px 10px" }}>
                      Inactive
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: theme.textFaint, fontStyle: "italic" }}>
            Consider reaching out to these users to encourage adoption and gather feedback.
          </div>
        </div>
      )}

      {inactive.length === 0 && (
        <div style={{ background: theme.surfaceBg, border: `1px solid #2ecc7144`, borderTop: `3px solid #2ecc71`, borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24 }}>🎉</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Everyone is active!</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>All users have logged in within the last 30 days.</div>
          </div>
        </div>
      )}
    </div>
  );
}
