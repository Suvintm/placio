import traceback
import sys
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.api import api_router
from .db.session import create_db_and_tables
from .core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Placio - College Placement Management System",
    version="0.1.0",
)

# Exception Handler to debug 500 errors
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    print(f"ERROR: {exc}", file=sys.stderr)
    traceback.print_exc()
    response = JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )
    # Manually add CORS headers for exception responses
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Initialize Database on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Temporarily allow all for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Placio API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
