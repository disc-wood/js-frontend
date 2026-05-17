import React, { useMemo, useState } from 'react';
import './oakton-intake.css';

import oaktonLogo from '@/assets/oakton-intake/logo.png';
import studentSmiling from '@/assets/oakton-intake/student-smiling.png';
import medicalStudent from '@/assets/oakton-intake/medical-student.png';
import studentWorking from '@/assets/oakton-intake/student-working.png';

function calculateAge(dateOfBirthISO) {
  if (!dateOfBirthISO) return null;
  const dob = new Date(dateOfBirthISO);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age;
}

const INITIAL_FORM_DATA = {
  // Basic info
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  racialIdentity: '',
  gender: '',
  genderOther: '',
  cityZip: '',
  cityZipOther: '',

  // Program interest
  programsOfInterest: [],
  termOfInterest: '',
  projectedStartingTerm: '',

  // Work authorization & employment
  workAuthorization: '',
  workAuthorizationOther: '',
  employmentStatus: [],
  weeklyWorkHours: '',

  // Financial
  annualIncome: '',
  householdSize: '',

  // Education
  programFormat: '',
  programFormatOther: '',
  englishProficiency: '',
  englishProficiencyOther: '',
  eslLevel: '',
  isCurrentOaktonStudent: '',
  hasTakenOaktonClasses: '',
  currentEnrollmentDetails: '',
  hasAppliedForFafsa: '',
  hasReceivedWei: '',
  otherProgramsAppliedTo: [],
  highestEducation: '',
  longTermGoals: '',
  professionalGoals: '',

  // Personal challenges (support assessment)
  hasPersonalIssues: '',
  personalIssuesExplanation: '',
  transportationConcern: '',
  transportationExplanation: '',
  childcareConcern: '',
  childcareExplanation: '',

  // Self-assessment
  canAttendClasses: '',
  hasGoodStudyHabits: '',
  canSpendStudyHours: '',
  hasInternetAccess: '',
  hasComputerAccess: '',
  isSelfMotivated: '',

  // Accommodations
  needsAccommodations: '',
  accommodationsExplanation: '',

  // Agreement
  agreesToTerms: '',

  // Comments & source
  otherComments: '',
  howDidYouHear: '',
  howDidYouHearOther: '',

  // Intake session
  intakeSessionDate: '',
};

const LIKERT_OPTIONS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

// --- Reusable field components (defined outside OaktonIntake to avoid re-creation on every render) ---

function RadioGroup({ name, options, otherFieldName, formData, handleChange }) {
  return (
    <div className="oakton-radio-group" role="radiogroup">
      {options.map((opt) => (
        <label key={opt} className="oakton-radio-label">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={formData[name] === opt}
            onChange={handleChange}
            required
          />
          <span>{opt}</span>
        </label>
      ))}
      {otherFieldName && formData[name] === 'Other' && (
        <input
          type="text"
          name={otherFieldName}
          placeholder="Please specify"
          value={formData[otherFieldName]}
          onChange={handleChange}
          className="oakton-other-input"
          aria-label="Please specify"
          required
        />
      )}
    </div>
  );
}

