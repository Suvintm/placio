from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ....db.session import get_session
from ..deps import get_current_college
from ....models.user import (
    User, Job, AptitudeTest, PlacementRequest, CollegeProfile, 
    RequestStatus, CompanyProfile, Question
)

router = APIRouter()

@router.get("/profile")
def get_college_profile(
    current_college: User = Depends(get_current_college)
) -> Any:
    if not current_college.college_profile:
        raise HTTPException(status_code=404, detail="College profile not found")
        
    return {
        "user": {
            "email": current_college.email,
            "full_name": current_college.full_name,
            "role": current_college.role
        },
        "profile": current_college.college_profile
    }

@router.get("/requests")
def get_placement_requests(
    db: Session = Depends(get_session),
    current_college: User = Depends(get_current_college)
) -> Any:
    if not current_college.college_profile:
        raise HTTPException(status_code=400, detail="College profile not found")
        
    # Join with CompanyProfile and Job to get full details
    statement = (
        select(PlacementRequest, CompanyProfile, Job)
        .join(CompanyProfile, PlacementRequest.company_id == CompanyProfile.id)
        .join(Job, PlacementRequest.job_id == Job.id)
        .where(PlacementRequest.college_id == current_college.college_profile.id)
    )
    results = db.exec(statement).all()
    
    requests_data = []
    for request, company, job in results:
        requests_data.append({
            "id": request.id,
            "status": request.status,
            "message": request.message,
            "created_at": request.created_at,
            "company": company,
            "job": job,
            "test_id": request.test_id
        })
        
    return requests_data

@router.get("/jobs/{job_id}")
def get_job_details(
    *,
    db: Session = Depends(get_session),
    job_id: int,
    current_college: User = Depends(get_current_college)
) -> Any:
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get company profile for this job
    company = db.get(CompanyProfile, job.company_id)
    
    # Check if there is an associated test for this job in ANY request to this college
    # Or more simply, if the college was sent a request for this job, they should see the test
    statement = select(PlacementRequest).where(
        PlacementRequest.job_id == job_id,
        PlacementRequest.college_id == current_college.college_profile.id
    )
    request = db.exec(statement).first()
    
    test_data = None
    if request and request.test_id:
        test = db.get(AptitudeTest, request.test_id)
        if test:
            questions = db.exec(select(Question).where(Question.test_id == test.id)).all()
            test_data = {
                **test.model_dump(),
                "questions_count": len(questions)
            }

    return {
        "job": job,
        "company": company,
        "test": test_data
    }

@router.patch("/requests/{request_id}/status")
def update_request_status(
    *,
    db: Session = Depends(get_session),
    request_id: int,
    status: RequestStatus,
    current_college: User = Depends(get_current_college)
) -> Any:
    request = db.get(PlacementRequest, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    if request.college_id != current_college.college_profile.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    request.status = status
    db.add(request)
    db.commit()
    db.refresh(request)
    return request
