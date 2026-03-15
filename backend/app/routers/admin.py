import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import inspect as sa_inspect
from ..database import get_db
from ..models import Patient, User, Notification, NotificationReply, CaseNote, AuditLog
from ..auth import require_admin

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
