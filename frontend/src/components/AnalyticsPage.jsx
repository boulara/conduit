import { useTheme } from "../ThemeContext";
import { useIsMobile } from "../useIsMobile";
import { BUCKETS, agingColor, assignBuckets } from "../constants";

function Bar({ label, value, max, color, sublabel }) {
  const theme = useTheme();
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: theme.text, fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {sublabel && <span style={{ fontSize: 11, color: theme.textFaint }}>{sublabel}</span>}
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
        </div>
      </div>
      <div style={{ height: 8, background: theme.inputBg, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function Card({ title, children, style = {} }) {
  const theme = useTheme();
  return (
    <div style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "20px 22px", ...style }}>
      <div style={{ fontSize: 11, letterSpacing: 2, color: theme.textFaint, textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function StatRow({ label, value, color }) {
  const theme = useTheme();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
      <span style={{ fontSize: 13, color: theme.textMuted }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: color || "#4f8ef7" }}>{value}</span>
    </div>
  );
}

export default function AnalyticsPage({ patients, notifications, currentUser }) {
  const theme    = useTheme();
  const isMobile = useIsMobile();

  if (!patients.length) {
    return <div style={{ textAlign: "center", padding: "60px 0", color: theme.textFaint }}>Loading analytics…</div>;
  }

  // ── Aging breakdown
  const agingGreen  = patients.filter(p => p.aging_of_status < 10).length;
  const agingYellow = patients.filter(p => p.aging_of_status >= 10 && p.aging_of_status < 20).length;
  const agingRed    = patients.filter(p => p.aging_of_status >= 20).length;
  const avgAging    = Math.round(patients.reduce((a, p) => a + p.aging_of_status, 0) / patients.length);
  const maxAging    = Math.max(...patients.map(p => p.aging_of_status));

  // ── By region
  const regionMap = {};
  patients.forEach(p => { if (p.region) regionMap[p.region] = (regionMap[p.region] || 0) + 1; });
  const regions = Object.entries(regionMap).sort((a, b) => b[1] - a[1]);

  // ── By channel
  const channelMap = {};
  patients.forEach(p => { if (p.primary_channel) channelMap[p.primary_channel] = (channelMap[p.primary_channel] || 0) + 1; });
  const channels = Object.entries(channelMap).sort((a, b) => b[1] - a[1]);

  // ── By SP partner
  const spMap = {};
  patients.forEach(p => { if (p.latest_sp_partner) spMap[p.latest_sp_partner] = (spMap[p.latest_sp_partner] || 0) + 1; });
  const spPartners = Object.entries(spMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // ── By payer
  const payerMap = {};
  patients.forEach(p => { if (p.primary_payer) payerMap[p.primary_payer] = (payerMap[p.primary_payer] || 0) + 1; });
  const payers = Object.entries(payerMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // ── Bucket counts (excluding "all")
  const bucketCounts = {};
  patients.forEach(p => {
    const bs = assignBuckets(p);
    bs.forEach(b => { if (b !== "all") bucketCounts[b] = (bucketCounts[b] || 0) + 1; });
  });
  const bucketRows = BUCKETS.filter(b => b.id !== "all").map(b => ({ ...b, count: bucketCounts[b.id] || 0 })).sort((a, b) => b.count - a.count);
  const maxBucket  = Math.max(...bucketRows.map(b => b.count), 1);

  // ── Notification stats
  const myNotifs     = notifications.filter(n => n.to_team === currentUser.team || n.from_team === currentUser.team);
  const pending      = notifications.filter(n => n.status === "pending").length;
  const acknowledged = notifications.filter(n => n.status === "acknowledged").length;
  const replied      = notifications.filter(n => n.status === "replied").length;
  const totalNotifs  = notifications.length;

  // ── Language breakdown
  const langMap = {};
  patients.forEach(p => { if (p.language) langMap[p.language] = (langMap[p.language] || 0) + 1; });
  const languages = Object.entries(langMap).sort((a, b) => b[1] - a[1]);

  const REGION_COLORS  = ["#4f8ef7", "#34d399", "#a78bfa", "#f472b6", "#fb923c", "#2dd4bf"];
  const CHANNEL_COLORS = ["#4f8ef7", "#2ecc71", "#f0a500", "#e056b0", "#34d399", "#fb923c"];
  const SP_COLORS      = ["#4f8ef7", "#a78bfa", "#34d399", "#f472b6", "#fb923c", "#2dd4bf", "#f0a500", "#818cf8"];
  const PAYER_COLORS   = ["#4f8ef7", "#34d399", "#f0a500", "#e056b0", "#a78bfa", "#fb923c", "#2dd4bf", "#f87171"];

  const cols = isMobile ? "1fr" : "1fr 1fr";

  return (
    <div>
      <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, marginBottom: 4, color: theme.text }}>Analytics</div>
      <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 24 }}>{patients.length} patients · {notifications.length} total notifications</div>

      {/* Top KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Patients",      value: patients.length,  color: "#4f8ef7" },
          { label: "Avg Aging (days)",    value: avgAging,         color: agingColor(avgAging) },
          { label: "Active Notifs",       value: pending,          color: "#f0a500" },
          { label: "Resolution Rate",     value: totalNotifs > 0 ? Math.round(((acknowledged + replied) / totalNotifs) * 100) + "%" : "—", color: "#2ecc71" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: theme.surfaceBg, border: `1px solid ${theme.border}`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: isMobile ? "14px 16px" : "18px 20px" }}>
            <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4, letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16, marginBottom: 16 }}>
        {/* Aging breakdown */}
        <Card title="Aging Distribution">
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[
              { label: "< 10 days",   value: agingGreen,  color: "#2ecc71" },
              { label: "10–20 days",  value: agingYellow, color: "#f0a500" },
              { label: "20+ days",    value: agingRed,    color: "#e74c3c" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ flex: 1, background: color + "15", border: `1px solid ${color}44`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2, letterSpacing: 0.3 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: theme.textFaint, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Longest aging cases</div>
          {patients
            .slice()
            .sort((a, b) => b.aging_of_status - a.aging_of_status)
            .slice(0, 5)
            .map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 12, color: theme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>{p.prescriber}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: agingColor(p.aging_of_status), flexShrink: 0 }}>{p.aging_of_status}d</span>
              </div>
            ))}
        </Card>

        {/* Notification stats */}
        <Card title="Notification Status">
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[
              { label: "Pending",      value: pending,      color: "#f0a500" },
              { label: "Replied",      value: replied,      color: "#4f8ef7" },
              { label: "Acknowledged", value: acknowledged, color: "#2ecc71" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ flex: 1, background: color + "15", border: `1px solid ${color}44`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2, letterSpacing: 0.3 }}>{label}</div>
              </div>
            ))}
          </div>
          <StatRow label="Total notifications"     value={totalNotifs} />
          <StatRow label="For my team"             value={myNotifs.length} color={theme.text} />
          <StatRow label="Pending resolution"      value={pending}     color="#f0a500" />
          <StatRow label="Resolution rate"         value={totalNotifs > 0 ? Math.round(((acknowledged + replied) / totalNotifs) * 100) + "%" : "—"} color="#2ecc71" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16, marginBottom: 16 }}>
        {/* Case Stage breakdown */}
        <Card title="Cases by Stage">
          {bucketRows.map(b => (
            <Bar key={b.id} label={b.label} value={b.count} max={maxBucket} color={b.color} />
          ))}
        </Card>

        {/* Region breakdown */}
        <Card title="Cases by Region">
          {regions.map(([region, count], i) => (
            <Bar key={region} label={region} value={count} max={patients.length} color={REGION_COLORS[i % REGION_COLORS.length]} sublabel={`${Math.round((count / patients.length) * 100)}%`} />
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16, marginBottom: 16 }}>
        {/* SP Partner breakdown */}
        <Card title="Top SP Partners">
          {spPartners.length === 0
            ? <div style={{ color: theme.textFaint, fontSize: 13 }}>No SP partner data</div>
            : spPartners.map(([sp, count], i) => (
              <Bar key={sp} label={sp} value={count} max={patients.length} color={SP_COLORS[i % SP_COLORS.length]} sublabel={`${Math.round((count / patients.length) * 100)}%`} />
            ))}
        </Card>

        {/* Channel breakdown */}
        <Card title="Primary Channel">
          {channels.map(([ch, count], i) => (
            <Bar key={ch} label={ch} value={count} max={patients.length} color={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} sublabel={`${Math.round((count / patients.length) * 100)}%`} />
          ))}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16 }}>
        {/* Top payers */}
        <Card title="Top Payers">
          {payers.length === 0
            ? <div style={{ color: theme.textFaint, fontSize: 13 }}>No payer data</div>
            : payers.map(([payer, count], i) => (
              <Bar key={payer} label={payer} value={count} max={patients.length} color={PAYER_COLORS[i % PAYER_COLORS.length]} sublabel={`${Math.round((count / patients.length) * 100)}%`} />
            ))}
        </Card>

        {/* Language breakdown */}
        <Card title="Patient Language">
          {languages.length === 0
            ? <div style={{ color: theme.textFaint, fontSize: 13 }}>No language data</div>
            : languages.map(([lang, count], i) => (
              <Bar key={lang} label={lang} value={count} max={patients.length} color={REGION_COLORS[i % REGION_COLORS.length]} sublabel={`${Math.round((count / patients.length) * 100)}%`} />
            ))}
        </Card>
      </div>
    </div>
  );
}
