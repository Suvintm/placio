from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ....db.session import get_session
from ..deps import get_current_student
from ....models.user import (
    User, Job, AptitudeTest, PlacementRequest, CollegeProfile, 
    RequestStatus, CompanyProfile, Question, Application, ApplicationStatus
)

router = APIRouter()

@router.get("/profile")
def get_student_profile(
    current_student: User = Depends(get_current_student)
) -> Any:
    if not current_student.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    return {
        "user": {
            "email": current_student.email,
            "full_name": current_student.full_name,
            "role": current_student.role
        },
        "profile": current_student.student_profile
    }

@router.get("/jobs")
def get_published_jobs(
    db: Session = Depends(get_session),
    current_student: User = Depends(get_current_student)
) -> Any:
    if not current_student.student_profile:
        raise HTTPException(status_code=400, detail="Student profile not found")
        
    # Get college profile based on student's college_code
    college_statement = select(CollegeProfile).where(CollegeProfile.aishe_code == current_student.student_profile.college_code.strip())
    college = db.exec(college_statement).first()
    
    if not college:
        return []

    # Get all requests with status PUBLISHED for this college
    statement = (
        select(PlacementRequest, CompanyProfile, Job)
        .join(CompanyProfile, PlacementRequest.company_id == CompanyProfile.id)
        .join(Job, PlacementRequest.job_id == Job.id)
        .where(PlacementRequest.college_id == college.id)
        .where(PlacementRequest.status == RequestStatus.PUBLISHED)
    )
    results = db.exec(statement).all()
    
    # Check which jobs student has already applied to
    applied_statement = select(Application).where(Application.student_id == current_student.student_profile.id)
    applications = db.exec(applied_statement).all()
    applied_job_ids = [app.job_id for app in applications]

    jobs_data = []
    for request, company, job in results:
        jobs_data.append({
            "request_id": request.id,
            "job": job,
            "company": company,
            "has_applied": job.id in applied_job_ids,
            "test_id": request.test_id
        })
        
    return jobs_data

@router.post("/jobs/{job_id}/apply")
def apply_to_job(
    *,
    db: Session = Depends(get_session),
    job_id: int,
    request_id: int, # The specific placement request ID
    current_student: User = Depends(get_current_student)
) -> Any:
    if not current_student.student_profile:
        raise HTTPException(status_code=400, detail="Student profile not found")
        
    # Check if already applied
    existing = db.exec(select(Application).where(
        Application.student_id == current_student.student_profile.id,
        Application.job_id == job_id
    )).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
        
    application = Application(
        student_id=current_student.student_profile.id,
        job_id=job_id,
        request_id=request_id,
        status=ApplicationStatus.APPLIED
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/jobs/{job_id}")
def get_job_details(
    *,
    db: Session = Depends(get_session),
    job_id: int,
    request_id: int, # Need request_id to identify the specific drive
    current_student: User = Depends(get_current_student)
) -> Any:
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    company = db.get(CompanyProfile, job.company_id)
    
    # Check application status
    application = db.exec(select(Application).where(
        Application.student_id == current_student.student_profile.id,
        Application.job_id == job_id
    )).first()
    
    # Get test info if any
    request = db.get(PlacementRequest, request_id)
    test_data = None
    if request and request.test_id:
        test = db.get(AptitudeTest, request.test_id)
        if test:
            test_data = {
                "id": test.id,
                "title": test.title,
                "description": test.description
            }

    return {
        "job": job,
        "company": company,
        "application": application,
        "test": test_data
    }
