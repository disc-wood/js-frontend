import React, { useState } from "react";
import styled from "styled-components";
import TabCard from "@/common/components/atoms/TabCard";

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
  background:rgb(255, 255, 255);
  border-radius: 10px;
  overflow: auto;
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #555;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #444;
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

function EditableTable() {

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

  const handleChange = (rowIndex, field, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][field] = value;
    setRows(updatedRows);
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

export default function Database() {

  const tabs = [
    {
      label: "Oakton Community College",
      content: <EditableTable />
    },
    {
      label: "I Hope They Understand",
      content: <div>Content coming soon</div>
    }
  ];

  return (
    <PageContainer>
      <PageTitle>Database</PageTitle>

      <TabCard tabs={tabs} />

    </PageContainer>
  );
}