import React, { useMemo, useState } from 'react';
import './ihtu-intake.css';

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

export default function IhtuIntake() {
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
    state: 'idle',
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

    const payload = { ...formData, ageAtEnrollment };

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/ihtuInfo/intakes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const msg = data?.error || `Failed to submit (HTTP ${response.status})`;
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
    <div className="ihtu-page-wrapper">

      <nav className="ihtu-nav">
        <h1>I Hope They Understand</h1>
        <h2>Intake Application</h2>
      </nav>

      <main className="ihtu-main">
        <h1 className="ihtu-welcome-title">
          Welcome to the <strong>I Hope They Understand</strong> Intake Application
        </h1>

        <p className="ihtu-description">
          Please fill out the form below to register for the program. This information
          helps us understand your background and connect you with the right resources.
        </p>

        <div className="ihtu-form-container">
          <form onSubmit={handleSubmit}>

            <div className="ihtu-form-row">
              <div className="ihtu-form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="Your Answer" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="ihtu-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Your Answer" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="ihtu-form-row">
              <div className="ihtu-form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your Answer" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="ihtu-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Your Answer" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="ihtu-form-row">
              <div className="ihtu-form-group">
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
              <div className="ihtu-form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
            </div>

            <div className="ihtu-form-row">
              <div className="ihtu-form-group">
                <label htmlFor="ageAtEnrollment">Age at Time of Enrollment</label>
                <input type="number" id="ageAtEnrollment" name="ageAtEnrollment" value={ageAtEnrollment ?? ''} readOnly aria-readonly="true" placeholder="Calculated from DOB" />
              </div>
              <div className="ihtu-form-group">
                <label htmlFor="ethnicityRace">Ethnicity / Race</label>
                <input type="text" id="ethnicityRace" name="ethnicityRace" placeholder="Your Answer" value={formData.ethnicityRace} onChange={handleChange} required />
              </div>
            </div>

            <div className="ihtu-form-row">
              <div className="ihtu-form-group">
                <label htmlFor="currentCity">Current City</label>
                <input type="text" id="currentCity" name="currentCity" placeholder="Your Answer" value={formData.currentCity} onChange={handleChange} required />
              </div>
              <div className="ihtu-form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" placeholder="Your Answer" value={formData.zipCode} onChange={handleChange} required />
              </div>
            </div>

            <div className="ihtu-form-actions">
              <button
                className="ihtu-submit-button"
                type="submit"
                disabled={submitStatus.state === 'submitting'}
              >
                {submitStatus.state === 'submitting' ? 'Submitting…' : 'Submit'}
              </button>
              {submitStatus.state !== 'idle' && (
                <p
                  className={`ihtu-submit-message ${
                    submitStatus.state === 'success'
                      ? 'ihtu-submit-message--success'
                      : submitStatus.state === 'error'
                        ? 'ihtu-submit-message--error'
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
      </main>

      <footer className="ihtu-footer">
        <p>LearnerTrack. All rights reserved © 2026</p>
      </footer>

    </div>
  );
}
