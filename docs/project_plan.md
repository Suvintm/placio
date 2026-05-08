# Placio: Complete Role-by-Role Process & Feature Flow

## 🏛️ ROLE 1: COLLEGE ADMIN (TPO)

### Account Setup
- College registers on the platform → Super Admin approves
- College sets up their profile: college name, location, affiliated university, NAAC grade, placement officer details
- College gets a **unique College Code** (students use this to register)

### Student Management
- TPO can **bulk upload students** via Excel (roll no, name, branch, CGPA, email)
- Or students self-register using the College Code
- TPO **verifies and approves** each student account
- TPO can **block/unblock** students from placements (e.g., already placed)

### Company Request Management (Incoming)
```
Company sends job request → TPO gets notification
→ TPO reviews job details (role, CTC, eligibility criteria)
→ TPO Accepts or Rejects
→ If Accepted → Company HR gets notified → Job becomes active
→ If Rejected → TPO gives reason → Company gets notified
```

### Job Management (After Accepting)
- TPO can **edit eligibility criteria** before publishing to students
  - Minimum CGPA cutoff
  - Allowed branches (CSE only? All branches?)
  - Maximum backlogs allowed
  - Batch year (2025 passout only?)
  - Gender preference (if any)
- TPO can **attach additional tests** on top of what HR already attached
  - Example: HR attached an Aptitude test, TPO adds a Coding test
- TPO sets the **application deadline**
- TPO **publishes the job** → eligible students get notified automatically

### Job Dashboard (Most Important Feature)
When TPO clicks any Job, they see a **complete Job Control Center**:

```
📋 JOB: Software Engineer — Google
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Overview Tab
  - Total Eligible Students: 245
  - Total Applied: 180
  - Application Deadline: 15 May 2026

📝 Applied Students Tab
  - List of all students who applied
  - Their CGPA, branch, backlog count
  - Application timestamp

🧪 Test Tab
  - Test 1: Aptitude (by HR) — 60 mins — 30 questions
  - Test 2: Coding (by TPO) — 90 mins — 3 problems
  - Who has attempted / who hasn't
  - Each student's score

✅ Shortlisted Tab
  - Students who scored above minimum marks
  - Auto-highlighted by system
  - TPO can manually add/remove students

🎯 Interview Rounds Tab
  - Round 1: Technical — results
  - Round 2: HR — results
  - Final selected students

📄 Offers Tab
  - Students who received offer letters
  - CTC offered per student
  - Offer letter PDF uploaded by HR
```

---

## 🏢 ROLE 2: COMPANY HR

### Account Setup
- HR registers on the platform
- HR selects which colleges they want to target (can select multiple)
- Each selected college gets a **connection request**
- HR cannot do anything until at least one college accepts

### Sending Job Request to College
```
HR fills Job Form:
  → Job Title, Description, CTC, Location, Job Type
  → Eligibility Criteria (their requirements)
  → Attach MCQ Test (optional at this stage)
  → Select target colleges (1 or many)
  → Submit → Request goes to all selected colleges
```

### After College Accepts
- HR gets email + in-app notification: **"XYZ College accepted your job request"**
- HR can now **attach or update the test** for that specific job
- HR can view the job's student activity for that college

### HR Job Dashboard
When HR clicks any Job, they see:

```
📋 JOB: Software Engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Colleges Tab:
  - College A ✅ Accepted
  - College B ⏳ Pending
  - College C ❌ Rejected

[Click College A to go inside]

Inside College A View:
  - Applied Students: 180
  - Test Scores of all students
  - Shortlisted Students (above cutoff)
  - Interview round results
  - Final hired students
```

- HR can **upload offer letters** per student
- HR can **mark students as Hired / Rejected / On Hold**
- HR can **add interview rounds** and update results

---

## 🎓 ROLE 3: STUDENT

### Account Setup
- Student registers using College Code
- Fills profile:
  - Personal details
  - Academic: CGPA, branch, year, number of backlogs
  - Skills, projects, internships
  - Resume upload (PDF)
- TPO approves the account

