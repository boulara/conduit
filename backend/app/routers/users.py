from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserOut, LoginRequest

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/login", response_model=UserOut)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == body.username,
        User.password == body.password,
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user
