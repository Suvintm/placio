from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select

from ....db.session import get_session
from ....models.user import (
    User, UserRead, Token, 
    StudentProfile, CollegeProfile, CompanyProfile, UserRole,
    StudentCreate, CollegeCreate, CompanyCreate
)
from ....core import security
from ....core.config import settings

router = APIRouter()

def _create_core_user(user_in, role: UserRole, db: Session) -> User:
    user = db.exec(select(User).where(User.email == user_in.email)).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    db_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=role,
        is_active=user_in.is_active,
        is_superuser=user_in.is_superuser,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/signup/student", response_model=UserRead)
def signup_student(user_in: StudentCreate, db: Session = Depends(get_session)) -> Any:
    db_user = _create_core_user(user_in, UserRole.STUDENT, db)
    try:
        profile = StudentProfile(
            user_id=db_user.id,
            college_code=user_in.college_code,
            branch=user_in.branch,
            batch_year=user_in.batch_year,
            cgpa=user_in.cgpa,
            skills=user_in.skills
        )
        db.add(profile)
        db.commit()
    except Exception as e:
        print(f"Error creating profile: {e}")
        pass
    return db_user

@router.post("/signup/college", response_model=UserRead)
def signup_college(user_in: CollegeCreate, db: Session = Depends(get_session)) -> Any:
    db_user = _create_core_user(user_in, UserRole.COLLEGE, db)
    try:
        profile = CollegeProfile(
            user_id=db_user.id,
            institution_name=user_in.institution_name,
            aishe_code=user_in.aishe_code or f"REG-{db_user.id}",
            university=user_in.university or "Not Specified",
            website=user_in.website,
            naac_grade=user_in.naac_grade,
            campus_address=user_in.campus_address,
            city=user_in.city,
            state=user_in.state,
            tpo_name=db_user.full_name,
            tpo_phone=user_in.tpo_phone,
            tpo_designation=user_in.tpo_designation
        )
        db.add(profile)
        db.commit()
    except Exception as e:
        print(f"Error creating profile: {e}")
        pass
    return db_user

@router.post("/signup/company", response_model=UserRead)
def signup_company(user_in: CompanyCreate, db: Session = Depends(get_session)) -> Any:
    db_user = _create_core_user(user_in, UserRole.COMPANY, db)
    try:
        profile = CompanyProfile(
            user_id=db_user.id,
            company_name=user_in.company_name,
            industry=user_in.industry,
            website=user_in.website,
            hr_name=db_user.full_name,
            hr_phone=user_in.hr_phone,
            hr_designation=user_in.hr_designation
        )
        db.add(profile)
        db.commit()
    except Exception as e:
        print(f"Error creating profile: {e}")
        pass
    return db_user

def _login(db: Session, form_data: OAuth2PasswordRequestForm, expected_role: UserRole) -> Any:
    user = db.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.role != expected_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account does not have {expected_role} access.",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": user
    }
    return jsonable_encoder(token_data)

@router.post("/login/student", response_model=Token)
def login_student(db: Session = Depends(get_session), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    return _login(db, form_data, UserRole.STUDENT)

@router.post("/login/college", response_model=Token)
def login_college(db: Session = Depends(get_session), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    return _login(db, form_data, UserRole.COLLEGE)

@router.post("/login/company", response_model=Token)
def login_company(db: Session = Depends(get_session), form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    return _login(db, form_data, UserRole.COMPANY)