function CheckboxGroup({ name, options, formData, handleCheckboxChange }) {
  return (
    <div className="oakton-radio-group" role="group">
      {options.map((opt) => (
        <label key={opt} className="oakton-radio-label">
          <input
            type="checkbox"
            name={name}
            value={opt}
            checked={formData[name].includes(opt)}
            onChange={() => handleCheckboxChange(name, opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

// --- Main component ---

export default function OaktonIntake() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitStatus, setSubmitStatus] = useState({ state: 'idle', message: '' });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const ageAtEnrollment = useMemo(
    () => calculateAge(formData.dateOfBirth),
    [formData.dateOfBirth]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (fieldName, optionValue) => {
    setFormData((prev) => {
      const current = prev[fieldName] || [];
      const updated = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ state: 'submitting', message: '' });

    const payload = { ...formData, ageAtEnrollment };

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/oaktonInfo/intakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.error || `Failed to submit intake (HTTP ${response.status})`;
        setSubmitStatus({ state: 'error', message: msg });
        return;
      }

      setSubmitStatus({ state: 'success', message: 'Submitted successfully.' });
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      setSubmitStatus({
        state: 'error',
        message: err?.message || 'Failed to submit intake',
      });
    }
  };

  return (
    <div className="oakton-page-wrapper">
      {/* Navigation */}
      <nav className="oakton-nav">
        <div className="oakton-nav-left">
          <img src={oaktonLogo} alt="Oakton College" className="oakton-nav-logo" />
          <a href="https://www.oakton.edu/paying-for-college/wei-grant.php" className="oakton-nav-link">About</a>
        </div>
        <div className="oakton-nav-right">
          <h2>WEI Application</h2>
        </div>
      </nav>

      {/* Main */}
      <main className="oakton-main">
        <h1 className="oakton-welcome-title">
          Welcome to the <strong>Oakton Workforce Empowerment Initiative</strong> (WEI) Application!
        </h1>

        <div className="oakton-content-grid">
          <div className="oakton-left-col">
            <p className="oakton-description">
              Your new beginning awaits! The <strong>Workforce Empowerment Initiative</strong> program at Oakton is an Illinois state grant that focuses on growing our area's workforce by providing participants with a credential and a living wage.
            </p>

            {showFullDescription && (
              <>
                <p className="oakton-description">
                  The purpose of the WEI grant is to accelerate the time for disproportionately impacted, unemployed, and/or underemployed residents to enter and succeed in post-secondary education/training programs that lead to employment in high skilled, high wage, and in-demand occupations.
                </p>
                <p className="oakton-description">
                  The primary deliverable of this grant is employment after completion of the credential aligned with regional workforce gaps that provides a full-time job paying at least 30% above the regional living wage or is on a pathway to a family sustaining wage.
                </p>
                <p className="oakton-description">
                  Through this grant, all eligible students will receive tuition, fees, books, and supplies. Students will also receive up to $1,000 stipend to support outside costs like transportation and childcare or any other personal expense.
                </p>
              </>
            )}

            <button
              type="button"
              className="oakton-read-more-toggle"
              onClick={() => setShowFullDescription((prev) => !prev)}
              aria-expanded={showFullDescription}
            >
              {showFullDescription ? 'Show less ▲' : 'Read more ▼'}
            </button>

            <p className="oakton-description" style={{ marginTop: '20px', marginBottom: '0' }}>
              Please block about 10-20 minutes of your time to complete the <strong>Workforce Empowerment Initiative</strong> application. Questions about how to complete the application? Email <a href="mailto:wei@oakton.edu" className="oakton-inline-link">wei@oakton.edu</a>.
            </p>

            <p className="oakton-disclaimer-inline">
              **Spots may be limited at times and approval is not guaranteed**
            </p>

            <div className="oakton-form-container">
              <form onSubmit={handleSubmit}>

                {/* === BASIC INFO === */}
                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Your Answer" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="oakton-form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Your Answer" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" placeholder="Your Answer" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="oakton-form-group">
                    <label htmlFor="phoneNumber">Phone Number *</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Your Answer" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                  </div>
                  <div className="oakton-form-group">
                    <label htmlFor="ageAtEnrollment">Age at Enrollment</label>
                    <input type="number" id="ageAtEnrollment" name="ageAtEnrollment" value={ageAtEnrollment ?? ''} readOnly aria-readonly="true" placeholder="Calculated from DOB" />
                  </div>
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Please select the racial group you identify with: *</div>
                  <RadioGroup
                    name="racialIdentity"
                    options={[
                      'Black/African American',
                      'Multiracial - identify with more than 1 race including Black/African American',
                      'American Indian',
                      'Asian',
                      'Hispanic',
                      'Latin American',
                      'Pacific Islander',
                      'White/Caucasian',
                      'Multiracial - identify with more than 1 race NOT including Black/African American',
                    ]}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Gender *</div>
                  <RadioGroup
                    name="gender"
                    options={['Female', 'Male', 'Prefer not to say', 'Other']}
                    otherFieldName="genderOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Indicate your city and zip code *</div>
                  <RadioGroup
                    name="cityZip"
                    options={[
                      'Evanston: 60201',
                      'Evanston: 60202',
                      'Des Plaines: 60016',
                      'Skokie: 60076',
                      'Skokie: 60077',
                      'Niles: 60714',
                      'Other',
                    ]}
                    otherFieldName="cityZipOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                {/* === PROGRAM INTEREST === */}
                <div className="oakton-form-group">
                  <div className="oakton-group-label">Please choose your program of interest. Please email us for general questions. *</div>
                  <CheckboxGroup
                    name="programsOfInterest"
                    options={[
                      'Truck Driver Training (Class A)',
                      'Forklift Operator Training',
                      'Intro to Manufacturing with OSHA 10 Certificate',
                      'Basic Nursing Assistant Training (BNAT)',
                      'Emergency Medical Technician Certificate (EMT)',
                      'Computer Numerical Control Certificate (CNC)',
                      'Pharmacy Technician Certificate',
                      'Medical Assistant Certificate (MA)',
                      'Medical Assistant Certificate (Apprenticeship)',
                    ]}
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Term of interest. *Some programs may have limited spacing or not be available. *</div>
                  <RadioGroup
                    name="termOfInterest"
                    options={[
                      'Spring (Classes will convene any time from January through May)',
                      'Summer (Classes will convene any time from May through August)',
                      'Fall (Classes will convene any time from August through December)',
                    ]}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Projected Starting Term *</div>
                  <RadioGroup
                    name="projectedStartingTerm"
                    options={['Summer 2026', 'Fall 2026', 'Spring 2027']}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Are you authorized to work in the United States without the need for an employer sponsorship? *</div>
                  <RadioGroup
                    name="workAuthorization"
                    options={['Yes', 'No', 'Other']}
                    otherFieldName="workAuthorizationOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Check all that apply *</div>
                  <CheckboxGroup
                    name="employmentStatus"
                    options={[
                      'Currently receiving SNAP benefits',
                      'Currently receiving Unemployment Benefits',
                      'Currently unemployed',
                      'Currently employed',
                    ]}
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Your Annual Income *</div>
                  <RadioGroup
                    name="annualIncome"
                    options={[
                      '$10,000 or Less',
                      '$10,000 - $30,000',
                      '$30,000 - $40,000',
                      '$40,000 - $50,000',
                      '$50,000 and above',
                    ]}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Number of people in your household *</div>
                  <RadioGroup
                    name="householdSize"
                    options={['1', '2', '3', '4', '5', '6', '7+']}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">What is your preference in terms of program format? *Certain options may not be available or suitable depending on your program of interest. *</div>
                  <RadioGroup
                    name="programFormat"
                    options={['Fully Online', 'Fully In Person', 'In-Person and Online', 'Other']}
                    otherFieldName="programFormatOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Classes are conducted in English. Do you fluently speak, understand, read, and write in English? *</div>
                  <RadioGroup
                    name="englishProficiency"
                    options={['Yes', 'No', 'I need support', 'Other']}
                    otherFieldName="englishProficiencyOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="eslLevel">Have you ever taken or needed to take an English as a Second Language (ESL) class? If yes, what level did you complete? *</label>
                  <input type="text" id="eslLevel" name="eslLevel" placeholder="Your answer" value={formData.eslLevel} onChange={handleChange} required />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Are you a current Oakton Student? *</div>
                  <RadioGroup name="isCurrentOaktonStudent" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Have you ever taken classes at Oakton? *</div>
                  <RadioGroup name="hasTakenOaktonClasses" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="currentEnrollmentDetails">Are you CURRENTLY enrolled in one of the approved programs? If yes, please list the name of the program and the term enrolled (e.g., Spring, Summer, Fall + Year) *</label>
                  <input type="text" id="currentEnrollmentDetails" name="currentEnrollmentDetails" placeholder="Your answer" value={formData.currentEnrollmentDetails} onChange={handleChange} required />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Have you applied to or are currently receiving federal financial aid (FAFSA)? *</div>
                  <RadioGroup name="hasAppliedForFafsa" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Have you ever received the WEI grant? *</div>
                  <RadioGroup name="hasReceivedWei" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Please indicate if you have applied for or been accepted into any of the below programs. *</div>
                  <CheckboxGroup
                    name="otherProgramsAppliedTo"
                    options={['PATH', "I've never heard of this program"]}
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Highest level of education obtained *</div>
                  <RadioGroup
                    name="highestEducation"
                    options={['Some high school', 'High school and/or GED', 'Some college', 'Associates Degree', 'Bachelors or higher']}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">What are your longterm educational goals? *</div>
                  <RadioGroup
                    name="longTermGoals"
                    options={['Certificate', 'Associates Degree', 'Transfer Bachelors', 'Degree Undecided', 'Unsure', 'Other']}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="professionalGoals">Explain in a few sentences your professional goals. *</label>
                  <textarea
                    id="professionalGoals"
                    name="professionalGoals"
                    placeholder="Your answer"
                    value={formData.professionalGoals}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                {/* === SUPPORT ASSESSMENT SECTION === */}
                <div className="oakton-section-divider">
                  <h2 className="oakton-section-title">Assessing How We Can Support You!</h2>
                  <p className="oakton-section-blurb">
                    The following questions are just to assess your needs and how we can support you while in the program. Your answers to these questions will not affect your eligibility. Your information will be used to provide necessary resources to ensure your success (e.g., childcare referrals, free laptop checkout, bus cards, housing, food insecurity, etc.)
                  </p>
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Are there personal issues in your life that may affect your ability to succeed in college? Consider issues related to yourself, family and friends. *</div>
                  <RadioGroup name="hasPersonalIssues" options={['Yes', 'No', 'Maybe']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="personalIssuesExplanation">If you answered yes or maybe to the above question regarding personal issues, please explain. Again, your responses are just to best determine how we can support you while in the program.</label>
                  <textarea
                    id="personalIssuesExplanation"
                    name="personalIssuesExplanation"
                    placeholder="Your answer"
                    value={formData.personalIssuesExplanation}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Is transportation a concern for you? *</div>
                  <RadioGroup
                    name="transportationConcern"
                    options={[
                      "Yes, I don't have a car",
                      'Yes, I do have a car, but gas costs are a challenge',
                      'Yes, I need access to bus cards',
                      "No, I don't need any transportation assistance.",
                      'Maybe',
                    ]}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="transportationExplanation">If you answered yes or maybe to the above question regarding transportation, please explain</label>
                  <textarea
                    id="transportationExplanation"
                    name="transportationExplanation"
                    placeholder="Your answer"
                    value={formData.transportationExplanation}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Is childcare a problem for you? *</div>
                  <RadioGroup name="childcareConcern" options={['Yes', 'No', 'Maybe']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="childcareExplanation">If you answered yes or maybe to the above question regarding childcare, please explain.</label>
                  <textarea
                    id="childcareExplanation"
                    name="childcareExplanation"
                    placeholder="Your answer"
                    value={formData.childcareExplanation}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="weeklyWorkHours">Are you currently employed? If yes, how many hours per week are you working? *</label>
                  <input type="text" id="weeklyWorkHours" name="weeklyWorkHours" placeholder="Your answer" value={formData.weeklyWorkHours} onChange={handleChange} required />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Rate the following: I will be able to consistently attend required classes and labs *</div>
                  <RadioGroup name="canAttendClasses" options={LIKERT_OPTIONS} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Rate the following: I have good study habits *</div>
                  <RadioGroup name="hasGoodStudyHabits" options={LIKERT_OPTIONS} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Rate the following: I am able to spend the required number of hours outside of class to study *</div>
                  <RadioGroup name="canSpendStudyHours" options={LIKERT_OPTIONS} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Do you have access to high-speed internet connection at home or away from campus (NOT INCLUDING YOUR CELL PHONE)? *</div>
                  <RadioGroup name="hasInternetAccess" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Do you own and have regular access to a computer or laptop? *</div>
                  <RadioGroup name="hasComputerAccess" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">How have you proven yourself to be a self-motivated and independent learner? *</div>
                  <RadioGroup name="isSelfMotivated" options={['Yes', 'No']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">Do you anticipate needing any learning or testing accommodations to help you successfully complete this program (for example: extended test time, quiet testing space, recorded lectures, or other supports)? *</div>
                  <RadioGroup name="needsAccommodations" options={['Yes', 'No', 'Maybe']} formData={formData} handleChange={handleChange} />
                </div>

                <div className="oakton-form-group">
                  <label htmlFor="accommodationsExplanation">If you answered yes or maybe to the above question regarding accommodations, please explain.</label>
                  <textarea
                    id="accommodationsExplanation"
                    name="accommodationsExplanation"
                    placeholder="Your answer"
                    value={formData.accommodationsExplanation}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {/* === AGREEMENT === */}
                <div className="oakton-form-group">
                  <div className="oakton-group-label">By electing to participate in the WEI program, I agree to full participation as follows: *</div>
                  <ol className="oakton-agreement-list">
                    <li>I will meet with my WEI advisor at least one time per semester that I am enrolled in WEI, or more as identified by my advisor throughout the school year.</li>
                    <li>I will attend all of my required classes</li>
                    <li>I will ask for educational support as soon as my grade falls below a "C" in any course.</li>
                    <li>I will complete my program in a semester or less.</li>
                    <li>I will attend scheduled meetings with WEI staff or will contact WEI staff to reschedule.</li>
                    <li>I will complete an online workforce readiness training program.</li>
                    <li>I will complete and submit all required financial aid forms on time as required.</li>
                    <li>I release authorization for the WEI program to request any and all academic and non-academic documents related to my academic progress.</li>
                    <li>Participants agree to inform program when phone number or address change.</li>
                    <li>I commit to actively seeking employment in an area that is connected to the training program.</li>
                  </ol>
                  <p className="oakton-agreement-note">
                    If I do not comply with Items 1-10 above, I might not be entitled to receive those services reserved specifically for WEI students.
                  </p>
                  <RadioGroup name="agreesToTerms" options={['I agree', 'I do not agree']} formData={formData} handleChange={handleChange} />
                </div>

                {/* === OTHER === */}
                <div className="oakton-form-group">
                  <label htmlFor="otherComments">Any other comments and questions?</label>
                  <textarea
                    id="otherComments"
                    name="otherComments"
                    placeholder="Your answer"
                    value={formData.otherComments}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">How did you hear about us? *</div>
                  <RadioGroup
                    name="howDidYouHear"
                    options={[
                      "Oakton's Website",
                      'Email',
                      'Facebook',
                      'Instagram',
                      'From a friend',
                      'Pandora Radio Station',
                      'Community Partner: Youth Job Center of Evanston',
                      'Community Partner: Evanston Public Library/Robert Crown',
                      "Community Partner: Curt's Cafe",
                      'Community Partner: YMCA of Evanston',
                      'Other Community Partner',
                      'Other',
                    ]}
                    otherFieldName="howDidYouHearOther"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-group">
                  <div className="oakton-group-label">As a grant requirement you must attend a virtual intake session to learn more about program details. Please choose a day and time that works best. Remember to check your email for the zoom link after submitting your application. ***If you are interested in the Medical Assistant Apprenticeship, please select "N/A" and someone will be in contact with you.*** *</div>
                  <RadioGroup
                    name="intakeSessionDate"
                    options={[
                      'April 28, 2026 @5pm',
                      'April 30, 2026 @3pm',
                      'May 5, 2026 @ 3pm',
                      'May 7, 2026 @2pm',
                      'May 19, 2026 @5pm',
                      'May 20, 2026 @2pm',
                      'N/A',
                    ]}
                    formData={formData}
                    handleChange={handleChange}
                  />
                </div>

                <div className="oakton-form-actions">
                  <button
                    className="oakton-submit-button"
                    type="submit"
                    disabled={submitStatus.state === 'submitting'}
                  >
                    {submitStatus.state === 'submitting' ? 'Submitting…' : 'Submit'}
                  </button>
                  {submitStatus.state !== 'idle' && (
                    <p
                      className={`oakton-submit-message ${
                        submitStatus.state === 'success'
                          ? 'oakton-submit-message--success'
                          : submitStatus.state === 'error'
                            ? 'oakton-submit-message--error'
                            : ''
                      }`}
                      role="status"
                    >
                      {submitStatus.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Image and Contact */}
          <div className="oakton-right-col">
            <div className="oakton-image-collage">
              <img src={studentSmiling} alt="Student smiling" />
              <img src={studentWorking} alt="Student working" />
              <img src={medicalStudent} alt="Medical student" />
            </div>

            <div className="oakton-contact-box">
              <p>Questions about how to complete the application? Email <a href="mailto:wei@oakton.edu">wei@oakton.edu</a>.</p>
              <p className="oakton-disclaimer">**Spots may be limited at times and approval is not guaranteed**</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="oakton-footer">
        <p>LearnerTrack. All rights reserved © 2026</p>
      </footer>
    </div>
  );
}