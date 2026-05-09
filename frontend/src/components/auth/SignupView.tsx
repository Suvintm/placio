import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import type { Role } from '../../context/AuthContext';
import '../../styles/auth_stepper.css';

interface SignupViewProps {
  onSwitch: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onSwitch }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState<Role>('STUDENT');
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Account Level
    firstName: '',
    lastName: '',
    institutionName: '',
    representativeName: '',
    companyName: '',
    hrName: '',
    email: '',
    password: '',
    
    // College Profiles
    aisheCode: '',
    university: '',
    website: '',
    naacGrade: '',
    campusAddress: '',
    city: '',
    state: '',
    tpoPhone: '',
    tpoDesignation: '',
    
    // Student Profile
    collegeCode: '',
    branch: '',
    batchYear: '',
    cgpa: '',
    skills: '',

    // Company Profile
    industry: '',
    hrPhone: '',
    hrDesignation: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const steps = {
    STUDENT: ['Account', 'Academic', 'Profile'],
    COLLEGE: ['Account', 'Legal', 'Quality', 'Contact'],
    COMPANY: ['Account', 'Company', 'HR Details'],
  };

  const currentRoleSteps = steps[role as keyof typeof steps] || ['Account'];
  const totalSteps = currentRoleSteps.length;

  const isStepValid = () => {
    if (currentStep === 0) {
      const basic = formData.email.trim() !== '' && formData.password.length >= 8;
      if (role === 'STUDENT') return basic && formData.firstName && formData.lastName;
      if (role === 'COLLEGE') return basic && formData.institutionName && formData.representativeName;
      if (role === 'COMPANY') return basic && formData.companyName && formData.hrName;
    }
    
    if (role === 'COLLEGE') {
      if (currentStep === 1) return formData.aisheCode && formData.university && formData.website;
      if (currentStep === 2) return formData.naacGrade && formData.campusAddress && formData.city && formData.state;
      if (currentStep === 3) return formData.tpoPhone && formData.tpoDesignation;
    }

    if (role === 'STUDENT') {
      if (currentStep === 1) return formData.collegeCode && formData.branch && formData.batchYear;
      if (currentStep === 2) return formData.cgpa;
    }

    if (role === 'COMPANY') {
      if (currentStep === 1) return formData.industry && formData.website;
      if (currentStep === 2) return formData.hrPhone && formData.hrDesignation;
    }

    return false;
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (currentStep < totalSteps - 1 && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let fullName = "";
      if (role === 'STUDENT') fullName = `${formData.firstName} ${formData.lastName}`;
      else if (role === 'COLLEGE') fullName = formData.representativeName;
      else if (role === 'COMPANY') fullName = formData.hrName;

      // DATA CONVERSION: Convert strings to numbers for backend
      const payload = {
        ...formData,
        full_name: fullName.trim(),
        role,
        batchYear: formData.batchYear ? parseInt(formData.batchYear) : null,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
      };

      await signup(payload, role);
      
      const path = `/${role?.toLowerCase()}/dashboard`;
      navigate(path);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const progressWidth = (currentStep / (totalSteps - 1)) * 100;
    return (
      <div className="stepper-container">
        <div className="stepper-line">
          <div className="stepper-line-progress" style={{ width: `${progressWidth}%` }}></div>
        </div>
        {currentRoleSteps.map((label, index) => (
          <div key={label} className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
            <div className="step-circle">{index < currentStep ? '✓' : index + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Account Identity</h2><p className="step-subtitle">Start by securing your {role?.toLowerCase()} credentials.</p></div>
          {role === 'STUDENT' ? (
            <div className="input-row">
              <div className="input-group"><label className="input-label">First Name</label><input type="text" name="firstName" className="input-field" placeholder="John" required value={formData.firstName} onChange={handleInputChange} /></div>
              <div className="input-group"><label className="input-label">Last Name</label><input type="text" name="lastName" className="input-field" placeholder="Doe" required value={formData.lastName} onChange={handleInputChange} /></div>
            </div>
          ) : role === 'COLLEGE' ? (
            <>
              <div className="input-group"><label className="input-label">Institution Name</label><input type="text" name="institutionName" className="input-field" placeholder="e.g. IIT Madras" required value={formData.institutionName} onChange={handleInputChange} /></div>
              <div className="input-group"><label className="input-label">TPO Name</label><input type="text" name="representativeName" className="input-field" placeholder="Dr. Sarah" required value={formData.representativeName} onChange={handleInputChange} /></div>
            </>
          ) : (
            <>
              <div className="input-group"><label className="input-label">Company Name</label><input type="text" name="companyName" className="input-field" placeholder="e.g. Microsoft" required value={formData.companyName} onChange={handleInputChange} /></div>
              <div className="input-group"><label className="input-label">HR Name</label><input type="text" name="hrName" className="input-field" placeholder="Michael" required value={formData.hrName} onChange={handleInputChange} /></div>
            </>
          )}
          <div className="input-group"><label className="input-label">Official Email</label><input type="email" name="email" className="input-field" placeholder="official@domain.com" required value={formData.email} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Password</label><input type={showPassword ? "text" : "password"} name="password" className="input-field" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} /></div>
        </div>
      );
    }

    if (role === 'COLLEGE') {
      if (currentStep === 1) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Legal Details</h2><p className="step-subtitle">Official identification of your institution.</p></div>
          <div className="input-group"><label className="input-label">AISHE Code</label><input type="text" name="aisheCode" className="input-field" placeholder="C-12345" value={formData.aisheCode} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Affiliated University</label><input type="text" name="university" className="input-field" placeholder="e.g. Anna University" value={formData.university} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Official Website</label><input type="url" name="website" className="input-field" placeholder="https://www.college.edu" value={formData.website} onChange={handleInputChange} /></div>
        </div>
      );
      if (currentStep === 2) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Quality & Location</h2><p className="step-subtitle">Accreditation and geographic info.</p></div>
          <div className="input-row">
            <div className="input-group"><label className="input-label">NAAC Grade</label><select name="naacGrade" className="input-field" value={formData.naacGrade} onChange={handleInputChange}><option value="">Select</option><option value="A++">A++</option><option value="A+">A+</option><option value="A">A</option><option value="B">B</option></select></div>
            <div className="input-group"><label className="input-label">City</label><input type="text" name="city" className="input-field" placeholder="Chennai" value={formData.city} onChange={handleInputChange} /></div>
          </div>
          <div className="input-group"><label className="input-label">Campus Address</label><input type="text" name="campusAddress" className="input-field" placeholder="123 Academic Way" value={formData.campusAddress} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">State</label><input type="text" name="state" className="input-field" placeholder="Tamil Nadu" value={formData.state} onChange={handleInputChange} /></div>
        </div>
      );
      if (currentStep === 3) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Contact Verification</h2><p className="step-subtitle">Primary point of contact for placements.</p></div>
          <div className="input-group"><label className="input-label">TPO Phone Number</label><input type="tel" name="tpoPhone" className="input-field" placeholder="+91 9876543210" value={formData.tpoPhone} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Designation</label><input type="text" name="tpoDesignation" className="input-field" placeholder="Head of Training & Placements" value={formData.tpoDesignation} onChange={handleInputChange} /></div>
        </div>
      );
    }

    if (role === 'STUDENT') {
      if (currentStep === 1) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Academic Details</h2><p className="step-subtitle">Provide your educational background.</p></div>
          <div className="input-group"><label className="input-label">College Code</label><input type="text" name="collegeCode" className="input-field" placeholder="e.g. 123456" value={formData.collegeCode} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Branch</label><input type="text" name="branch" className="input-field" placeholder="Computer Science" value={formData.branch} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Batch Year</label><input type="number" name="batchYear" className="input-field" placeholder="2025" value={formData.batchYear} onChange={handleInputChange} /></div>
        </div>
      );
      if (currentStep === 2) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Performance Stats</h2><p className="step-subtitle">Your current metrics.</p></div>
          <div className="input-group"><label className="input-label">Current CGPA</label><input type="number" step="0.01" name="cgpa" className="input-field" placeholder="9.5" value={formData.cgpa} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Key Skills</label><input type="text" name="skills" className="input-field" placeholder="React, Python, SQL" value={formData.skills} onChange={handleInputChange} /></div>
        </div>
      );
    }

    if (role === 'COMPANY') {
      if (currentStep === 1) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">Company Info</h2><p className="step-subtitle">Business details.</p></div>
          <div className="input-group"><label className="input-label">Industry Type</label><input type="text" name="industry" className="input-field" placeholder="Technology / Finance" value={formData.industry} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Company Website</label><input type="url" name="website" className="input-field" placeholder="https://www.company.com" value={formData.website} onChange={handleInputChange} /></div>
        </div>
      );
      if (currentStep === 2) return (
        <div className="step-content-wrapper">
          <div className="step-info"><h2 className="step-title">HR Contact</h2><p className="step-subtitle">Direct hiring contact.</p></div>
          <div className="input-group"><label className="input-label">HR Phone Number</label><input type="tel" name="hrPhone" className="input-field" placeholder="+91 9876543210" value={formData.hrPhone} onChange={handleInputChange} /></div>
          <div className="input-group"><label className="input-label">Official Designation</label><input type="text" name="hrDesignation" className="input-field" placeholder="Talent Acquisition Manager" value={formData.hrDesignation} onChange={handleInputChange} /></div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="form-container" style={{ minHeight: '650px', paddingBottom: '32px' }}>
      <div className="title-row">
        <h1 className="form-title">{role === 'STUDENT' ? 'Student' : role === 'COLLEGE' ? 'Institutional' : 'Corporate'} Signup</h1>
        <img src={logo} alt="Placio" className="form-header-logo" />
      </div>

      {currentStep === 0 && (
        <div className="role-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
          <div className={`role-card ${role === 'STUDENT' ? 'active' : ''}`} onClick={() => { setRole('STUDENT'); setCurrentStep(0); }}><h3 className="role-card-title">Student</h3></div>
          <div className={`role-card ${role === 'COLLEGE' ? 'active' : ''}`} onClick={() => { setRole('COLLEGE'); setCurrentStep(0); }}><h3 className="role-card-title">College</h3></div>
          <div className={`role-card ${role === 'COMPANY' ? 'active' : ''}`} onClick={() => { setRole('COMPANY'); setCurrentStep(0); }}><h3 className="role-card-title">Company</h3></div>
        </div>
      )}

      {renderStepIndicator()}
      {error && <div className="auth-error-msg" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

      <form className="auth-form" onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {renderStepContent()}
        <div className="button-group" style={{ marginTop: 'auto', paddingTop: '24px' }}>
          {currentStep > 0 && <button type="button" className="back-btn" onClick={handleBack}>Back</button>}
          <button type="submit" className="next-btn" disabled={!isStepValid() || isSubmitting}>
            {currentStep === totalSteps - 1 ? (isSubmitting ? 'Finalizing...' : 'Complete Signup') : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupView;
