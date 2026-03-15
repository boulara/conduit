"""
Tests for the shareable analytics report endpoints.
Run from backend/: pytest tests/
"""


def test_create_share_link_requires_auth(client):
    r = client.post("/api/reports/share")
    assert r.status_code == 401


def test_create_share_link(client, auth_headers):
    r = client.post("/api/reports/share", headers=auth_headers)
    assert r.status_code == 201
    data = r.json()
    assert "token" in data
    assert "expires_at" in data
    assert len(data["token"]) > 0


def test_get_shared_report(client, auth_headers):
    token = client.post("/api/reports/share", headers=auth_headers).json()["token"]
    r = client.get(f"/api/reports/{token}")
    assert r.status_code == 200
    data = r.json()
    assert "patients" in data
    assert "notifications" in data
    assert "expires_at" in data


def test_get_shared_report_is_public(client, auth_headers):
    """No auth headers required to read a shared report."""
    token = client.post("/api/reports/share", headers=auth_headers).json()["token"]
    r = client.get(f"/api/reports/{token}")  # no auth headers
    assert r.status_code == 200


def test_get_shared_report_not_found(client):
    r = client.get("/api/reports/nonexistent-token")
    assert r.status_code == 404


def test_expired_share_link_returns_410(client, auth_headers):
    """Manually expire a token and confirm 410 is returned."""
    from datetime import datetime, timedelta
    from sqlalchemy.orm import Session
    from app.models import SharedReport

    # Create a token
    token = client.post("/api/reports/share", headers=auth_headers).json()["token"]

    # Reach into the test DB and backdate expires_at
    from app.database import get_db
    db: Session = next(client.app.dependency_overrides[get_db]())
    report = db.query(SharedReport).filter(SharedReport.id == token).first()
    report.expires_at = datetime.utcnow() - timedelta(seconds=1)
    db.commit()
    db.close()

    r = client.get(f"/api/reports/{token}")
    assert r.status_code == 410
    assert "expired" in r.json()["detail"].lower()
