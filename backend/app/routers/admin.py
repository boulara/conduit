import logging
from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import inspect as sa_inspect
from ..database import get_db
from ..models import Patient, User, Notification, NotificationReply, CaseNote, AuditLog
from ..auth import require_admin, require_manager_or_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])

TABLE_MAP = {
    "patients":             Patient,
    "users":                User,
    "notifications":        Notification,
    "notification_replies": NotificationReply,
    "case_notes":           CaseNote,
    "audit_logs":           AuditLog,
}

# Fields to redact from admin table dumps
_REDACT = {"password"}


def _row_to_dict(obj):
    d = {}
    for col in sa_inspect(obj.__class__).columns:
        if col.key in _REDACT:
            continue
        val = getattr(obj, col.key)
        if hasattr(val, "isoformat"):
            val = val.isoformat()
        d[col.key] = val
    return d


@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    logs = db.query(AuditLog).order_by(AuditLog.logged_in_at.desc()).limit(500).all()
    return [_row_to_dict(l) for l in logs]


@router.get("/tables")
def list_tables(_admin: User = Depends(require_admin)):
    return list(TABLE_MAP.keys())


@router.get("/engagement")
def get_engagement(
    db: Session = Depends(get_db),
    _: User = Depends(require_manager_or_admin),
):
    """User engagement analytics — logins, notifications, notes per user over last 30 days."""
    now = datetime.utcnow()
    cutoff_30d = now - timedelta(days=30)
    cutoff_7d  = now - timedelta(days=7)

    users        = db.query(User).all()
    recent_logs  = db.query(AuditLog).filter(AuditLog.logged_in_at >= cutoff_30d).all()
    recent_notes = db.query(CaseNote).filter(CaseNote.created_at >= cutoff_30d).all()
    recent_notifs = db.query(Notification).filter(Notification.created_at >= cutoff_30d).all()

    logs_by_user  = defaultdict(list)
    for log in recent_logs:
        logs_by_user[log.user_id].append(log)

    notes_by_user = defaultdict(list)
    for note in recent_notes:
        notes_by_user[note.user_id].append(note)

    # Notifications use from_user (display name), match against user.name
    notifs_by_name = defaultdict(list)
    for n in recent_notifs:
        notifs_by_name[n.from_user].append(n)

    user_stats = []
    for u in users:
        u_logs    = logs_by_user[u.id]
        u_notes   = notes_by_user[u.id]
        u_notifs  = notifs_by_name.get(u.name, [])

        logins_30d = len(u_logs)
        logins_7d  = sum(1 for l in u_logs if l.logged_in_at >= cutoff_7d)
        last_login_30d = max((l.logged_in_at for l in u_logs), default=None)

        # Fall back to all-time last login if no recent activity
        if last_login_30d is None:
            row = db.query(AuditLog).filter(AuditLog.user_id == u.id).order_by(AuditLog.logged_in_at.desc()).first()
            last_login = row.logged_in_at if row else None
        else:
            last_login = last_login_30d

        notifs_30d = len(u_notifs)
        notes_30d  = len(u_notes)
        total_actions = logins_30d + notifs_30d + notes_30d

        status = "active" if logins_30d >= 5 else ("at_risk" if logins_30d >= 1 else "inactive")

        user_stats.append({
            "id":                  u.id,
            "name":                u.name,
            "username":            u.username,
            "team":                u.team,
            "role":                u.role,
            "logins_30d":          logins_30d,
            "logins_7d":           logins_7d,
            "last_login":          last_login.isoformat() if last_login else None,
            "notifications_sent":  notifs_30d,
            "notes_created":       notes_30d,
            "total_actions":       total_actions,
            "status":              status,
        })

    # 30-day login trend (fill every day even if 0)
    trend_map = defaultdict(int)
    for log in recent_logs:
        trend_map[log.logged_in_at.strftime("%Y-%m-%d")] += 1
    login_trend = [
        {"date": (now - timedelta(days=29 - i)).strftime("%Y-%m-%d"),
         "count": trend_map.get((now - timedelta(days=29 - i)).strftime("%Y-%m-%d"), 0)}
        for i in range(30)
    ]

    # Team breakdown
    team_map = defaultdict(lambda: {"logins": 0, "notifications": 0, "notes": 0})
    for stat in user_stats:
        team_map[stat["team"]]["logins"]        += stat["logins_30d"]
        team_map[stat["team"]]["notifications"] += stat["notifications_sent"]
        team_map[stat["team"]]["notes"]         += stat["notes_created"]
    team_breakdown = [{"team": t, **v} for t, v in sorted(team_map.items())]

    active   = [u for u in user_stats if u["status"] == "active"]
    at_risk  = [u for u in user_stats if u["status"] == "at_risk"]
    inactive = [u for u in user_stats if u["status"] == "inactive"]

    return {
        "summary": {
            "total_logins_30d":            sum(u["logins_30d"] for u in user_stats),
            "active_users":                len(active),
            "at_risk_users":               len(at_risk),
            "inactive_users":              len(inactive),
            "total_users":                 len(users),
            "total_notifications_30d":     sum(u["notifications_sent"] for u in user_stats),
            "total_notes_30d":             sum(u["notes_created"] for u in user_stats),
            "avg_logins_per_active_user":  round(sum(u["logins_30d"] for u in active) / len(active), 1) if active else 0,
        },
        "users":          sorted(user_stats, key=lambda u: u["total_actions"], reverse=True),
        "login_trend":    login_trend,
        "team_breakdown": team_breakdown,
    }


@router.get("/tables/{table_name}")
def get_table(
    table_name: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    model = TABLE_MAP.get(table_name)
    if not model:
        raise HTTPException(status_code=404, detail=f"Unknown table: {table_name}")
    rows = db.query(model).limit(2000).all()
    return [_row_to_dict(r) for r in rows]
