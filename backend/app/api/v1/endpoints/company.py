from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import uuid

from ....db.session import get_session
from ..deps import get_current_company
from ....models.user import (
    User, Job, JobCreate, AptitudeTest, TestCreate, Question, 
    CollegeProfile, PlacementRequest, PlacementRequestCreate
)

router = APIRouter()

@router.post("/jobs", response_model=Job)
def create_job(
    *,
    db: Session = Depends(get_session),
    job_in: JobCreate,
    current_company: User = Depends(get_current_company)
) -> Any:
    # A User with role COMPANY has a company_profile
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    job = Job(
        job_id=f"JOB-{uuid.uuid4().hex[:8].upper()}",
        company_id=current_company.company_profile.id,
        title=job_in.title,
        description=job_in.description,
        skills_required=job_in.skills_required,
        eligibility_criteria=job_in.eligibility_criteria
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs", response_model=List[Job])
def get_jobs(
    db: Session = Depends(get_session),
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        return []
    
    jobs = db.exec(select(Job).where(Job.company_id == current_company.company_profile.id)).all()
    return jobs

@router.post("/tests", response_model=AptitudeTest)
def create_test(
    *,
    db: Session = Depends(get_session),
    test_in: TestCreate,
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    test = AptitudeTest(
        company_id=current_company.company_profile.id,
        title=test_in.title,
        description=test_in.description
    )
    db.add(test)
    db.commit()
    db.refresh(test)
    
    for q_in in test_in.questions:
        question = Question(
            test_id=test.id,
            question_text=q_in.question_text,
            options=q_in.options,
            correct_answer=q_in.correct_answer
        )
        db.add(question)
        
    db.commit()
    return test

@router.get("/tests", response_model=List[AptitudeTest])
def get_tests(
    db: Session = Depends(get_session),
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        return []
    
    tests = db.exec(select(AptitudeTest).where(AptitudeTest.company_id == current_company.company_profile.id)).all()
    return tests

@router.get("/tests/{test_id}")
def get_test_details(
    *,
    db: Session = Depends(get_session),
    test_id: int,
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    test = db.get(AptitudeTest, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    if test.company_id != current_company.company_profile.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    questions = db.exec(select(Question).where(Question.test_id == test_id)).all()
    
    return {
        **test.model_dump(),
        "questions": questions
    }

@router.get("/colleges", response_model=List[CollegeProfile])
def get_colleges(
    db: Session = Depends(get_session),
    current_company: User = Depends(get_current_company)
) -> Any:
    colleges = db.exec(select(CollegeProfile)).all()
    return colleges

@router.post("/requests", response_model=PlacementRequest)
def create_request(
    *,
    db: Session = Depends(get_session),
    request_in: PlacementRequestCreate,
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    request = PlacementRequest(
        company_id=current_company.company_profile.id,
        college_id=request_in.college_id,
        job_id=request_in.job_id,
        test_id=request_in.test_id,
        message=request_in.message
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

@router.get("/requests", response_model=List[PlacementRequest])
def get_requests(
    db: Session = Depends(get_session),
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        return []
    
    requests = db.exec(select(PlacementRequest).where(PlacementRequest.company_id == current_company.company_profile.id)).all()
    return requests

@router.put("/jobs/{job_id}", response_model=Job)
def update_job(
    *,
    db: Session = Depends(get_session),
    job_id: int,
    job_in: JobCreate,
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.company_id != current_company.company_profile.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    job.title = job_in.title
    job.description = job_in.description
    job.skills_required = job_in.skills_required
    job.eligibility_criteria = job_in.eligibility_criteria
    
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.put("/tests/{test_id}", response_model=AptitudeTest)
def update_test(
    *,
    db: Session = Depends(get_session),
    test_id: int,
    test_in: TestCreate,
    current_company: User = Depends(get_current_company)
) -> Any:
    if not current_company.company_profile:
        raise HTTPException(status_code=400, detail="Company profile not found")
        
    test = db.get(AptitudeTest, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    if test.company_id != current_company.company_profile.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    test.title = test_in.title
    test.description = test_in.description
    db.add(test)
    
    # Delete existing questions
    existing_questions = db.exec(select(Question).where(Question.test_id == test_id)).all()
    for q in existing_questions:
        db.delete(q)
        
    # Add new questions
    for q_in in test_in.questions:
        question = Question(
            test_id=test.id,
            question_text=q_in.question_text,
            options=q_in.options,
            correct_answer=q_in.correct_answer
        )
        db.add(question)
        
    db.commit()
    db.refresh(test)
    return test
