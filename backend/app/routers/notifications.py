from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Notification, NotificationReply, Patient
from ..schemas import NotificationOut, NotificationCreate, NotificationUpdate, ReplyCreate

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


def enrich(n: Notification) -> dict:
    data = NotificationOut.model_validate(n).model_dump()
    data["patient_name"] = n.patient.prescriber if n.patient else None
    return data


@router.get("/")
def list_notifications(db: Session = Depends(get_db)):
    notifs = (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [enrich(n) for n in notifs]


@router.post("/", status_code=201)
def create_notification(body: NotificationCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == body.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    n = Notification(
        patient_id=body.patient_id,
        from_team=body.from_team,
        from_user=body.from_user,
        to_team=body.to_team,
        comment=body.comment,
        priority=body.priority,
    )
    db.add(n)
    db.commit()
    db.refresh(n)
    return enrich(n)


@router.patch("/{notification_id}")
def update_notification(
    notification_id: str,
    body: NotificationUpdate,
    db: Session = Depends(get_db),
):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    if body.status:
        n.status = body.status
    if body.status == "acknowledged":
        n.acknowledged_at = datetime.utcnow()
        n.acknowledged_by = body.acknowledged_by
    db.commit()
    db.refresh(n)
    return enrich(n)


@router.post("/{notification_id}/replies", status_code=201)
def add_reply(
    notification_id: str,
    body: ReplyCreate,
    db: Session = Depends(get_db),
):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    reply = NotificationReply(
        notification_id=notification_id,
        text=body.text,
        from_user=body.from_user,
        from_team=body.from_team,
    )
    db.add(reply)
    # If recipient replies, mark as "replied"; sender reply keeps as pending
    if body.from_team == n.to_team:
        n.status = "replied"
    db.commit()
    db.refresh(n)
    return enrich(n)
