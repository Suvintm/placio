from fastapi import APIRouter
from .endpoints import auth, company, college, student

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(company.router, prefix="/company", tags=["company"])
api_router.include_router(college.router, prefix="/college", tags=["college"])
api_router.include_router(student.router, prefix="/student", tags=["student"])
