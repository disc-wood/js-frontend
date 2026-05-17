import React, { useState } from "react";
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;
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
`;

const Td = styled.td`
  padding: 0;
  border-bottom: 1px solid #f3f3f3;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background-color 0.1s ease;

  &:hover {
    background-color: #fafafa;
  }
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: #0a0a0a;
  font-size: 13px;
  font-family: inherit;
  padding: 12px 14px;
  box-sizing: border-box;

  &::placeholder {
    color: #bbbbbb;
  }

  &:focus {
    outline: none;
    background-color: #f0f7ff;
    box-shadow: inset 0 0 0 1px #0C447C;
  }
`;

const LoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: #555555;
  min-height: 100vh;
`;

function EditableTable({ programId }) {
  const [rows, setRows] = useState([
    {
      startDate: "10/11/2025 17:32:23",
      firstName: "Hannah",
      lastName: "Webb",
      email: "1@gmail.com",
      phone: "",
      birthday: "",
      racialIdentity: "",
      gender: "",
      zipCode: "",
      programInterest: "",
      termInterest: "",
      workAuthorization: "",
      employment: ""
    },
    {
      startDate: "10/11/2025 17:32:23",
      firstName: "Chris",
      lastName: "Zhou",
      email: "1@gmail.com",
      phone: "",
      birthday: "",
      racialIdentity: "",
      gender: "",
      zipCode: "",
      programInterest: "",
      termInterest: "",
      workAuthorization: "",
      employment: ""
    }
  ]);

  React.useEffect(() => {
    console.log("Load data for program:", programId);
  }, [programId]);

  const handleChange = (rowIndex, field, value) => {
    const updated = [...rows];
    updated[rowIndex][field] = value;
    setRows(updated);
  };

  const columns = [
    { key: "startDate", label: "Start date" },
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "birthday", label: "Birthday" },
    { key: "racialIdentity", label: "Racial identity" },
    { key: "gender", label: "Gender" },
    { key: "zipCode", label: "Zip code" },
    { key: "programInterest", label: "Program of interest" },
    { key: "termInterest", label: "Term of interest" },
    { key: "workAuthorization", label: "Work authorization" },
    { key: "employment", label: "Employment status" }
  ];

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((col) => (
                <Td key={col.key}>
                  <Input
                    value={row[col.key] || ""}
                    placeholder="—"
                    onChange={(e) =>
                      handleChange(rowIndex, col.key, e.target.value)
                    }
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
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
    content: <EditableTable programId={p.id} />,
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
