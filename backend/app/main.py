import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base
from .routers import patients, notifications, users
from . import seed as seeder


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seeder.run()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(patients.router)
app.include_router(notifications.router)
app.include_router(users.router)

# Serve the built React frontend if it exists
static_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static")
if os.path.isdir(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        return FileResponse(os.path.join(static_dir, "index.html"))
