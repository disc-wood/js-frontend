import React, { useState } from "react";
import styled from "styled-components";
import TabCard from "@/common/components/atoms/TabCard";
import { programs } from "@/config/programs";

// --- Styled Components ---
const PageContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: auto;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text);
`;

const TableWrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  overflow: auto;
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: black;
  font-size: 0.9rem;

  &:focus {
    outline: 1px solid #6aa9ff;
  }
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
    { key: "startDate", label: "Start Date" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "birthday", label: "Birthday" },
    { key: "racialIdentity", label: "Racial Identity" },
    { key: "gender", label: "Gender" },
    { key: "zipCode", label: "Zip Code" },
    { key: "programInterest", label: "Program of Interest" },
    { key: "termInterest", label: "Term of Interest" },
    { key: "workAuthorization", label: "U.S. Work Authorization" },
    { key: "employment", label: "Employment Status" }
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
            <tr key={rowIndex}>
              {columns.map((col) => (
                <Td key={col.key}>
                  <Input
                    value={row[col.key] || ""}
                    onChange={(e) =>
                      handleChange(rowIndex, col.key, e.target.value)
                    }
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

// --- Main Page ---
export default function Database() {
  const tabs = programs.map((p) => ({
    id: p.id,
    label: p.label,
    content: <EditableTable programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageTitle>Database</PageTitle>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}