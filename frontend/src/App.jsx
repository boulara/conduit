import { useState, useEffect, useRef } from "react";
import { BUCKETS, TEAM_COLORS, assignBuckets, initials, agingColor } from "./constants";
import { AgingBadge, TeamBadge, GLOBAL_STYLES } from "./components/Shared";
import LoginScreen from "./components/LoginScreen";
import PatientDetailPanel from "./components/PatientDetailPanel";
import NotificationCard from "./components/NotificationCard";
import { api } from "./api";

export default function App() {
  const [user, setUser]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem("aaim_user")); } catch { return null; }
  });
  const [patients, setPatients]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch]               = useState("");
  const [filterRegion, setFilterRegion]   = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [view, setView]                   = useState("dashboard");
  const [activeBucket, setActiveBucket]   = useState("all");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [toasts, setToasts]               = useState([]);
  const knownIdsRef = useRef(new Set());
  const userRef     = useRef(user);

  useEffect(() => { userRef.current = user; }, [user]);

  // Load patients once
  useEffect(() => {
    api.getPatients().then(setPatients).catch(console.error);
  }, []);

  // Load notifications initially and poll every 5s
  useEffect(() => {
    const load = async () => {
      const fresh = await api.getNotifications();
      const currentUser = userRef.current;
      if (!currentUser) {
        setNotifications(fresh);
        fresh.forEach(n => knownIdsRef.current.add(n.id));
        return;
      }
      // Detect new notifications for this user's team
      const incoming = fresh.filter(n => !knownIdsRef.current.has(n.id) && n.to_team === currentUser.team);
      if (incoming.length > 0) {
        incoming.forEach(n => {
          const patient = patients.find(p => p.id === n.patient_id);
          const toast = {
            id: n.id + "_toast_" + Date.now(),
            message: `New notification from ${n.from_team}`,
            detail: `${patient?.prescriber || "Unknown patient"} · ${n.priority !== "normal" ? n.priority.toUpperCase() + " · " : ""}${n.comment.slice(0, 60)}${n.comment.length > 60 ? "…" : ""}`,
            color: TEAM_COLORS[n.from_team]?.accent || "#4f8ef7",
          };
          setToasts(prev => [...prev, toast]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 6000);
        });
      }
      fresh.forEach(n => knownIdsRef.current.add(n.id));
      setNotifications(fresh);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [patients]); // re-run when patients load so toast can include prescriber name

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("aaim_user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("aaim_user");
  };

  const handleNotificationUpdate = (updated) => {
    knownIdsRef.current.add(updated.id);
    setNotifications(prev => {
      const idx = prev.findIndex(n => n.id === updated.id);
      if (idx === -1) return [updated, ...prev];
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
    // Also refresh selected patient's panel if open
    if (selectedPatient && updated.patient_id === selectedPatient.id) {
      setSelectedPatient(p => p); // trigger re-render
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const tc = TEAM_COLORS[user.team] || TEAM_COLORS["Home Office"];

  const patientBuckets = new Map(patients.map(p => [p.id, assignBuckets(p)]));

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch  = !search || p.prescriber?.toLowerCase().includes(q) || p.territory?.toLowerCase().includes(q) || p.primary_payer?.toLowerCase().includes(q);
    const matchRegion  = filterRegion  === "All" || p.region        === filterRegion;
    const matchChannel = filterChannel === "All" || p.primary_channel === filterChannel;
    const matchBucket  = patientBuckets.get(p.id)?.has(activeBucket);
    return matchSearch && matchRegion && matchChannel && matchBucket;
  });

  const myInbox     = notifications.filter(n => (n.to_team === user.team && n.status === "pending") || (n.from_team === user.team && n.status === "replied"));
  const myAllNotifs = notifications.filter(n => n.to_team === user.team || n.from_team === user.team);

  const regions  = ["All", ...Array.from(new Set(patients.map(p => p.region).filter(Boolean))).sort()];
  const channels = ["All", ...Array.from(new Set(patients.map(p => p.primary_channel).filter(Boolean))).sort()];

  const avgAging = patients.length ? Math.round(patients.reduce((a, p) => a + p.aging_of_status, 0) / patients.length) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Georgia', serif", color: "#fff" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Toast Notifications */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "all", minWidth: 320, maxWidth: 400, background: "#0f1923", border: `1px solid ${t.color}55`, borderLeft: `4px solid ${t.color}`, borderRadius: 10, padding: "14px 16px", boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${t.color}22`, animation: "slideIn 0.3s ease", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.color + "22", border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🔔</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color, marginBottom: 3 }}>{t.message}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.detail}</div>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
            <span style={{ color: tc.accent }}>AAIM</span> Portal
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["dashboard", "inbox"].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "8px 18px", background: view === v ? "rgba(255,255,255,0.08)" : "none", border: "none", borderRadius: 6, color: view === v ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", position: "relative" }}>
                {v === "inbox" ? "Inbox" : "Dashboard"}
                {v === "inbox" && myInbox.length > 0 && (
                  <>
                    <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: tc.accent, animation: "pulse 1.8s infinite", color: tc.accent }} />
                    <span style={{ marginLeft: 6, background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>{myInbox.length}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TeamBadge team={user.team} size="md" />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: tc.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{initials(user.name)}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user.name}</div>
          <button onClick={handleLogout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: "28px 32px" }}>
        {/* ── DASHBOARD ── */}
        {view === "dashboard" && (
          <>
            {/* Bucket filter bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>Case Stage / Bucket</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BUCKETS.map(b => {
                  const count    = patients.filter(p => patientBuckets.get(p.id)?.has(b.id)).length;
                  const isActive = activeBucket === b.id;
                  return (
                    <button key={b.id} onClick={() => setActiveBucket(b.id)}
                      style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${isActive ? b.color : "rgba(255,255,255,0.1)"}`, background: isActive ? b.color + "22" : "rgba(255,255,255,0.03)", color: isActive ? b.color : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", boxShadow: isActive ? `0 0 12px ${b.color}33` : "none" }}>
                      {b.label}
                      <span style={{ background: isActive ? b.color : "rgba(255,255,255,0.1)", color: isActive ? "#fff" : "rgba(255,255,255,0.5)", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                ["Showing",             filtered.length,                                              "#4f8ef7"],
                ["Active Notifications", notifications.filter(n => n.status === "pending").length,    "#f0a500"],
                ["My Inbox",            myInbox.length,                                               tc.accent],
                ["Avg Aging",           avgAging + "d",                                               agingColor(avgAging)],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${color}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prescriber, territory, payer…"
                style={{ flex: "1 1 240px", padding: "10px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
              <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
                style={{ padding: "10px 14px", background: "#1a2030", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }}>
                {regions.map(r => <option key={r} value={r}>{r === "All" ? "All Regions" : r}</option>)}
              </select>
              <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
                style={{ padding: "10px 14px", background: "#1a2030", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }}>
                {channels.map(c => <option key={c} value={c}>{c === "All" ? "All Channels" : c}</option>)}
              </select>
            </div>

            {/* Patient table */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["Prescriber", "Territory / Region", "SP Partner", "HUB Substatus", "Payer", "Channel", "Aging", "Notifications", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const pNotifs     = notifications.filter(n => n.patient_id === p.id);
                    const pendingCount = pNotifs.filter(n => (n.to_team === user.team && n.status === "pending") || (n.from_team === user.team && n.status === "replied")).length;
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => setSelectedPatient(p)}>
                        <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.prescriber}</td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p.territory}<br /><span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.region}</span></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{p.latest_sp_partner || "—"}</td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 160 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.latest_hub_sub_status || "—"}</div></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 140 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.primary_payer || "—"}</div></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p.primary_channel || "—"}</td>
                        <td style={{ padding: "13px 16px" }}><AgingBadge days={p.aging_of_status} /></td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {pendingCount > 0 && <span style={{ background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>{pendingCount} new</span>}
                            {pNotifs.length > 0 && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{pNotifs.length} total</span>}
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <button onClick={e => { e.stopPropagation(); setSelectedPatient(p); }}
                            style={{ padding: "5px 14px", background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Open →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: "40px 16px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No patients match the current filters</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── INBOX ── */}
        {view === "inbox" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Team Inbox</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Active notifications for <TeamBadge team={user.team} /> — acknowledge to clear, reply to continue the thread
              </div>
            </div>

            {myInbox.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>All caught up</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>No notifications need your attention right now</div>
              </div>
            ) : (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: tc.accent, textTransform: "uppercase", fontWeight: 700 }}>Needs Your Action</div>
                  <span style={{ background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 8px" }}>{myInbox.length}</span>
                </div>
                {myInbox.map(n => {
                  const patient = patients.find(p => p.id === n.patient_id);
                  const isReply = n.from_team === user.team && n.status === "replied";
                  return (
                    <div key={n.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{patient?.prescriber || n.patient_name}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>·</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{patient?.territory}</span>
                        {isReply && <span style={{ fontSize: 10, color: "#4f8ef7", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", borderRadius: 4, padding: "1px 7px", fontWeight: 700 }}>REPLY RECEIVED</span>}
                      </div>
                      <NotificationCard notification={n} currentUser={user} onUpdate={handleNotificationUpdate} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* All activity (collapsed) */}
            {myAllNotifs.length > 0 && (
              <div>
                <button onClick={() => setShowAllActivity(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: showAllActivity ? "10px 10px 0 0" : 10, padding: "13px 18px", cursor: "pointer" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>All Activity</span>
                  <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{myAllNotifs.length}</span>
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{showAllActivity ? "▲" : "▼"}</span>
                </button>
                {showAllActivity && (
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 18px" }}>
                    {myAllNotifs.map(n => {
                      const patient = patients.find(p => p.id === n.patient_id);
                      return (
                        <div key={n.id} style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                            {patient?.prescriber || n.patient_name} · {patient?.territory}
                          </div>
                          <NotificationCard notification={n} currentUser={user} onUpdate={handleNotificationUpdate} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient detail modal */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          currentUser={user}
          notifications={notifications}
          onNewNotification={handleNotificationUpdate}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
