"""
Security-focused tests: auth enforcement, admin gating, password hashing, input validation.
Run from backend/: pytest tests/
"""


# ── unauthenticated access is rejected ─────────────────────────────────────────

def test_patients_requires_auth(client):
    r = client.get("/api/patients/")
    assert r.status_code == 401


def test_notifications_requires_auth(client):
    r = client.get("/api/notifications/")
    assert r.status_code == 401


def test_notes_requires_auth(client):
    r = client.get("/api/notes/")
    assert r.status_code == 401


def test_users_list_requires_auth(client):
    r = client.get("/api/users/")
    assert r.status_code == 401


def test_admin_audit_logs_requires_auth(client):
    r = client.get("/api/admin/audit-logs")
    assert r.status_code == 401


def test_admin_table_viewer_requires_auth(client):
    r = client.get("/api/admin/tables/users")
    assert r.status_code == 401


# ── non-admin is blocked from admin routes ─────────────────────────────────────

def test_admin_audit_logs_blocked_for_partner(client, auth_headers, test_user):
    partner_headers = {"X-User-ID": test_user["id"]}
    r = client.get("/api/admin/audit-logs", headers=partner_headers)
    assert r.status_code == 403


def test_admin_table_viewer_blocked_for_partner(client, auth_headers, test_user):
    partner_headers = {"X-User-ID": test_user["id"]}
    r = client.get("/api/admin/tables/users", headers=partner_headers)
    assert r.status_code == 403


# ── password hashing ───────────────────────────────────────────────────────────

def test_password_is_hashed_in_db(client, auth_headers):
    """Passwords returned in admin table dump must not be plain text."""
    client.post("/api/users/", json={
        "username": "hashtest.user",
        "password": "supersecret",
        "name": "Hash Test",
        "team": "NCM",
        "role": "partner",
    }, headers=auth_headers)
    rows = client.get("/api/admin/tables/users", headers=auth_headers).json()
    hash_test = next((r for r in rows if r.get("username") == "hashtest.user"), None)
    assert hash_test is not None
    # Password column must be redacted from admin table output
    assert "password" not in hash_test


def test_wrong_password_returns_401(client):
    r = client.post("/api/users/login", json={"username": "seed.admin", "password": "wrongpassword"})
    assert r.status_code == 401


def test_correct_password_returns_user(client):
    r = client.post("/api/users/login", json={"username": "nick.milero", "password": "adminpass"})
    assert r.status_code == 200
    data = r.json()
    assert data["username"] == "nick.milero"
    assert "password" not in data


# ── invalid X-User-ID is rejected ──────────────────────────────────────────────

def test_invalid_session_id_rejected(client):
    r = client.get("/api/patients/", headers={"X-User-ID": "not-a-real-id"})
    assert r.status_code == 401


# ── status/priority enum validation ────────────────────────────────────────────

def test_invalid_notification_status_rejected(client, auth_headers, test_patient):
    # Create a notification first
    n = client.post("/api/notifications/", json={
        "patient_id": test_patient["id"],
        "from_team": "NCM",
        "from_user": "Test User",
        "to_team": "SP",
        "comment": "Test comment",
        "priority": "normal",
    }, headers=auth_headers).json()

    r = client.patch(f"/api/notifications/{n['id']}",
                     json={"status": "hacked"},
                     headers=auth_headers)
    assert r.status_code == 400


def test_invalid_notification_priority_rejected(client, auth_headers, test_patient):
    r = client.post("/api/notifications/", json={
        "patient_id": test_patient["id"],
        "from_team": "NCM",
        "from_user": "Test User",
        "to_team": "SP",
        "comment": "Test comment",
        "priority": "critical",  # not a valid priority
    }, headers=auth_headers)
    assert r.status_code == 400


# ── login endpoint ─────────────────────────────────────────────────────────────

def test_login_nonexistent_user_returns_401(client):
    r = client.post("/api/users/login", json={"username": "nobody", "password": "pass"})
    assert r.status_code == 401


def test_login_response_excludes_password(client):
    r = client.post("/api/users/login", json={"username": "nick.milero", "password": "adminpass"})
    assert r.status_code == 200
    assert "password" not in r.json()
