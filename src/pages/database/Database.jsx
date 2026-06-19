import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import TabCard from "@/common/components/atoms/TabCard";
import { programs } from "@/config/programs";
import { useUser } from '@/common/hooks/useUser';
import { authFetch } from '@/common/utils/authFetch';

// --- Styled Components ---
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SubTabContent = styled.div`
  animation: ${fadeUp} 0.25s ease-out both;
`;
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem 2.5rem;
  overflow: auto;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
  color: #0a0a0a;
`;

const PageSubtitle = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
`;

const SubTabBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px 0;
  background-color: #fafafa;
  border-bottom: 1px solid #eaeaea;
`;

const SubTab = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $active }) => $active ? '#0a0a0a' : '#888888'};
  border-bottom: 2px solid ${({ $active }) => $active ? '#0C447C' : 'transparent'};
  margin-bottom: -1px;
  transition: color 0.15s ease;

  &:hover { color: #0a0a0a; }
`;

const SubTabBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 10px;
  background-color: ${({ $active }) => $active ? '#0C447C' : '#eaeaea'};
  color: ${({ $active }) => $active ? '#ffffff' : '#555555'};
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-top: none;
  border-radius: 0 0 12px 12px;
  overflow: auto;
  max-height: 70vh;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;
  table-layout: fixed;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid #eaeaea;
  background-color: #fafafa;
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
  width: 180px;
  min-width: 180px;
  max-width: 180px;
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #f3f3f3;
  font-size: 13px;
  color: #0a0a0a;
  vertical-align: top;
  width: 180px;
  min-width: 180px;
  max-width: 180px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: ${({ $expanded }) => ($expanded ? 'normal' : 'nowrap')};
  overflow: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
  text-overflow: ${({ $expanded }) => ($expanded ? 'clip' : 'ellipsis')};
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:hover { background-color: #fafafa; }

  ${({ $expanded }) => $expanded && `
    background-color: #f5f9f7;
    &:hover { background-color: #eef5f1; }
  `}
`;

const LoadingState = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #555555;
  padding: 2rem;
`;

const EmptyState = styled.div`
  padding: 60px 24px;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #eaeaea;
  border-radius: 12px;
  margin: 12px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0 0 8px 0;
`;

const EmptyStateText = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
`;

// Page-level "no access" state (matches Forms/Communications/Dashboard) — distinct from
// the EmptyState above, which is used for in-tab "no data yet" states.
const NoAccessState = styled.div`
  border: 1px dashed #eaeaea;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  background-color: #fafafa;
`;

const NoAccessTitle = styled.h3`
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
  margin: 0 0 8px 0;
`;

const NoAccessText = styled.p`
  font-size: 13px;
  color: #888888;
  margin: 0;
  line-height: 1.6;
`;

const ErrorState = styled.div`
  padding: 16px 20px;
  margin: 12px;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
`;

const RowCount = styled.div`
  font-size: 12px;
  color: #888888;
  padding: 12px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #eaeaea;
`;

const ExpandHint = styled.span`
  font-size: 11px;
  color: #bbbbbb;
  margin-left: 8px;
  font-style: italic;
`;

// --- Status pill ---
const STATUS_COLORS = {
  Applied:    { bg: '#eef3f9', text: '#0C447C', border: '#c8d8eb' },
  Accepted:   { bg: '#e8f4ef', text: '#006853', border: '#cde0d5' },
  Rejected:   { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  Waitlisted: { bg: '#fdf6e8', text: '#854F0B', border: '#f6e4c0' },
  Active:     { bg: '#e8f4ef', text: '#006853', border: '#cde0d5' },
  'On hold':  { bg: '#fdf6e8', text: '#854F0B', border: '#f6e4c0' },
  Completed:  { bg: '#eef3f9', text: '#0C447C', border: '#c8d8eb' },
  Dropped:    { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  Inactive:   { bg: '#f3f3f3', text: '#555555', border: '#e0e0e0' },
};

const StatusSelect = styled.select`
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  border: 1px solid ${({ $status }) => STATUS_COLORS[$status]?.border || '#eaeaea'};
  background-color: ${({ $status }) => STATUS_COLORS[$status]?.bg || '#ffffff'};
  color: ${({ $status }) => STATUS_COLORS[$status]?.text || '#0a0a0a'};
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: wait; }
`;

const EditableInput = styled.input`
  font-family: inherit;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  color: #0a0a0a;

  &:hover { border-color: #d4d4d4; background-color: #fafafa; }
  &:focus { border-color: #0C447C; background-color: #ffffff; }
`;

const BooleanToggle = styled.button`
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid ${({ $value }) => $value ? '#cde0d5' : '#eaeaea'};
  background-color: ${({ $value }) => $value ? '#e8f4ef' : '#fafafa'};
  color: ${({ $value }) => $value ? '#006853' : '#888888'};
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }
`;

// --- Modal ---
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  max-width: 440px;
  width: calc(100% - 32px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0 0 12px 0;
`;

const ModalText = styled.p`
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #eaeaea;
  background-color: #ffffff;
  color: #0a0a0a;
  transition: background-color 0.15s ease;

  &:hover { background-color: #fafafa; }

  &.primary {
    background-color: #006853;
    color: #ffffff;
    border-color: #006853;
  }
  &.primary:hover { background-color: #004d3d; }
`;

// --- Term filter ---
const TermFilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #eaeaea;
  font-size: 13px;
  overflow-x: auto;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

const TermFilterLabel = styled.span`
  color: #888888;
  font-weight: 500;
`;

const TermFilterSelect = styled.select`
  font-family: inherit;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  color: #0a0a0a;
  cursor: pointer;
  outline: none;
  min-width: 220px;

  &:hover { border-color: #0C447C; }
  &:focus { border-color: #0C447C; }
`;

const EnrolledFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const EnrolledFilterLabel = styled.span`
  font-size: 12px;
  color: #888888;
  font-weight: 500;
`;

const EnrolledFilterSelect = styled.select`
  font-family: inherit;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  color: #0a0a0a;
  cursor: pointer;
  outline: none;
  min-width: 0;
  max-width: 140px;

  &:hover { border-color: #0C447C; }
  &:focus { border-color: #0C447C; }
`;

const EnrolledFilterNumberInput = styled.input`
  font-family: inherit;
  font-size: 12px;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  width: 60px;
  outline: none;

  &:hover { border-color: #0C447C; }
  &:focus { border-color: #0C447C; }
`;

function termValueKey(t) {
  return `${t.year}|${t.season}|${t.session || ''}`;
}

function useTermFilter() {
  const [terms, setTerms] = useState([]);
  const [currentTermKey, setCurrentTermKey] = useState('__all__');
  const [selectedTermKey, setSelectedTermKey] = useState('__all__');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

    Promise.all([
      authFetch(`${baseUrl}/oaktonInfo/term-dates`).then(r => r.ok ? r.json() : []),
      authFetch(`${baseUrl}/oaktonInfo/term-dates/current`).then(r => r.ok ? r.json() : null),
    ]).then(([allTerms, current]) => {
      setTerms(Array.isArray(allTerms) ? allTerms : []);
      if (current && current.year) {
        setCurrentTermKey(termValueKey(current));
      }
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  return { terms, selectedTermKey, setSelectedTermKey, currentTermKey, ready };
}

// Helper: combines a primary answer with its "Other" specification
const withOther = (primary, other) => {
  if (primary === 'Other' && other) return `Other: ${other}`;
  return primary || '—';
};

// --- Column configs ---
const OAKTON_APPLICANT_COLUMNS = [
  { key: 'status', label: 'Status', isStatus: true, statusOptions: ['Applied', 'Accepted', 'Rejected', 'Waitlisted'] },
  { key: 'submitted_at', label: 'Submitted', format: (v) => v ? new Date(v).toLocaleString() : '—' },
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'date_of_birth', label: 'DOB', format: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  { key: 'age_at_enrollment', label: 'Age' },
  { key: 'racial_identity', label: 'Racial identity' },
  { key: 'gender', label: 'Gender', format: (v, row) => withOther(v, row?.gender_other) },
  { key: 'city_zip', label: 'City / Zip', format: (v, row) => withOther(v, row?.city_zip_other) },
  { key: 'programs_of_interest', label: 'Programs', format: (v) => Array.isArray(v) ? v.join(', ') : '—' },
  { key: 'projected_starting_term_year', label: 'Starting year' },
  { key: 'projected_starting_term_season', label: 'Starting term' },
  { key: 'projected_starting_term_summer_session', label: 'Summer session' },
  { key: 'work_authorization', label: 'Work auth', format: (v, row) => withOther(v, row?.work_authorization_other) },
  { key: 'employment_status', label: 'Employment', format: (v) => Array.isArray(v) ? v.join(', ') : '—' },
  { key: 'weekly_work_hours', label: 'Weekly hours' },
  { key: 'annual_income', label: 'Income' },
  { key: 'household_size', label: 'Household' },
  { key: 'program_format', label: 'Format', format: (v, row) => withOther(v, row?.program_format_other) },
  { key: 'english_proficiency', label: 'English proficiency', format: (v, row) => withOther(v, row?.english_proficiency_other) },
  { key: 'esl_level', label: 'ESL level' },
  { key: 'is_current_oakton_student', label: 'Current Oakton student' },
  { key: 'has_taken_oakton_classes', label: 'Past Oakton classes' },
  { key: 'current_enrollment_details', label: 'Current enrollment' },
  { key: 'has_applied_for_fafsa', label: 'FAFSA' },
  { key: 'has_received_wei', label: 'Prior WEI' },
  { key: 'other_programs_applied_to', label: 'Other programs', format: (v) => Array.isArray(v) ? v.join(', ') : '—' },
  { key: 'highest_education', label: 'Education' },
  { key: 'long_term_goals', label: 'Long-term goals' },
  { key: 'professional_goals', label: 'Professional goals' },
  { key: 'has_personal_issues', label: 'Personal issues' },
  { key: 'personal_issues_explanation', label: 'Personal issues notes' },
  { key: 'transportation_concern', label: 'Transportation' },
  { key: 'transportation_explanation', label: 'Transportation notes' },
  { key: 'childcare_concern', label: 'Childcare' },
  { key: 'childcare_explanation', label: 'Childcare notes' },
  { key: 'can_attend_classes', label: 'Can attend classes' },
  { key: 'has_good_study_habits', label: 'Study habits' },
  { key: 'can_spend_study_hours', label: 'Can study outside class' },
  { key: 'has_internet_access', label: 'Internet' },
  { key: 'has_computer_access', label: 'Computer' },
  { key: 'is_self_motivated', label: 'Self-motivated' },
  { key: 'needs_accommodations', label: 'Needs accommodations' },
  { key: 'accommodations_explanation', label: 'Accommodations notes' },
  { key: 'agrees_to_terms', label: 'Agreed to terms' },
  { key: 'other_comments', label: 'Other comments' },
  { key: 'how_did_you_hear', label: 'Source', format: (v, row) => withOther(v, row?.how_did_you_hear_other) },
  { key: 'intake_session_date', label: 'Intake session' },
  { key: 'custom_question', label: 'Custom question' },
  { key: 'custom_answer', label: 'Custom answer' },
];

const OAKTON_ENROLLED_COLUMNS = [
  { key: 'program_status', label: 'Status', isStatus: true, statusOptions: ['Active', 'On hold', 'Completed', 'Dropped', 'Inactive'] },
  { key: 'enrolled_at', label: 'Enrolled', format: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  { key: 'first_name', label: 'First name', editable: true, type: 'text' },
  { key: 'last_name', label: 'Last name', editable: true, type: 'text' },
  { key: 'email', label: 'Email', editable: true, type: 'email' },
  { key: 'racial_identity', label: 'Racial identity' },
  { key: 'phone_number', label: 'Phone', editable: true, type: 'tel' },
  { key: 'program_name', label: 'Program', editable: true, type: 'text' },
  { key: 'term', label: 'Term', editable: true, type: 'text' },
  { key: 'program_year', label: 'Year', editable: true, type: 'text' },
  { key: 'start_date', label: 'Start date', editable: true, type: 'date' },
  { key: 'end_date', label: 'End date', editable: true, type: 'date' },
  { key: 'first_attendance_verified', label: 'Attendance 1', editable: true, type: 'boolean' },
  { key: 'second_attendance_verified', label: 'Attendance 2', editable: true, type: 'boolean' },
  { key: 'certification_name', label: 'Certification', editable: true, type: 'text' },
  { key: 'certification_status', label: 'Cert status', editable: true, type: 'text' },
  { key: 'exam_passed', label: 'Exam passed', editable: true, type: 'boolean' },
  { key: 'is_employed', label: 'Employed', editable: true, type: 'boolean' },
  { key: 'date_of_hire', label: 'Hire date', editable: true, type: 'date' },
  { key: 'employer_name', label: 'Employer', editable: true, type: 'text' },
  { key: 'employer_city', label: 'Employer city', editable: true, type: 'text' },
  { key: 'employer_industry', label: 'Industry', editable: true, type: 'text' },
  { key: 'hourly_wage', label: 'Hourly wage', editable: true, type: 'number' },
  { key: 'annual_wage', label: 'Annual wage', editable: true, type: 'number' },
  { key: 'general_notes', label: 'Notes', editable: true, type: 'text' },
];

const IHTU_COLUMNS = [
  { key: 'submitted_at', label: 'Submitted', format: (v) => v ? new Date(v).toLocaleString() : '—' },
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'gender', label: 'Gender' },
  { key: 'date_of_birth', label: "Child's DOB", format: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  { key: 'age_at_enrollment', label: "Child's age" },
  { key: 'ethnicity_race', label: 'Race / Ethnicity' },
  { key: 'current_city', label: 'City' },
  { key: 'zip_code', label: 'Zip' },
  { key: 'knows_healthy_racial_identity', label: 'Knows healthy racial identity' },
  { key: 'discussed_racial_identity', label: 'Discussed racial identity' },
  { key: 'discussed_cultural_competence', label: 'Discussed cultural competence' },
  { key: 'custom_question', label: 'Custom question' },
  { key: 'custom_answer', label: 'Custom answer' },
];

function matchesTermFilter(row, selectedKey, isEnrolled) {
  if (selectedKey === '__all__') return true;
  const [year, season] = selectedKey.split('|');

  if (isEnrolled) {
    return String(row.program_year) === year && row.term === season;
  } else {
    return (
      String(row.projected_starting_term_year) === year &&
      row.projected_starting_term_season === season
    );
  }
}

// --- Applicants Table ---
// Accepts external rows/filteredRows from ProgramView (Oakton), or fetches its own (IHTU).
function ApplicantsTable({ programId, termFilter, rows: externalRows, filteredRows: externalFilteredRows, onStatusUpdate }) {
  const isExternal = externalRows !== undefined;
  const [internalRows, setInternalRows] = useState([]);
  const [loading, setLoading] = useState(!isExternal);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [confirmAccept, setConfirmAccept] = useState(null);

  useEffect(() => {
    if (isExternal) return;
    setLoading(true);
    setError(null);
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
    const endpoint = programId === 'ihtu' ? `${baseUrl}/ihtuInfo/intakes` : null;
    if (!endpoint) { setInternalRows([]); setLoading(false); return; }
    authFetch(endpoint)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => setInternalRows(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [programId, isExternal]);

  const rows = isExternal ? externalRows : internalRows;

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const response = await authFetch(`${baseUrl}/oaktonInfo/intakes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to update status (HTTP ${response.status})`);
      if (isExternal) {
        onStatusUpdate?.(id, newStatus);
      } else {
        setInternalRows((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusChange = (id, newStatus, row) => {
    if (newStatus === 'Accepted') {
      setConfirmAccept({ id, name: `${row.first_name} ${row.last_name}`, newStatus });
    } else {
      updateStatus(id, newStatus);
    }
  };

  const confirmAcceptApplicant = () => {
    if (confirmAccept) {
      updateStatus(confirmAccept.id, confirmAccept.newStatus);
      setConfirmAccept(null);
    }
  };

  const columns = programId === 'ihtu' ? IHTU_COLUMNS : OAKTON_APPLICANT_COLUMNS;

  const selectedKey = termFilter?.selectedTermKey || '__all__';
  const filteredRows = externalFilteredRows ?? (
    programId === 'oakton'
      ? rows.filter(r => matchesTermFilter(r, selectedKey, false))
      : rows
  );

  if (loading) return <LoadingState>Loading applicants...</LoadingState>;
  if (error) return <ErrorState>{error}</ErrorState>;
  if (rows.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No applicants yet</EmptyStateTitle>
        <EmptyStateText>When applicants submit the intake form, their data will appear here.</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <>
      <TableWrapper>
        <RowCount>
          {filteredRows.length === rows.length
            ? `${rows.length} ${rows.length === 1 ? 'applicant' : 'applicants'}`
            : `${filteredRows.length} of ${rows.length} applicants`}
          <ExpandHint>· Click a row to expand</ExpandHint>
        </RowCount>
        <Table>
          <thead>
            <tr>{columns.map((col) => <Th key={col.key}>{col.label}</Th>)}</tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              return (
                <Tr key={row.id} $expanded={isExpanded} onClick={() => toggleRow(row.id)}>
                  {columns.map((col) => {
                    const value = row[col.key];
                    if (col.isStatus && programId === 'oakton') {
                      const currentStatus = value || 'Applied';
                      return (
                        <Td key={col.key} $expanded={isExpanded} onClick={(e) => e.stopPropagation()}>
                          <StatusSelect
                            $status={currentStatus}
                            value={currentStatus}
                            disabled={updatingStatus === row.id}
                            onChange={(e) => handleStatusChange(row.id, e.target.value, row)}
                          >
                            {col.statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </StatusSelect>
                        </Td>
                      );
                    }
                    const displayValue = col.format ? col.format(value, row) : (value ?? '—');
                    return <Td key={col.key} $expanded={isExpanded}>{displayValue}</Td>;
                  })}
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>

      {confirmAccept && (
        <ModalBackdrop onClick={() => setConfirmAccept(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Accept {confirmAccept.name}?</ModalTitle>
            <ModalText>
              This will mark them as accepted, send them an acceptance email, and automatically create an enrolled student record where you can track their attendance, certification, and employment progress.
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => setConfirmAccept(null)}>Cancel</ModalButton>
              <ModalButton className="primary" onClick={confirmAcceptApplicant}>Accept applicant</ModalButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
    </>
  );
}

const cityOf = (cityZip) => {
  if (!cityZip) return null;
  return cityZip.split(':')[0].trim();
};

// --- Enrolled Table — data and filters provided by ProgramView ---
function EnrolledTable({ rows, filteredRows, setRows, refetch }) {
  const updateField = async (id, field, value) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const response = await authFetch(`${baseUrl}/oaktonInfo/enrolled/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!response.ok) throw new Error(`Failed to update (HTTP ${response.status})`);
    } catch (err) {
      console.error('Update failed, reverting:', err);
      refetch();
      alert(`Failed to save: ${err.message}`);
    }
  };

  if (rows.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No enrolled students yet</EmptyStateTitle>
        <EmptyStateText>When you accept an applicant from the Applicants tab, they'll appear here.</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <TableWrapper>
      <RowCount>
        {filteredRows.length === rows.length
          ? `${rows.length} enrolled ${rows.length === 1 ? 'student' : 'students'}`
          : `${filteredRows.length} of ${rows.length} enrolled students`}
        <ExpandHint>· Click cells to edit</ExpandHint>
      </RowCount>
      <Table>
        <thead>
          <tr>{OAKTON_ENROLLED_COLUMNS.map((col) => <Th key={col.key}>{col.label}</Th>)}</tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <Tr key={row.id}>
              {OAKTON_ENROLLED_COLUMNS.map((col) => (
                <EnrolledCell
                  key={`${row.id}-${col.key}-${row[col.key]}`}
                  row={row}
                  col={col}
                  updateField={updateField}
                />
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

// --- Individual cell renderer for enrolled table ---
function EnrolledCell({ row, col, updateField }) {
  const value = row[col.key];
  const [localValue, setLocalValue] = useState(value ?? '');

  if (col.isStatus) {
    const currentStatus = value || 'Active';
    return (
      <Td>
        <StatusSelect
          $status={currentStatus}
          value={currentStatus}
          onChange={(e) => updateField(row.id, col.key, e.target.value)}
        >
          {col.statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </StatusSelect>
      </Td>
    );
  }

  if (col.editable && col.type === 'boolean') {
    return (
      <Td>
        <BooleanToggle $value={!!value} onClick={() => updateField(row.id, col.key, !value)}>
          {value ? '✓ Yes' : '— No'}
        </BooleanToggle>
      </Td>
    );
  }

  if (col.editable) {
    const handleBlur = () => {
      if (String(localValue) !== String(value ?? '')) {
        let saveValue = localValue;
        if (col.type === 'number' && saveValue !== '') {
          saveValue = Number(saveValue);
        } else if (saveValue === '') {
          saveValue = null;
        }
        updateField(row.id, col.key, saveValue);
      }
    };

    let inputValue = localValue;
    if (col.type === 'date' && localValue) {
      inputValue = String(localValue).slice(0, 10);
    }

    return (
      <Td>
        <EditableInput
          type={col.type || 'text'}
          value={inputValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          placeholder="—"
        />
      </Td>
    );
  }

  const displayValue = col.format ? col.format(value) : (value ?? '—');
  return <Td>{displayValue}</Td>;
}

// --- Combined program view with sub-tabs (Oakton only) ---
function ProgramView({ programId }) {
  const [activeSubTab, setActiveSubTab] = useState('applicants');
  const termFilter = useTermFilter();

  // Data owned here so both tables and the filter bar share it
  const [intakes, setIntakes] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shared filter state
  const [statusFilter, setStatusFilter] = useState('__all__');
  const [racialIdentityFilter, setRacialIdentityFilter] = useState('__all__');
  const [residencyFilter, setResidencyFilter] = useState('__all__');
  const [programFilter, setProgramFilter] = useState('__all__');
  const [industryFilter, setIndustryFilter] = useState('__all__');
  const [employedFilter, setEmployedFilter] = useState('__all__');
  const [employerFilter, setEmployerFilter] = useState('__all__');
  const [ageOp, setAgeOp] = useState('Equals');
  const [ageValue, setAgeValue] = useState('');
  const [wageOp, setWageOp] = useState('Equals');
  const [wageValue, setWageValue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const [intakeData, enrolledData] = await Promise.all([
        authFetch(`${baseUrl}/oaktonInfo/intakes`).then(r => r.ok ? r.json() : []),
        authFetch(`${baseUrl}/oaktonInfo/enrolled`).then(r => r.ok ? r.json() : []),
      ]);
      setIntakes(Array.isArray(intakeData) ? intakeData : []);
      setEnrolled(Array.isArray(enrolledData) ? enrolledData : []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId === 'oakton') fetchData();
  }, [programId]);

  // Non-Oakton programs: just render the applicants table with its own fetching
  if (programId !== 'oakton') {
    return <ApplicantsTable programId={programId} termFilter={termFilter} />;
  }

  const selectedKey = termFilter?.selectedTermKey || '__all__';
  const isApplicants = activeSubTab === 'applicants';

  const applyAgeFilter = (r) => {
    if (ageValue === '' || isNaN(Number(ageValue))) return true;
    const age = r.age_at_enrollment;
    if (age == null) return false;
    const target = Number(ageValue);
    if (ageOp === 'Equals') return age === target;
    if (ageOp === 'Greater than') return age > target;
    if (ageOp === 'Less than') return age < target;
    return true;
  };

  const filteredIntakes = intakes
    .filter(r => matchesTermFilter(r, selectedKey, false))
    .filter(r => {
      if (statusFilter !== '__all__' && r.status !== statusFilter) return false;
      if (racialIdentityFilter !== '__all__' && r.racial_identity !== racialIdentityFilter) return false;
      if (residencyFilter !== '__all__' && cityOf(r.city_zip) !== residencyFilter) return false;
      if (programFilter !== '__all__' && !(r.programs_of_interest || []).includes(programFilter)) return false;
      return applyAgeFilter(r);
    });

  const filteredEnrolled = enrolled
    .filter(r => matchesTermFilter(r, selectedKey, true))
    .filter(r => {
      if (statusFilter !== '__all__' && r.program_status !== statusFilter) return false;
      if (racialIdentityFilter !== '__all__' && r.racial_identity !== racialIdentityFilter) return false;
      if (employedFilter === 'yes' && r.is_employed !== true) return false;
      if (employedFilter === 'no' && r.is_employed !== false) return false;
      if (employerFilter !== '__all__' && r.employer_name !== employerFilter) return false;
      if (residencyFilter !== '__all__' && r.employer_city !== residencyFilter) return false;
      if (programFilter !== '__all__' && r.program_name !== programFilter) return false;
      if (industryFilter !== '__all__' && r.employer_industry !== industryFilter) return false;
      if (wageValue !== '' && !isNaN(Number(wageValue))) {
        const wage = Number(r.hourly_wage);
        if (isNaN(wage)) return false;
        const target = Number(wageValue);
        if (wageOp === 'Equals' && wage !== target) return false;
        if (wageOp === 'Over' && !(wage > target)) return false;
        if (wageOp === 'Under' && !(wage < target)) return false;
      }
      return applyAgeFilter(r);
    });

  // Filter options derived from full (unfiltered) data so selecting one doesn't collapse another
  const racialIdentityOptions = [
    ...new Set([...intakes, ...enrolled].map(r => r.racial_identity).filter(Boolean))
  ].sort();
  const statusOptions = isApplicants
    ? ['Applied', 'Accepted', 'Rejected', 'Waitlisted']
    : ['Active', 'On hold', 'Completed', 'Dropped', 'Inactive'];
  const residencyLabel = isApplicants ? 'Residency' : 'Employer city';
  const residencyOptions = isApplicants
    ? [...new Set(intakes.map(r => cityOf(r.city_zip)).filter(Boolean))].sort()
    : [...new Set(enrolled.map(r => r.employer_city).filter(Boolean))].sort();
  const programOptions = isApplicants
    ? [...new Set(intakes.flatMap(r => r.programs_of_interest || []).filter(Boolean))].sort()
    : [...new Set(enrolled.map(r => r.program_name).filter(Boolean))].sort();
  const industryOptions = [...new Set(enrolled.map(r => r.employer_industry).filter(Boolean))].sort();
  const employerOptions = [...new Set(enrolled.map(r => r.employer_name).filter(Boolean))].sort();

  return (
    <>
      <SubTabBar>
        <SubTab $active={isApplicants} onClick={() => setActiveSubTab('applicants')}>
          Applicants
          <SubTabBadge $active={isApplicants}>{intakes.length}</SubTabBadge>
        </SubTab>
        <SubTab $active={!isApplicants} onClick={() => setActiveSubTab('enrolled')}>
          Enrolled
          <SubTabBadge $active={!isApplicants}>{enrolled.length}</SubTabBadge>
        </SubTab>
      </SubTabBar>

      {/* Single scrollable filter bar: term + all additional filters */}
      <TermFilterBar>
        {termFilter.ready && (
          <EnrolledFilterGroup style={{ flexShrink: 0 }}>
            <TermFilterLabel>Term:</TermFilterLabel>
            <TermFilterSelect
              value={termFilter.selectedTermKey}
              onChange={e => termFilter.setSelectedTermKey(e.target.value)}
            >
              <option value="__all__">All terms</option>
              {termFilter.terms.map(t => {
                const key = termValueKey(t);
                const label = t.session ? `${t.season} ${t.year} — ${t.session}` : `${t.season} ${t.year}`;
                return (
                  <option key={key} value={key}>
                    {label}{key === termFilter.currentTermKey ? ' (current)' : ''}
                  </option>
                );
              })}
            </TermFilterSelect>
          </EnrolledFilterGroup>
        )}

        <EnrolledFilterGroup>
          <EnrolledFilterLabel>Status:</EnrolledFilterLabel>
          <EnrolledFilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="__all__">All</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </EnrolledFilterSelect>
        </EnrolledFilterGroup>

        <EnrolledFilterGroup>
          <EnrolledFilterLabel>Race / ethnicity:</EnrolledFilterLabel>
          <EnrolledFilterSelect value={racialIdentityFilter} onChange={e => setRacialIdentityFilter(e.target.value)}>
            <option value="__all__">All</option>
            {racialIdentityOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </EnrolledFilterSelect>
        </EnrolledFilterGroup>

        {!isApplicants && (
          <>
            <EnrolledFilterGroup>
              <EnrolledFilterLabel>Employed:</EnrolledFilterLabel>
              <EnrolledFilterSelect value={employedFilter} onChange={e => setEmployedFilter(e.target.value)}>
                <option value="__all__">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </EnrolledFilterSelect>
            </EnrolledFilterGroup>
            <EnrolledFilterGroup>
              <EnrolledFilterLabel>Employer:</EnrolledFilterLabel>
              <EnrolledFilterSelect value={employerFilter} onChange={e => setEmployerFilter(e.target.value)}>
                <option value="__all__">All</option>
                {employerOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </EnrolledFilterSelect>
            </EnrolledFilterGroup>
          </>
        )}

        <EnrolledFilterGroup>
          <EnrolledFilterLabel>{residencyLabel}:</EnrolledFilterLabel>
          <EnrolledFilterSelect value={residencyFilter} onChange={e => setResidencyFilter(e.target.value)}>
            <option value="__all__">All</option>
            {residencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </EnrolledFilterSelect>
        </EnrolledFilterGroup>

        <EnrolledFilterGroup>
          <EnrolledFilterLabel>Program:</EnrolledFilterLabel>
          <EnrolledFilterSelect value={programFilter} onChange={e => setProgramFilter(e.target.value)}>
            <option value="__all__">All</option>
            {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </EnrolledFilterSelect>
        </EnrolledFilterGroup>

        {!isApplicants && (
          <EnrolledFilterGroup>
            <EnrolledFilterLabel>Industry:</EnrolledFilterLabel>
            <EnrolledFilterSelect value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
              <option value="__all__">All</option>
              {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
            </EnrolledFilterSelect>
          </EnrolledFilterGroup>
        )}

        <EnrolledFilterGroup>
          <EnrolledFilterLabel>Age:</EnrolledFilterLabel>
          <EnrolledFilterSelect value={ageOp} onChange={e => setAgeOp(e.target.value)} style={{ maxWidth: 110 }}>
            <option>Equals</option>
            <option>Greater than</option>
            <option>Less than</option>
          </EnrolledFilterSelect>
          <EnrolledFilterNumberInput
            type="number"
            value={ageValue}
            onChange={e => setAgeValue(e.target.value)}
            placeholder="value"
          />
        </EnrolledFilterGroup>

        {!isApplicants && (
          <EnrolledFilterGroup>
            <EnrolledFilterLabel>Wage:</EnrolledFilterLabel>
            <EnrolledFilterSelect value={wageOp} onChange={e => setWageOp(e.target.value)} style={{ maxWidth: 80 }}>
              <option>Equals</option>
              <option>Over</option>
              <option>Under</option>
            </EnrolledFilterSelect>
            <EnrolledFilterNumberInput
              type="number"
              value={wageValue}
              onChange={e => setWageValue(e.target.value)}
              placeholder="$/hr"
            />
          </EnrolledFilterGroup>
        )}
      </TermFilterBar>

      {loading && <LoadingState>Loading...</LoadingState>}
      {error && <ErrorState>{error}</ErrorState>}
      {!loading && !error && (
        <SubTabContent key={activeSubTab}>
          {isApplicants
            ? <ApplicantsTable
                programId={programId}
                rows={intakes}
                filteredRows={filteredIntakes}
                onStatusUpdate={(id, newStatus) =>
                  setIntakes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
                }
              />
            : <EnrolledTable
                rows={enrolled}
                filteredRows={filteredEnrolled}
                setRows={setEnrolled}
                refetch={fetchData}
              />
          }
        </SubTabContent>
      )}
    </>
  );
}

// --- Main Page ---
export default function Database() {
  const { role, assignedPrograms, loading } = useUser();
  if (loading) return <LoadingState>Loading...</LoadingState>;

  const visiblePrograms = role === 'admin'
    ? programs
    : programs.filter(p => assignedPrograms.includes(p.id));

  const tabs = visiblePrograms.map((p) => ({
    id: p.id,
    label: p.label,
    content: <ProgramView programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Database</PageTitle>
        <PageSubtitle>View, edit, and manage learner data across programs.</PageSubtitle>
      </PageHeader>
      {visiblePrograms.length === 0 ? (
        <NoAccessState>
          <NoAccessTitle>No database access available</NoAccessTitle>
          <NoAccessText>
            You don't have access to any program databases yet. Contact an admin to request access.
          </NoAccessText>
        </NoAccessState>
      ) : (
        <TabCard tabs={tabs} />
      )}
    </PageContainer>
  );
}