### Seeing Jobs
- Student opens the **Jobs Board**
- They ONLY see jobs that their college has published
- Each job shows:
  - Company name, role, CTC, deadline
  - **Eligibility Status Badge**:
    - 🟢 **You are Eligible — Apply Now**
    - 🔴 **Not Eligible — CGPA below 7.0 required**
    - 🟡 **Not Eligible — Branch not allowed**
    - ⚫ **Already Applied**
    - 🏆 **You are Placed** (if already placed in another company, blocked from applying)

### Eligibility Auto-Check (Critical Logic)
```
Student clicks "Apply" →
System checks in real-time:
  ✅ CGPA >= minimum? 
  ✅ Branch in allowed list?
  ✅ Backlogs <= maximum allowed?
  ✅ Batch year matches?
  ✅ Student not already placed?
  ✅ Application deadline not passed?

All pass → Application submitted
Any fail → Show exact reason, block application
```

### After Applying
```
Student Applied
  → TPO gets notified (new application)
  → HR gets notified (new application)
  → Student sees job in "My Applications" tab
  → Student waits for test to be assigned
```

### Taking the Test
```
Student gets notification: "Test is now live for Google SWE job"
  → Student goes to test
  → Sees: Time limit, number of questions, instructions
  → Clicks "Start Test"
  → Full screen mode activates
  → Timer starts
  → Submits → Auto-graded immediately
  → Student sees: "Your score: 28/30"
  → Minimum cutoff: 20/30
  → Status: ✅ You have qualified for the next round
```

### Tracking Everything
Student's personal dashboard shows:

```
My Applications:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Google — SWE
  Applied ✅ → Test Taken ✅ (Score: 28/30) → Shortlisted ✅ → Round 1 Pending

Amazon — Data Analyst  
  Applied ✅ → Test Pending ⏳

Microsoft — Cloud Engineer
  Applied ✅ → Test Taken ✅ (Score: 12/30) → Not Shortlisted ❌
```

---

## 🔑 THE JOB — Central Entity of the Entire System

Every action revolves around the Job. Here is the **complete Job lifecycle**:

```
1. HR Creates Job Request
        ↓
2. College Receives & Reviews Request
        ↓
3. College Accepts (HR notified) / Rejects (HR notified)
        ↓
4. College sets eligibility + adds extra tests + sets deadline
        ↓
5. College publishes → Eligible students notified automatically
        ↓
6. Students apply → Eligibility auto-checked
        ↓
7. Both TPO + HR see real-time applicant list
        ↓
8. Test goes live → Students take test → Auto-graded
        ↓
9. Students above cutoff → Auto-shortlisted → Both TPO + HR notified
        ↓
10. Interview rounds begin → TPO manages logistics
        ↓
11. HR marks final results (Hired / Rejected)
        ↓
12. HR uploads offer letter → Student gets notification
        ↓
13. Student marked as "Placed" → Locked from other jobs
        ↓
14. TPO sees placement statistics updated
```

---

## 🔔 Notification Map (Who gets notified for what)

| Event | TPO | HR | Student |
|---|---|---|---|
| Company sends job request | ✅ | — | — |
| TPO accepts job | ✅ | ✅ | — |
| Job published | — | — | ✅ Eligible students only |
| Student applies | ✅ | ✅ | ✅ Confirmation |
| Test goes live | — | — | ✅ Applied students |
| Test submitted | — | — | ✅ Score shown |
| Shortlist announced | ✅ | ✅ | ✅ Individual result |
| Round result updated | ✅ | ✅ | ✅ |
| Offer letter uploaded | ✅ | ✅ | ✅ |

---

## 🗄️ Database Structure (Simplified)

```
College → has many → Students
College → has many → Jobs (via acceptance)

Company → sends → JobRequests → to → College
JobRequest → becomes → Job (after acceptance)

Job → has many → Tests
Job → has many → Applications (Student applied)

Application → has → TestAttempt → has → Score
Application → has → InterviewRounds → has → RoundResult

Student → if hired → marked Placed → locked from other jobs
```
