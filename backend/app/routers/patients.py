from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Patient
from ..schemas import PatientOut

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("/", response_model=list[PatientOut])
def list_patients(
    search: str = Query(default=""),
    region: str = Query(default="All"),
    channel: str = Query(default="All"),
    db: Session = Depends(get_db),
):
    q = db.query(Patient)
    if search:
        like = f"%{search}%"
        q = q.filter(
            Patient.prescriber.ilike(like)
            | Patient.territory.ilike(like)
            | Patient.primary_payer.ilike(like)
        )
    if region and region != "All":
        q = q.filter(Patient.region == region)
    if channel and channel != "All":
        q = q.filter(Patient.primary_channel == channel)
    return q.all()


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Patient).filter(Patient.id == patient_id).first()
