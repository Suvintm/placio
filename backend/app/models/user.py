from typing import Optional, List, Any
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from pydantic import ConfigDict, AliasPath, AliasChoices

class UserRole(str, Enum):
    STUDENT = "STUDENT"
    COLLEGE = "COLLEGE"
    COMPANY = "COMPANY"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    role: UserRole
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    full_name: Optional[str] = None
    
    student_profile: Optional["StudentProfile"] = Relationship(back_populates="user")
    college_profile: Optional["CollegeProfile"] = Relationship(back_populates="user")
    company_profile: Optional["CompanyProfile"] = Relationship(back_populates="user")

class StudentProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    college_code: Optional[str] = None
    branch: Optional[str] = None
    batch_year: Optional[int] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    user: User = Relationship(back_populates="student_profile")

class CollegeProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    institution_name: str
    aishe_code: str = Field(unique=True)
    university: str
    website: Optional[str] = None
    naac_grade: Optional[str] = None
    campus_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    tpo_name: Optional[str] = None
    tpo_phone: Optional[str] = None
    tpo_designation: Optional[str] = None
    user: User = Relationship(back_populates="college_profile")

class CompanyProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    hr_name: Optional[str] = None
    hr_phone: Optional[str] = None
    hr_designation: Optional[str] = None
    user: User = Relationship(back_populates="company_profile")

class UserCreateBase(SQLModel):
    email: str = Field(unique=True, index=True)
    password: str
    full_name: str
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)

class StudentCreate(UserCreateBase):
    role: UserRole = Field(default=UserRole.STUDENT)
    college_code: Optional[str] = Field(default=None, validation_alias=AliasChoices('college_code', 'collegeCode'))
    branch: Optional[str] = None
    batch_year: Optional[int] = Field(default=None, validation_alias=AliasChoices('batch_year', 'batchYear'))
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

class CollegeCreate(UserCreateBase):
    role: UserRole = Field(default=UserRole.COLLEGE)
    institution_name: str = Field(validation_alias=AliasChoices('institution_name', 'institutionName'))
    aishe_code: str = Field(validation_alias=AliasChoices('aishe_code', 'aisheCode'))
    university: str
    website: Optional[str] = None
    naac_grade: Optional[str] = Field(default=None, validation_alias=AliasChoices('naac_grade', 'naacGrade'))
    campus_address: Optional[str] = Field(default=None, validation_alias=AliasChoices('campus_address', 'campusAddress'))
    city: Optional[str] = None
    state: Optional[str] = None
    tpo_phone: Optional[str] = Field(default=None, validation_alias=AliasChoices('tpo_phone', 'tpoPhone'))
    tpo_designation: Optional[str] = Field(default=None, validation_alias=AliasChoices('tpo_designation', 'tpoDesignation'))
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

class CompanyCreate(UserCreateBase):
    role: UserRole = Field(default=UserRole.COMPANY)
    company_name: str = Field(validation_alias=AliasChoices('company_name', 'companyName'))
    industry: Optional[str] = None
    website: Optional[str] = None
    hr_phone: Optional[str] = Field(default=None, validation_alias=AliasChoices('hr_phone', 'hrPhone'))
    hr_designation: Optional[str] = Field(default=None, validation_alias=AliasChoices('hr_designation', 'hrDesignation'))
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

# Kept for backward compatibility or generic use if needed
class UserCreate(UserCreateBase):
    role: UserRole
    college_code: Optional[str] = Field(default=None, validation_alias=AliasChoices('college_code', 'collegeCode'))
    branch: Optional[str] = None
    batch_year: Optional[int] = Field(default=None, validation_alias=AliasChoices('batch_year', 'batchYear'))
    cgpa: Optional[float] = None
    institution_name: Optional[str] = Field(default=None, validation_alias=AliasChoices('institution_name', 'institutionName'))
    aishe_code: Optional[str] = Field(default=None, validation_alias=AliasChoices('aishe_code', 'aisheCode'))
    university: Optional[str] = None
    website: Optional[str] = None
    naac_grade: Optional[str] = Field(default=None, validation_alias=AliasChoices('naac_grade', 'naacGrade'))
    campus_address: Optional[str] = Field(default=None, validation_alias=AliasChoices('campus_address', 'campusAddress'))
    city: Optional[str] = None
    state: Optional[str] = None
    tpo_phone: Optional[str] = Field(default=None, validation_alias=AliasChoices('tpo_phone', 'tpoPhone'))
    tpo_designation: Optional[str] = Field(default=None, validation_alias=AliasChoices('tpo_designation', 'tpoDesignation'))
    company_name: Optional[str] = Field(default=None, validation_alias=AliasChoices('company_name', 'companyName'))
    industry: Optional[str] = None
    hr_phone: Optional[str] = Field(default=None, validation_alias=AliasChoices('hr_phone', 'hrPhone'))
    hr_designation: Optional[str] = Field(default=None, validation_alias=AliasChoices('hr_designation', 'hrDesignation'))
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

class UserRead(UserBase):
    id: int
    full_name: Optional[str] = None

class Token(SQLModel):
    access_token: str
    token_type: str
    user: UserRead
