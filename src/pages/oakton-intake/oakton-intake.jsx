import React, { useMemo, useState } from 'react';
import './oakton-intake.css';

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

export default function OaktonIntake() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    ethnicityRace: '',
    currentCity: '',
    zipCode: '',
  });

  const [submitStatus, setSubmitStatus] = useState({
    state: 'idle', // idle | submitting | success | error
    message: '',
  });

  const ageAtEnrollment = useMemo(
    () => calculateAge(formData.dateOfBirth),
    [formData.dateOfBirth]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ state: 'submitting', message: '' });

    const payload = {
      ...formData,
      ageAtEnrollment,
    };

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/oaktonInfo/intakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg =
          data?.error ||
          `Failed to submit intake (HTTP ${response.status})`;
        setSubmitStatus({ state: 'error', message: msg });
        return;
      }

      setSubmitStatus({ state: 'success', message: 'Submitted successfully.' });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        ethnicityRace: '',
        currentCity: '',
        zipCode: '',
      });
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
          <img src="/placeholder-logo.png" alt="Oakton College" className="oakton-nav-logo" />
          <a href="#" className="oakton-nav-link">About</a>
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
          
          {/* Text and Form */}
          <div className="oakton-left-col">
            <p className="oakton-description">
              Your new beginning awaits! The <strong>Workforce Empowerment Initiative</strong> program at Oakton is an Illinois state grant that focuses on growing our area's workforce by providing participants with a credential and a living wage. The purpose of the WEI grant is to accelerate the time for disproportionately impacted, unemployed, and/or underemployed residents to enter and succeed in post-secondary education/training programs that lead to employment in high skilled, high wage, and in-demand occupations.
            </p>
            <p className="oakton-description">
              The primary deliverable of this grant is employment after completion of the credential aligned with regional workforce gaps that provides a full-time job paying at least 30% above the regional living wage or is on a pathway to a family sustaining wage. Through this grant, all eligible students will receive tuition, fees, books, and supplies. Students will also receive up to $1,000 stipend to support outside costs like transportation and childcare or any other personal expense.
            </p>
            <p className="oakton-description" style={{ marginBottom: '0' }}>
              Please block about 10-20 minutes of your time to complete the Workforce Empowerment Initiative application.
            </p>

            <div className="oakton-form-container">
              <form onSubmit={handleSubmit}>
                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Your Answer" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="oakton-form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Your Answer" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your Answer" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="oakton-form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Your Answer" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="" disabled>Select…</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="oakton-form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="ageAtEnrollment">Age at Time of Enrollment</label>
                    <input type="number" id="ageAtEnrollment" name="ageAtEnrollment" value={ageAtEnrollment ?? ''} readOnly aria-readonly="true" placeholder="Calculated from DOB" />
                  </div>

                  <div className="oakton-form-group">
                    <label htmlFor="ethnicityRace">Ethnicity/Race</label>
                    <input type="text" id="ethnicityRace" name="ethnicityRace" placeholder="Your Answer" value={formData.ethnicityRace} onChange={handleChange} required />
                  </div>
                </div>

                <div className="oakton-form-row">
                  <div className="oakton-form-group">
                    <label htmlFor="currentCity">Current City</label>
                    <input type="text" id="currentCity" name="currentCity" placeholder="Your Answer" value={formData.currentCity} onChange={handleChange} required />
                  </div>

                  <div className="oakton-form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input type="text" id="zipCode" name="zipCode" placeholder="Your Answer" value={formData.zipCode} onChange={handleChange} required />
                  </div>
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
              {/* Replace these with the actual image exports from Figma */}
              <img src="https://via.placeholder.com/400x200" alt="Student smiling" />
              <img src="https://via.placeholder.com/200x200" alt="Student working" />
              <img src="https://via.placeholder.com/200x200" alt="Medical student" />
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