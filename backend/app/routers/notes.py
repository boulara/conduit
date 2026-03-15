import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CaseNote, User
from ..schemas import CaseNoteCreate, CaseNoteUpdate, CaseNoteOut
from ..auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/notes", tags=["notes"])

_UPDATABLE_NOTE_FIELDS = {"text", "follow_up_date", "completed_at"}


@router.get("/", response_model=list[CaseNoteOut])
def list_notes(
    patient_id: Optional[int] = None,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db),
    _current: User = Depends(get_current_user),
):
    q = db.query(CaseNote)
    if patient_id:
        q = q.filter(CaseNote.patient_id == patient_id)
    if user_id:
        q = q.filter(CaseNote.user_id == user_id)
    return q.order_by(CaseNote.created_at.desc()).all()


@router.post("/", response_model=CaseNoteOut, status_code=201)
def create_note(
    body: CaseNoteCreate,
    db: Session = Depends(get_db),
    _current: User = Depends(get_current_user),
):
    note = CaseNote(**body.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    logger.info("Note created for patient %s by %s", body.patient_id, body.user_name)
    return note


@router.patch("/{note_id}", response_model=CaseNoteOut)
def update_note(
    note_id: str,
    body: CaseNoteUpdate,
    db: Session = Depends(get_db),
    _current: User = Depends(get_current_user),
):
    note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if k in _UPDATABLE_NOTE_FIELDS}
    for k, v in updates.items():
        setattr(note, k, v)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=204)
def delete_note(
    note_id: str,
    db: Session = Depends(get_db),
    _current: User = Depends(get_current_user),
):
    note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    logger.info("Note %s deleted", note_id)
