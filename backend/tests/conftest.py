import os

# Must be set before any app module is imported so database.py picks up SQLite
os.environ["DATABASE_URL"] = "sqlite:///./test_conduit.db"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models import User
from app.auth import hash_password

TEST_DB_URL = "sqlite:///./test_conduit.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(bind=test_engine, autocommit=False, autoflush=False)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    # Seed a default admin directly — bypasses auth chicken-and-egg
    db = TestingSession()
    # Use nick.milero — it's in SUPERADMINS so the startup migration won't demote it
    db.add(User(
        id="seed-admin",
        username="nick.milero",
        password=hash_password("adminpass"),
        name="Nick Milero",
        team="Home Office",
        role="admin",
    ))
    db.commit()
    db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=True) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_headers():
    """X-User-ID headers for the pre-seeded admin account."""
    return {"X-User-ID": "seed-admin"}


@pytest.fixture()
def test_user(client, auth_headers):
    r = client.post("/api/users/", json={
        "username": "test.user",
        "password": "pass123",
        "name": "Test User",
        "team": "NCM",
        "role": "partner",
    }, headers=auth_headers)
    assert r.status_code == 201, r.text
    return r.json()


@pytest.fixture()
def test_patient(client, auth_headers):
    r = client.post("/api/patients/bulk", json=[{
        "prescriber": "Dr. Test Patient",
        "aging_of_status": 5,
        "region": "Southeast",
        "primary_channel": "Commercial",
    }], headers=auth_headers)
    assert r.status_code == 200, r.text
    patients = client.get("/api/patients/", headers=auth_headers).json()
    return patients[0]
