import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TabCard from "@/common/components/atoms/TabCard";
import { programs } from "@/config/programs";
import { useUser } from '@/common/hooks/useUser';

// --- Styled Components ---
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

const TableWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
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

const ExpandIndicator = styled.span`
  display: inline-block;
  margin-right: 6px;
  color: #888888;
  font-size: 10px;
  width: 12px;
  transition: transform 0.15s ease;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
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

// --- Status pill / dropdown ---
const STATUS_COLORS = {
  Applied:    { bg: '#eef3f9', text: '#0C447C', border: '#c8d8eb' },
  Accepted:   { bg: '#e8f4ef', text: '#006853', border: '#cde0d5' },
  Rejected:   { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  Waitlisted: { bg: '#fdf6e8', text: '#854F0B', border: '#f6e4c0' },
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

// --- Confirmation Modal ---
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

// --- Column configuration ---
const OAKTON_COLUMNS = [
  { key: 'status', label: 'Status', isStatus: true },
  { key: 'submitted_at', label: 'Submitted', format: (v) => v ? new Date(v).toLocaleString() : '—' },
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'date_of_birth', label: 'DOB', format: (v) => v ? new Date(v).toLocaleDateString() : '—' },
  { key: 'age_at_enrollment', label: 'Age' },
  { key: 'racial_identity', label: 'Racial identity' },
  { key: 'gender', label: 'Gender' },
  { key: 'city_zip', label: 'City / Zip' },
  { key: 'programs_of_interest', label: 'Programs', format: (v) => Array.isArray(v) ? v.join(', ') : '—' },
  { key: 'term_of_interest', label: 'Term' },
  { key: 'projected_starting_term', label: 'Starting term' },
  { key: 'work_authorization', label: 'Work auth' },
  { key: 'employment_status', label: 'Employment', format: (v) => Array.isArray(v) ? v.join(', ') : '—' },
  { key: 'annual_income', label: 'Income' },
  { key: 'household_size', label: 'Household' },
  { key: 'program_format', label: 'Format' },
  { key: 'highest_education', label: 'Education' },
  { key: 'long_term_goals', label: 'Long-term goals' },
  { key: 'professional_goals', label: 'Professional goals' },
  { key: 'has_internet_access', label: 'Internet' },
  { key: 'has_computer_access', label: 'Computer' },
  { key: 'agrees_to_terms', label: 'Agreed to terms' },
  { key: 'how_did_you_hear', label: 'Source' },
  { key: 'intake_session_date', label: 'Intake session' },
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
];

const STATUS_OPTIONS = ['Applied', 'Accepted', 'Rejected', 'Waitlisted'];

function ProgramTable({ programId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [updatingStatus, setUpdatingStatus] = useState(null);  // intake id currently updating
  const [confirmAccept, setConfirmAccept] = useState(null);    // { id, name } when modal is open

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
      const endpoint = programId === 'oakton'
        ? `${baseUrl}/oaktonInfo/intakes`
        : programId === 'ihtu'
        ? `${baseUrl}/ihtuInfo/intakes`
        : null;

      if (!endpoint) {
        setRows([]);
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load data (HTTP ${response.status})`);
      }
      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch intakes:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

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
      const response = await fetch(`${baseUrl}/oaktonInfo/intakes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status (HTTP ${response.status})`);
      }

      // Update the row in local state without refetching
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusChange = (id, newStatus, row) => {
    if (newStatus === 'Accepted') {
      // Show confirmation modal
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

  const columns = programId === 'ihtu' ? IHTU_COLUMNS : OAKTON_COLUMNS;

  if (loading) {
    return <LoadingState>Loading {programId} submissions...</LoadingState>;
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (rows.length === 0) {
    return (
      <EmptyState>
        <EmptyStateTitle>No submissions yet</EmptyStateTitle>
        <EmptyStateText>When applicants submit the intake form, their data will appear here.</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <>
      <TableWrapper>
        <RowCount>
          {rows.length} {rows.length === 1 ? 'submission' : 'submissions'}
          <ExpandHint>· Click a row to expand</ExpandHint>
        </RowCount>
        <Table>
          <thead>
            <tr>
              {columns.map((col) => (
                <Th key={col.key}>{col.label}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedRows.has(row.id);
              return (
                <Tr key={row.id} $expanded={isExpanded} onClick={() => toggleRow(row.id)}>
                  {columns.map((col) => {
                    const value = row[col.key];

                    // Render status column as an interactive dropdown (Oakton only)
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
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </StatusSelect>
                        </Td>
                      );
                    }

                    const displayValue = col.format ? col.format(value) : (value ?? '—');
                    return (
                      <Td key={col.key} $expanded={isExpanded}>
                        {displayValue}
                      </Td>
                    );
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
              This will mark them as accepted and automatically create an enrolled student record where you can track their attendance, certification, and employment progress.
            </ModalText>
            <ModalActions>
              <ModalButton onClick={() => setConfirmAccept(null)}>Cancel</ModalButton>
              <ModalButton className="primary" onClick={confirmAcceptApplicant}>
                Accept applicant
              </ModalButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
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
    content: <ProgramTable programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Database</PageTitle>
        <PageSubtitle>View, edit, and manage learner data across programs.</PageSubtitle>
      </PageHeader>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}