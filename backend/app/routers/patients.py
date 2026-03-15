import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Patient
from ..schemas import PatientOut, PatientUpdate, PatientCreate, BulkResult

logger = logging.getLogger(__name__)

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


@router.post("/bulk", response_model=BulkResult)
def bulk_create_patients(body: list[PatientCreate], db: Session = Depends(get_db)):
    created = 0
    errors = []
    for p in body:
        try:
            db.add(Patient(**p.model_dump()))
            db.commit()
            created += 1
        except Exception as e:
            db.rollback()
            errors.append(f"{p.prescriber}: {str(e)}")
    logger.info("Bulk patient import: %d created, %d errors", created, len(errors))
    return {"created": created, "skipped": 0, "errors": errors}


@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.patch("/{patient_id}", response_model=PatientOut)
def update_patient(patient_id: int, body: PatientUpdate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(patient, k, v)
    db.commit()
    db.refresh(patient)
    logger.info("Patient %s updated", patient_id)
    return patient


@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    logger.info("Patient %s deleted", patient_id)
