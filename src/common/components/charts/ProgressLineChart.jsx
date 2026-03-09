import React from 'react';
//Make sure to run "npm install recharts"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ProgressLineChart({ data }) {
  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Enrolled Students Over Time by Program</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="program1" stroke="#3B82F6" />
          <Line type="monotone" dataKey="program2" stroke="#10B981" />
          <Line type="monotone" dataKey="program3" stroke="#F59E0B" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}