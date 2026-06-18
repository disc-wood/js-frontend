import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SubTabContent = styled.div`
  animation: ${fadeUp} 0.25s ease-out both;
`;
import TabCard from '@/common/components/atoms/TabCard';
import { programs } from "@/config/programs";
import { useUser } from '@/common/hooks/useUser';
import { authFetch } from '@/common/utils/authFetch';

// ===== Styled Components =====
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

const LoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #555555;
  min-height: 100vh;
`;

// --- Sub tabs (matches Database.jsx style) ---
const SubTabBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px 0;
  background-color: #fafafa;
  border-bottom: 1px solid #eaeaea;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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

// --- Dashboard surface ---
const DashboardSurface = styled.div`
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// --- KPI tiles ---
const KpiRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || 'repeat(auto-fit, minmax(180px, 1fr))'};
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
`;

const KpiTile = styled.div`
  background-color: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 14px 16px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 12px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || '1fr 1fr'};
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const KpiLabel = styled.div`
  font-size: 11px;
  color: #888888;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const KpiValue = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #0a0a0a;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const KpiSubtext = styled.div`
  font-size: 11px;
  color: #888888;
  margin-top: 4px;
`;

const CardTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0 0 14px 0;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

// --- Breakdown table (inside a card) ---
const BreakdownTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const BreakdownTh = styled.th`
  text-align: left;
  padding: 8px 10px;
  font-size: 11px;
  color: #888888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #eaeaea;
`;

const BreakdownTd = styled.td`
  padding: 9px 10px;
  border-bottom: 1px solid #f3f3f3;
  color: #0a0a0a;
  vertical-align: middle;
`;

const NumCell = styled(BreakdownTd)`
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #555;
`;

const BarCell = styled(BreakdownTd)`
  width: 40%;
  padding-right: 12px;
`;

const BarTrack = styled.div`
  background-color: #f3f3f3;
  border-radius: 6px;
  height: 8px;
  overflow: hidden;
`;

const BarFill = styled.div`
  background-color: ${({ $color }) => $color || '#0C447C'};
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  transition: width 0.3s ease;
`;

// --- Filter bar ---
const FilterBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  padding: 10px 12px;
  background-color: #fafafa;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  overflow-x: auto;
  white-space: nowrap;
`;

// One filter = label + select (or input) grouped, so they never break apart
const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const FilterLabel = styled.span`
  font-size: 12px;
  color: #888888;
  font-weight: 500;
`;

const FilterSelect = styled.select`
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
  max-width: 130px;

  &:hover { border-color: #0C447C; }
  &:focus { border-color: #0C447C; }
`;

const FilterNumberInput = styled.input`
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

// --- Donut chart ---
const DonutWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

const Legend = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  min-width: 140px;

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
  }
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #1f2937;
  padding: 3px 0;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  flex: 1;
  word-break: break-word;
`;

const LegendValue = styled.span`
  color: #888;
  font-variant-numeric: tabular-nums;
`;

const TableScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const ChartRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Coming-soon
const PlaceholderBox = styled.div`
  padding: 80px 40px;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #eaeaea;
  border-radius: 12px;
  color: #888888;
  font-size: 14px;
`;

// ===== Color palette (consistent with app) =====
const PALETTE = [
  '#0C447C', // primary blue
  '#006853', // green
  '#854F0B', // amber
  '#991b1b', // red
  '#7c3aed', // purple
  '#0891b2', // cyan
  '#c2410c', // orange
  '#15803d', // dark green
  '#9333ea', // violet
  '#475569', // slate
];

// ===== Helpers =====
const fmtMoney = (n) => {
  if (n == null || isNaN(n)) return '—';
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtPct = (n, total) => {
  if (!total) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
};

function tallyBy(rows, keyFn) {
  const map = new Map();
  rows.forEach((r) => {
    const keys = keyFn(r);
    const arr = Array.isArray(keys) ? keys : [keys];
    arr.forEach((k) => {
      if (k == null || k === '') return;
      map.set(k, (map.get(k) || 0) + 1);
    });
  });
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

// ===== Donut chart (SVG) =====
function Donut({ data, size = 140, thickness = 26 }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <div style={{ color: '#888', fontSize: 12 }}>No data</div>;

  const radius = size / 2;
  const inner = radius - thickness;

  // Build arcs without mutating any render-scope variable
  const arcs = data.reduce((acc, d, i) => {
    const prevEnd = acc.length ? acc[acc.length - 1].endAngle : 0;
    const startAngle = prevEnd;
    const endAngle = startAngle + (d.count / total) * 2 * Math.PI;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const xi2 = radius + inner * Math.sin(endAngle);
    const yi2 = radius - inner * Math.cos(endAngle);
    const xi1 = radius + inner * Math.sin(startAngle);
    const yi1 = radius - inner * Math.cos(startAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      'Z',
    ].join(' ');

    acc.push({
      endAngle,
      element: <path key={i} d={path} fill={PALETTE[i % PALETTE.length]} />,
    });
    return acc;
  }, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="distribution chart">
      {arcs.map(a => a.element)}
      <text
        x={radius}
        y={radius - 4}
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill="#0a0a0a"
      >
        {total}
      </text>
      <text x={radius} y={radius + 14} textAnchor="middle" fontSize="10" fill="#888">
        total
      </text>
    </svg>
  );
}

function DonutWithLegend({ data, size }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <DonutWrap>
      <Donut data={data} size={size} />
      <Legend>
        {data.map((d, i) => (
          <LegendItem key={d.label}>
            <LegendDot $color={PALETTE[i % PALETTE.length]} />
            <LegendLabel title={d.label}>{d.label}</LegendLabel>
            <LegendValue>{d.count} ({fmtPct(d.count, total)})</LegendValue>
          </LegendItem>
        ))}
      </Legend>
    </DonutWrap>
  );
}

// ===== Breakdown table component =====
function BreakdownList({ data, valueLabel = '#', colorIdx = 0 }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) {
    return <div style={{ color: '#888', fontSize: 12, padding: '8px 0' }}>No data</div>;
  }
  return (
    <TableScrollWrapper>
      <BreakdownTable>
        <thead>
          <tr>
            <BreakdownTh>Label</BreakdownTh>
            <BreakdownTh style={{ textAlign: 'right' }}>{valueLabel}</BreakdownTh>
            <BreakdownTh style={{ textAlign: 'right' }}>%</BreakdownTh>
            <BreakdownTh>{/* bar */}</BreakdownTh>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const pct = (d.count / total) * 100;
            return (
              <tr key={d.label}>
                <BreakdownTd>{d.label}</BreakdownTd>
                <NumCell>{d.count}</NumCell>
                <NumCell>{pct.toFixed(1)}%</NumCell>
                <BarCell>
                  <BarTrack>
                    <BarFill $pct={pct} $color={PALETTE[(colorIdx + i) % PALETTE.length]} />
                  </BarTrack>
                </BarCell>
              </tr>
            );
          })}
        </tbody>
      </BreakdownTable>
    </TableScrollWrapper>
  );
}

// ===== Data fetching hook =====
function useOaktonData() {
  const [intakes, setIntakes] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
    Promise.all([
      authFetch(`${baseUrl}/oaktonInfo/intakes`).then(r => r.ok ? r.json() : []),
      authFetch(`${baseUrl}/oaktonInfo/enrolled`).then(r => r.ok ? r.json() : []),
    ])
      .then(([i, e]) => {
        setIntakes(Array.isArray(i) ? i : []);
        setEnrolled(Array.isArray(e) ? e : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { intakes, enrolled, loading, error };
}

// ===== Shared helper used in both dashboards =====
const cityOf = (cityZip) => {
  if (!cityZip) return null;
  return cityZip.split(':')[0].trim();
};

function EarningsStrip({ amount, reportedCount }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      background: 'linear-gradient(135deg, rgb(231, 247, 239) 100%, #fff 100%)',
      border: '1px solid #006853',
      borderRadius: 10,
      padding: '14px 20px',
      marginBottom: 16,
    }}>
      <div>
        <div style={{ fontSize: 11, color: '#006853', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 4 }}>
          Estimated Total Cumulative Earnings
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#006853', letterSpacing: '-0.5px' }}>
          {fmtMoney(amount)}
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#006853' }}>
        From {reportedCount} reported wages
      </div>
    </div>
  );
}

// ===== MASTER DASHBOARD =====
function MasterDashboard() {
  const { intakes, enrolled, loading, error } = useOaktonData();

  // ─── Filters ───
  const [statusFilter, setStatusFilter] = useState('__all__');
  const [grantYearFilter, setGrantYearFilter] = useState('__all__');
  const [residencyFilter, setResidencyFilter] = useState('__all__');
  const [programFilter, setProgramFilter] = useState('__all__');
  const [industryFilter, setIndustryFilter] = useState('__all__');
  const [ageOp, setAgeOp] = useState('Equals'); // Equals | Greater than | Less than
  const [ageValue, setAgeValue] = useState('');
  const [earningPowerMode, setEarningPowerMode] = useState(String(new Date().getFullYear()));

  // Build a lookup of intake.id -> intake row so we can join enrolled → applicant data
  const intakeById = useMemo(() => {
    const m = new Map();
    intakes.forEach(i => m.set(i.id, i));
    return m;
  }, [intakes]);

  // Cross-data: pull applicant info onto each enrolled row for filtering
  const enrolledEnriched = useMemo(() => {
    return enrolled.map(e => ({
      ...e,
      _applicant: intakeById.get(e.intake_id) || null,
    }));
  }, [enrolled, intakeById]);

  // ─── Apply filters to enrolled (this drives most stats) ───
  const filteredEnrolled = useMemo(() => {
    return enrolledEnriched.filter(e => {
      if (statusFilter !== '__all__' && e.program_status !== statusFilter) return false;
      if (grantYearFilter !== '__all__' && String(e.program_year) !== grantYearFilter) return false;
      if (programFilter !== '__all__' && e.program_name !== programFilter) return false;
      if (industryFilter !== '__all__' && e.employer_industry !== industryFilter) return false;

      const residency = cityOf(e._applicant?.city_zip);
      if (residencyFilter !== '__all__' && residency !== residencyFilter) return false;

      if (ageValue !== '' && !isNaN(Number(ageValue))) {
        const age = e._applicant?.age_at_enrollment;
        if (age == null) return false;
        const target = Number(ageValue);
        if (ageOp === 'Equals' && age !== target) return false;
        if (ageOp === 'Greater than' && !(age > target)) return false;
        if (ageOp === 'Less than' && !(age < target)) return false;
      }

      return true;
    });
  }, [enrolledEnriched, statusFilter, grantYearFilter, residencyFilter, programFilter, industryFilter, ageOp, ageValue]);

  // Applicants follow a similar filter set (only those that make sense)
  const filteredApplicants = useMemo(() => {
    return intakes.filter(i => {
      if (grantYearFilter !== '__all__' && String(i.projected_starting_term_year) !== grantYearFilter) return false;
      if (programFilter !== '__all__' && !(i.programs_of_interest || []).includes(programFilter)) return false;
      if (residencyFilter !== '__all__' && cityOf(i.city_zip) !== residencyFilter) return false;
      if (ageValue !== '' && !isNaN(Number(ageValue))) {
        const age = i.age_at_enrollment;
        if (age == null) return false;
        const target = Number(ageValue);
        if (ageOp === 'Equals' && age !== target) return false;
        if (ageOp === 'Greater than' && !(age > target)) return false;
        if (ageOp === 'Less than' && !(age < target)) return false;
      }
      return true;
    });
  }, [intakes, grantYearFilter, programFilter, residencyFilter, ageOp, ageValue]);

  // ─── KPI calculations ───
  const totalStudents = filteredEnrolled.length;
  const completers = filteredEnrolled.filter(e => e.program_status === 'Completed');
  const employed = filteredEnrolled.filter(e => e.is_employed);
  const wages = filteredEnrolled.map(e => Number(e.hourly_wage)).filter(n => !isNaN(n) && n > 0);
  const wagesUnder25 = wages.filter(w => w < 25).length;
  const wagesAtOrAbove25 = wages.filter(w => w >= 25).length;
  const annualWages = filteredEnrolled.filter(e => e.is_employed).map(e => Number(e.annual_wage)).filter(n => !isNaN(n) && n > 0);
  const avgHourlyWage = wages.length ? wages.reduce((a, b) => a + b, 0) / wages.length : null;
  const avgAnnualWage = annualWages.length ? annualWages.reduce((a, b) => a + b, 0) / annualWages.length : null;
  const ages = filteredEnrolled.map(e => Number(e.age_at_enrollment)).filter(n => !isNaN(n) && n > 0);
  const avgAge = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : null;

  // Combined Earning Power: cycles through all available grant years + 'all'
  const enrolledGrantYears = useMemo(
    () => [...new Set(enrolled.map(e => String(e.program_year)).filter(Boolean))].sort(),
    [enrolled]
  );
  const cycleEarningPowerMode = () => {
    setEarningPowerMode(prev => {
      if (prev === 'all') return enrolledGrantYears[0] || 'all';
      const idx = enrolledGrantYears.indexOf(prev);
      if (idx === -1 || idx === enrolledGrantYears.length - 1) return 'all';
      return enrolledGrantYears[idx + 1];
    });
  };
  const earningPowerRows = earningPowerMode === 'all'
    ? filteredEnrolled
    : filteredEnrolled.filter(e => String(e.program_year) === earningPowerMode);
  const earningPowerWages = earningPowerRows.filter(e => e.is_employed).map(e => Number(e.annual_wage)).filter(n => !isNaN(n) && n > 0);
  const combinedEarningPower = earningPowerWages.reduce((a, b) => a + b, 0);

  // Estimated Total Cumulative Earnings: ALL enrolled ever, ignoring all filters
  const cumulativeEarnings = enrolled
    .filter(e => e.is_employed)
    .map(e => Number(e.annual_wage))
    .filter(n => !isNaN(n) && n > 0)
    .reduce((a, b) => a + b, 0);

  // ─── Breakdown tables ───
  const completionData = useMemo(() => {
    const completed = filteredEnrolled.filter(e => e.program_status === 'Completed').length;
    const inProgress = filteredEnrolled.filter(e =>
      e.program_status === 'Active' || e.program_status === 'On hold' || !e.program_status
    ).length;
    const dropped = filteredEnrolled.filter(e => e.program_status === 'Dropped').length;
    const inactive = filteredEnrolled.filter(e => e.program_status === 'Inactive').length;

    return [
      { label: 'Completed', count: completed },
      { label: 'In Progress', count: inProgress },
      { label: 'Dropped', count: dropped },
      { label: 'Inactive', count: inactive },
    ].filter(d => d.count > 0);
  }, [filteredEnrolled]);

  const completionRatePct = filteredEnrolled.length
    ? (filteredEnrolled.filter(e => e.program_status === 'Completed').length / filteredEnrolled.length) * 100
    : 0;

  // Employment Rate (Yes / No / Unknown — based on is_employed boolean)
  const employmentData = useMemo(() => {
    const yes = filteredEnrolled.filter(e => e.is_employed === true).length;
    const no = filteredEnrolled.filter(e => e.is_employed === false).length;
    const unknown = filteredEnrolled.filter(e => e.is_employed == null).length;
    return [
      { label: 'Yes', count: yes },
      { label: 'No', count: no },
      { label: 'Unknown', count: unknown },
    ].filter(d => d.count > 0);
  }, [filteredEnrolled]);

  // Highest Job Placements by Grant Year (only the employed ones)
  const placementsByYear = useMemo(
    () => tallyBy(filteredEnrolled.filter(e => e.is_employed), r => String(r.program_year || 'Unknown')),
    [filteredEnrolled]
  );

  // Wage breakdown by program (avg / min / max)
  const wagesByProgram = useMemo(() => {
    const map = new Map();
    filteredEnrolled.forEach(e => {
      const w = Number(e.hourly_wage);
      if (!isNaN(w) && w > 0 && e.program_name) {
        if (!map.has(e.program_name)) map.set(e.program_name, []);
        map.get(e.program_name).push(w);
      }
    });
    return [...map.entries()].map(([program, list]) => ({
      program,
      count: list.length,
      avg: list.reduce((a, b) => a + b, 0) / list.length,
      min: Math.min(...list),
      max: Math.max(...list),
    })).sort((a, b) => b.avg - a.avg);
  }, [filteredEnrolled]);

  // Ethnicity Representation (from joined applicants OR fallback to all filtered applicants)
  const ethnicityData = useMemo(() => {
    const rows = filteredEnrolled
      .map(e => e._applicant?.racial_identity)
      .filter(Boolean);
    if (rows.length === 0) {
      return tallyBy(filteredApplicants, r => r.racial_identity);
    }
    return tallyBy(rows.map(r => ({ r })), x => x.r);
  }, [filteredEnrolled, filteredApplicants]);

  // Gender (same fallback pattern)
  const genderData = useMemo(() => {
    const rows = filteredEnrolled
      .map(e => e._applicant?.gender)
      .filter(Boolean);
    if (rows.length === 0) {
      return tallyBy(filteredApplicants, r => r.gender);
    }
    return tallyBy(rows.map(r => ({ r })), x => x.r);
  }, [filteredEnrolled, filteredApplicants]);

  // ─── Filter options (derived) ───
  const statusOptions = ['Active', 'On hold', 'Completed', 'Dropped', 'Inactive'];
  const grantYearOptions = useMemo(() => {
    const s = new Set();
    enrolled.forEach(e => e.program_year && s.add(String(e.program_year)));
    intakes.forEach(i => i.projected_starting_term_year && s.add(String(i.projected_starting_term_year)));
    return [...s].sort();
  }, [enrolled, intakes]);
  const programOptions = useMemo(() => {
    const s = new Set();
    enrolled.forEach(e => e.program_name && s.add(e.program_name));
    intakes.forEach(i => (i.programs_of_interest || []).forEach(p => s.add(p)));
    return [...s].sort();
  }, [enrolled, intakes]);
  const industryOptions = useMemo(() => {
    const s = new Set(enrolled.map(e => e.employer_industry).filter(Boolean));
    return [...s].sort();
  }, [enrolled]);
  const residencyOptions = useMemo(() => {
    const s = new Set();
    intakes.forEach(i => {
      const c = cityOf(i.city_zip);
      if (c) s.add(c);
    });
    return [...s].sort();
  }, [intakes]);

  if (loading) return <DashboardSurface><div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading dashboard data...</div></DashboardSurface>;
  if (error) return <DashboardSurface><div style={{ padding: 40, color: '#991b1b' }}>Error: {error}</div></DashboardSurface>;

  return (
    <DashboardSurface>
      {/* ─── Filters (single line) ─── */}
      <FilterBar>
        <FilterGroup>
          <FilterLabel>Status:</FilterLabel>
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="__all__">All</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Grant Year:</FilterLabel>
          <FilterSelect value={grantYearFilter} onChange={(e) => setGrantYearFilter(e.target.value)}>
            <option value="__all__">All</option>
            {grantYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Residency:</FilterLabel>
          <FilterSelect value={residencyFilter} onChange={(e) => setResidencyFilter(e.target.value)}>
            <option value="__all__">All</option>
            {residencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Program:</FilterLabel>
          <FilterSelect value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
            <option value="__all__">All</option>
            {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Industry:</FilterLabel>
          <FilterSelect value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
            <option value="__all__">All</option>
            {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Age:</FilterLabel>
          <FilterSelect value={ageOp} onChange={(e) => setAgeOp(e.target.value)} style={{ maxWidth: 110 }}>
            <option>Equals</option>
            <option>Greater than</option>
            <option>Less than</option>
          </FilterSelect>
          <FilterNumberInput
            type="number"
            value={ageValue}
            onChange={(e) => setAgeValue(e.target.value)}
            placeholder="value"
          />
        </FilterGroup>
      </FilterBar>


      {/* ─── Top row: earnings + KPI tiles all inline ─── */}
<KpiRow $cols="2fr repeat(5, minmax(0, 1fr))">
  <KpiTile style={{
    background: 'linear-gradient(135deg, rgb(231, 247, 239) 100%, #fff 100%)',
    border: '1px solid #006853',
  }}>
    <div style={{ fontSize: 11, color: '#006853', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 4 }}>
      Estimated Total Cumulative Earnings
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: '#006853', letterSpacing: '-0.5px' }}>
      {fmtMoney(cumulativeEarnings)}
    </div>
    <div style={{ fontSize: 11, color: '#006853', marginTop: 4, opacity: 0.7 }}>All students, all time</div>
  </KpiTile>
  <KpiTile>
    <KpiLabel># of Students</KpiLabel>
    <KpiValue>{totalStudents}</KpiValue>
    <KpiSubtext>Enrolled in selection</KpiSubtext>
  </KpiTile>
  <KpiTile>
    <KpiLabel># of Completers</KpiLabel>
    <KpiValue>{completers.length}</KpiValue>
    <KpiSubtext>{completionRatePct.toFixed(1)}% completion rate</KpiSubtext>
  </KpiTile>
  <KpiTile>
    <KpiLabel># Employed</KpiLabel>
    <KpiValue>{employed.length}</KpiValue>
    <KpiSubtext>{totalStudents ? `${((employed.length / totalStudents) * 100).toFixed(1)}% rate` : '—'}</KpiSubtext>
  </KpiTile>
  <KpiTile>
    <KpiLabel>Wages Under $25/hr</KpiLabel>
    <KpiValue>{wagesUnder25}</KpiValue>
    <KpiSubtext>{wages.length ? `${((wagesUnder25 / wages.length) * 100).toFixed(1)}% of reported` : '—'}</KpiSubtext>
  </KpiTile>
  <KpiTile>
    <KpiLabel>Wages ≥ $25/hr</KpiLabel>
    <KpiValue>{wagesAtOrAbove25}</KpiValue>
    <KpiSubtext>{wages.length ? `${((wagesAtOrAbove25 / wages.length) * 100).toFixed(1)}% of reported` : '—'}</KpiSubtext>
  </KpiTile>
</KpiRow>

      <KpiRow>
        <KpiTile>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <KpiLabel style={{ margin: 0 }}>Combined Earning Power</KpiLabel>
            <button
              onClick={cycleEarningPowerMode}
              style={{ fontSize: 10, padding: '2px 7px', border: '1px solid #d4d4d4', borderRadius: 4, cursor: 'pointer', background: '#fff', color: '#555', fontFamily: 'inherit', flexShrink: 0, marginLeft: 6 }}
            >
              {earningPowerMode === 'all' ? 'All yrs' : earningPowerMode} ↕
            </button>
          </div>
          <KpiValue>{fmtMoney(combinedEarningPower)}</KpiValue>
          <KpiSubtext>{earningPowerMode === 'all' ? 'All grant years' : `Grant year ${earningPowerMode}`} · sum of annual wages</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Avg Annual Wage</KpiLabel>
          <KpiValue>{avgAnnualWage != null ? fmtMoney(avgAnnualWage) : '—'}</KpiValue>
          <KpiSubtext>{annualWages.length} reported</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Average Hourly Wage</KpiLabel>
          <KpiValue>{avgHourlyWage != null ? fmtMoney(avgHourlyWage) : '—'}</KpiValue>
          <KpiSubtext>{wages.length} reported</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Average Age</KpiLabel>
          <KpiValue>{avgAge ?? '—'}</KpiValue>
          <KpiSubtext>{ages.length} reported</KpiSubtext>
        </KpiTile>
      </KpiRow>

      {/* ─── 3-column row: Completion, Employment, Placements by Grant ─── */}
      <SectionGrid $cols="1fr 1fr 1fr">
        <Card>
          <CardTitle>Completion Rate</CardTitle>
          <BreakdownList data={completionData} valueLabel="#" colorIdx={1} />
        </Card>
        <Card>
          <CardTitle>Employment Rate</CardTitle>
          <BreakdownList data={employmentData} valueLabel="#" colorIdx={2} />
        </Card>
        <Card>
          <CardTitle>Job Placements by Grant Year</CardTitle>
          <BreakdownList data={placementsByYear} valueLabel="#" colorIdx={0} />
        </Card>
      </SectionGrid>
      {/* ─── Demographics ─── */}
      <SectionGrid>
        <Card>
          <CardTitle>Ethnicity Representation</CardTitle>
          <DonutWithLegend data={ethnicityData} size={150} />
        </Card>
        <Card>
          <CardTitle>Gender Representation</CardTitle>
          <DonutWithLegend data={genderData} size={150} />
        </Card>
      </SectionGrid>

      {/* ─── Wage Breakdown ─── */}
      <Card>
        <CardTitle>Wage Breakdown by Program</CardTitle>
        {wagesByProgram.length === 0 ? (
          <div style={{ color: '#888', fontSize: 12 }}>No wage data yet.</div>
        ) : (
          <TableScrollWrapper>
            <BreakdownTable>
              <thead>
                <tr>
                  <BreakdownTh>Program</BreakdownTh>
                  <BreakdownTh style={{ textAlign: 'right' }}>#</BreakdownTh>
                  <BreakdownTh style={{ textAlign: 'right' }}>Avg</BreakdownTh>
                  <BreakdownTh style={{ textAlign: 'right' }}>Min</BreakdownTh>
                  <BreakdownTh style={{ textAlign: 'right' }}>Max</BreakdownTh>
                </tr>
              </thead>
              <tbody>
                {wagesByProgram.map((w) => (
                  <tr key={w.program}>
                    <BreakdownTd>{w.program}</BreakdownTd>
                    <NumCell>{w.count}</NumCell>
                    <NumCell>{fmtMoney(w.avg)}</NumCell>
                    <NumCell>{fmtMoney(w.min)}</NumCell>
                    <NumCell>{fmtMoney(w.max)}</NumCell>
                  </tr>
                ))}
              </tbody>
            </BreakdownTable>
          </TableScrollWrapper>
        )}
      </Card>
    </DashboardSurface>
  );
}

// ===== EMPLOYMENT IMPACT SNAPSHOT =====
function EmploymentSnapshot() {
  const { enrolled, loading, error } = useOaktonData();

  const [industryFilter, setIndustryFilter] = useState('__all__');
  const [cityFilter, setCityFilter] = useState('__all__');

  // Only employed records have meaningful data here
  const employed = useMemo(() => enrolled.filter(e => e.is_employed), [enrolled]);

  const filtered = useMemo(() => {
    return employed.filter(e => {
      if (industryFilter !== '__all__' && e.employer_industry !== industryFilter) return false;
      if (cityFilter !== '__all__' && e.employer_city !== cityFilter) return false;
      return true;
    });
  }, [employed, industryFilter, cityFilter]);

  // Avg hourly wage
  const wages = filtered.map(e => Number(e.hourly_wage)).filter(n => !isNaN(n) && n > 0);
  const avgWage = wages.length ? wages.reduce((a, b) => a + b, 0) / wages.length : null;

  // Annual wage stats for cumulative earnings
  const annualWages = filtered.map(e => Number(e.annual_wage)).filter(n => !isNaN(n) && n > 0);
  const cumulativeEarnings = annualWages.reduce((a, b) => a + b, 0);
  const avgAnnualWage = annualWages.length ? annualWages.reduce((a, b) => a + b, 0) / annualWages.length : null;

  // Employer listing (group by employer name + industry)
  const employerListing = useMemo(() => {
    const map = new Map();
    filtered.forEach(e => {
      const key = `${e.employer_name || 'Unknown'}|${e.employer_industry || '—'}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()]
      .map(([k, count]) => {
        const [employer, industry] = k.split('|');
        return { employer, industry, count };
      })
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // Employer breakdown
  const employerData = useMemo(
    () => tallyBy(filtered, r => r.employer_name),
    [filtered]
  );

  // Industry breakdown
  const industryData = useMemo(
    () => tallyBy(filtered, r => r.employer_industry),
    [filtered]
  );

  // City breakdown
  const cityData = useMemo(
    () => tallyBy(filtered, r => r.employer_city),
    [filtered]
  );

  // Filter options (derived from all employed, so filtering one doesn't kill the other)
  const industryOptions = useMemo(() => {
    const s = new Set(employed.map(e => e.employer_industry).filter(Boolean));
    return [...s].sort();
  }, [employed]);
  const cityOptions = useMemo(() => {
    const s = new Set(employed.map(e => e.employer_city).filter(Boolean));
    return [...s].sort();
  }, [employed]);

  const totalHires = filtered.length;

  if (loading) return <DashboardSurface><div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading snapshot...</div></DashboardSurface>;
  if (error) return <DashboardSurface><div style={{ padding: 40, color: '#991b1b' }}>Error: {error}</div></DashboardSurface>;

  return (
    <DashboardSurface>
      {/* ─── Filters ─── */}
      <FilterBar>
        <FilterLabel>Industry:</FilterLabel>
        <FilterSelect value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
          <option value="__all__">All</option>
          {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
        </FilterSelect>

        <FilterLabel>Employer City:</FilterLabel>
        <FilterSelect value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="__all__">All</option>
          {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </FilterSelect>
      </FilterBar>


      {/* ─── Earnings strip ─── */}
      <EarningsStrip amount={cumulativeEarnings} reportedCount={annualWages.length} />

      {/* ─── KPI tiles ─── */}
      <KpiRow>
        <KpiTile>
          <KpiLabel>Total Hires</KpiLabel>
          <KpiValue>{totalHires}</KpiValue>
          <KpiSubtext>In current selection</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Average Hourly Wage</KpiLabel>
          <KpiValue>{avgWage != null ? fmtMoney(avgWage) : '—'}</KpiValue>
          <KpiSubtext>{wages.length} reported</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Avg Annual Wage</KpiLabel>
          <KpiValue>{avgAnnualWage != null ? fmtMoney(avgAnnualWage) : '—'}</KpiValue>
          <KpiSubtext>{annualWages.length} reported</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Unique Employers</KpiLabel>
          <KpiValue>{employerListing.length}</KpiValue>
          <KpiSubtext>Hiring grads</KpiSubtext>
        </KpiTile>
      </KpiRow>

      {/* ─── Employer + Industry + City breakdown ─── */}
      <SectionGrid $cols="1fr 1fr 1fr" style={{ width: '100%' }}>
  <Card>
    <CardTitle>Hires by Employer</CardTitle>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <Donut data={employerData} size={140} />
    </div>
    <BreakdownList data={employerData} valueLabel="#" colorIdx={4} />
  </Card>
  <Card>
    <CardTitle>Hires by Industry</CardTitle>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <Donut data={industryData} size={140} />
    </div>
    <BreakdownList data={industryData} valueLabel="#" colorIdx={0} />
  </Card>
  <Card>
    <CardTitle>Hires by Employer City</CardTitle>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <Donut data={cityData} size={140} />
    </div>
    <BreakdownList data={cityData} valueLabel="#" colorIdx={2} />
  </Card>
</SectionGrid>
      {/* ─── Employer listing ─── */}
      <Card>
        <CardTitle>Employer Listing</CardTitle>
        {employerListing.length === 0 ? (
          <div style={{ color: '#888', fontSize: 12 }}>No employer data yet.</div>
        ) : (
          <TableScrollWrapper>
            <BreakdownTable>
              <thead>
                <tr>
                  <BreakdownTh>Employer</BreakdownTh>
                  <BreakdownTh>Industry</BreakdownTh>
                  <BreakdownTh style={{ textAlign: 'right' }}># Hires</BreakdownTh>
                </tr>
              </thead>
              <tbody>
                {employerListing.map((row) => (
                  <tr key={`${row.employer}|${row.industry}`}>
                    <BreakdownTd>{row.employer}</BreakdownTd>
                    <BreakdownTd>{row.industry}</BreakdownTd>
                    <NumCell>{row.count}</NumCell>
                  </tr>
                ))}
              </tbody>
            </BreakdownTable>
          </TableScrollWrapper>
        )}
      </Card>
    </DashboardSurface>
  );
}

// ===== OAKTON CONTAINER (with sub-tabs) =====
function OaktonDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('master');

  return (
    <>
      <SubTabBar>
        <SubTab $active={activeSubTab === 'master'} onClick={() => setActiveSubTab('master')}>
          Master Dashboard
        </SubTab>
        <SubTab $active={activeSubTab === 'snapshot'} onClick={() => setActiveSubTab('snapshot')}>
          Employment Impact Snapshot
        </SubTab>
      </SubTabBar>

      <SubTabContent key={activeSubTab}>
        {activeSubTab === 'master' ? <MasterDashboard /> : <EmploymentSnapshot />}
      </SubTabContent>
    </>
  );
}

// ===== IHTU PLACEHOLDER =====
// ===== IHTU DATA HOOK =====
function useIhtuData() {
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');
    authFetch(`${baseUrl}/ihtuInfo/intakes`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setIntakes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { intakes, loading, error };
}

// ===== IHTU DASHBOARD =====
function IhtuDashboard() {
  const { intakes, loading, error } = useIhtuData();

  const [cityFilter, setCityFilter] = useState('__all__');
  const [genderFilter, setGenderFilter] = useState('__all__');
  const [ethnicityFilter, setEthnicityFilter] = useState('__all__');

  const filtered = useMemo(() => {
    return intakes.filter(i => {
      if (cityFilter !== '__all__' && i.currentCity !== cityFilter) return false;
      if (genderFilter !== '__all__' && i.gender !== genderFilter) return false;
      if (ethnicityFilter !== '__all__' && i.ethnicityRace !== ethnicityFilter) return false;
      return true;
    });
  }, [intakes, cityFilter, genderFilter, ethnicityFilter]);

  // ─── KPIs ───
  const totalApplicants = filtered.length;

  const ages = filtered.map(i => i.age_at_enrollment).filter(a => a != null && !isNaN(a));
  const avgAge = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : '—';

  const knowsRacialIdentityPct = filtered.length
    ? ((filtered.filter(i => i.knows_healthy_racial_identity === 'Yes').length / filtered.length) * 100).toFixed(1)
    : '—';

  const discussedRacialPct = filtered.length
    ? ((filtered.filter(i => i.discussed_racial_identity === 'Yes').length / filtered.length) * 100).toFixed(1)
    : '—';

  const discussedCulturalPct = filtered.length
    ? ((filtered.filter(i => i.discussed_cultural_competence === 'Yes').length / filtered.length) * 100).toFixed(1)
    : '—';

  // ─── Breakdowns ───
  const ethnicityData = useMemo(() => tallyBy(filtered, r => r.ethnicity_race), [filtered]);
  const genderData = useMemo(() => tallyBy(filtered, r => r.gender), [filtered]);
  const cityData = useMemo(() => tallyBy(filtered, r => r.current_city), [filtered]);

  const racialIdentityAwarenessData = useMemo(() => {
    const yes = filtered.filter(i => i.knows_healthy_racial_identity === 'Yes').length;
    const no = filtered.filter(i => i.knows_healthy_racial_identity === 'No').length;
    return [{ label: 'Yes', count: yes }, { label: 'No', count: no }].filter(d => d.count > 0);
  }, [filtered]);

  const discussedRacialData = useMemo(() => {
    const yes = filtered.filter(i => i.discussed_racial_identity === 'Yes').length;
    const no = filtered.filter(i => i.discussed_racial_identity === 'No').length;
    return [{ label: 'Yes', count: yes }, { label: 'No', count: no }].filter(d => d.count > 0);
  }, [filtered]);

  const discussedCulturalData = useMemo(() => {
    const yes = filtered.filter(i => i.discussed_cultural_competence === 'Yes').length;
    const no = filtered.filter(i => i.discussed_cultural_competence === 'No').length;
    return [{ label: 'Yes', count: yes }, { label: 'No', count: no }].filter(d => d.count > 0);
  }, [filtered]);

  // ─── Filter options ───
  const cityOptions = useMemo(() => [...new Set(intakes.map(i => i.current_city).filter(Boolean))].sort(), [intakes]);
  const genderOptions = useMemo(() => [...new Set(intakes.map(i => i.gender).filter(Boolean))].sort(), [intakes]);
  const ethnicityOptions = useMemo(() => [...new Set(intakes.map(i => i.ethnicity_race).filter(Boolean))].sort(), [intakes]);

  if (loading) return <DashboardSurface><div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading IHTU data...</div></DashboardSurface>;
  if (error) return <DashboardSurface><div style={{ padding: 40, color: '#991b1b' }}>Error: {error}</div></DashboardSurface>;

  return (
    <DashboardSurface>

      {/* ─── Filters ─── */}
      <FilterBar>
        <FilterGroup>
          <FilterLabel>City:</FilterLabel>
          <FilterSelect value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            <option value="__all__">All</option>
            {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>Gender:</FilterLabel>
          <FilterSelect value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
            <option value="__all__">All</option>
            {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </FilterSelect>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>Ethnicity:</FilterLabel>
          <FilterSelect value={ethnicityFilter} onChange={e => setEthnicityFilter(e.target.value)}>
            <option value="__all__">All</option>
            {ethnicityOptions.map(e => <option key={e} value={e}>{e}</option>)}
          </FilterSelect>
        </FilterGroup>
      </FilterBar>


      {/* ─── KPI row ─── */}
      <KpiRow $cols="repeat(5, minmax(0, 1fr))">
        <KpiTile>
          <KpiLabel>Total Applicants</KpiLabel>
          <KpiValue>{totalApplicants}</KpiValue>
          <KpiSubtext>In current selection</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Avg Child Age</KpiLabel>
          <KpiValue>{avgAge}</KpiValue>
          <KpiSubtext>{ages.length} reported</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Know Racial Identity</KpiLabel>
          <KpiValue>{knowsRacialIdentityPct}{knowsRacialIdentityPct !== '—' ? '%' : ''}</KpiValue>
          <KpiSubtext>Aware of healthy racial identity</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Discussed Racial Identity</KpiLabel>
          <KpiValue>{discussedRacialPct}{discussedRacialPct !== '—' ? '%' : ''}</KpiValue>
          <KpiSubtext>With their child</KpiSubtext>
        </KpiTile>
        <KpiTile>
          <KpiLabel>Discussed Cultural Competence</KpiLabel>
          <KpiValue>{discussedCulturalPct}{discussedCulturalPct !== '—' ? '%' : ''}</KpiValue>
          <KpiSubtext>With their child</KpiSubtext>
        </KpiTile>
      </KpiRow>

      {/* ─── Demographics ─── */}
      <SectionGrid $cols="1fr 1fr">
        <Card>
          <CardTitle>Ethnicity / Race</CardTitle>
          <DonutWithLegend data={ethnicityData} size={150} />
        </Card>
        <Card>
          <CardTitle>Gender</CardTitle>
          <DonutWithLegend data={genderData} size={150} />
        </Card>
      </SectionGrid>

      {/* ─── Awareness & Conversations ─── */}
      <SectionGrid $cols="1fr 1fr 1fr">
        <Card>
          <CardTitle>Knows Healthy Racial Identity</CardTitle>
          <DonutWithLegend data={racialIdentityAwarenessData} size={130} />
        </Card>
        <Card>
          <CardTitle>Discussed Racial Identity</CardTitle>
          <DonutWithLegend data={discussedRacialData} size={130} />
        </Card>
        <Card>
          <CardTitle>Discussed Cultural Competence</CardTitle>
          <DonutWithLegend data={discussedCulturalData} size={130} />
        </Card>
      </SectionGrid>

      {/* ─── City distribution ─── */}
      <Card>
        <CardTitle>Applicants by City</CardTitle>
        <ChartRow>
          <div style={{ flex: 1, minWidth: 0 }}>
            <BreakdownList data={cityData} valueLabel="#" colorIdx={0} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <Donut data={cityData} size={150} />
          </div>
        </ChartRow>
      </Card>

    </DashboardSurface>
  );
}

// ===== PROGRAM ROUTER =====
function ProgramDashboard({ programId }) {
  if (programId === 'oakton') return <OaktonDashboard />;
  if (programId === 'ihtu') return <IhtuDashboard />;
  return (
    <DashboardSurface>
      <PlaceholderBox>No dashboard configured for this program yet.</PlaceholderBox>
    </DashboardSurface>
  );
}

// ===== MAIN =====
export default function Dashboard() {
  const { role, assignedPrograms, loading } = useUser();

  if (loading) return <LoadingState>Loading...</LoadingState>;

  const visiblePrograms = role === 'admin'
    ? programs
    : programs.filter(p => assignedPrograms.includes(p.id));

  const tabs = visiblePrograms.map((p) => ({
    id: p.id,
    label: p.label,
    content: <ProgramDashboard programId={p.id} />,
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageSubtitle>Program performance and learner outcomes at a glance.</PageSubtitle>
      </PageHeader>
      <TabCard tabs={tabs} />
    </PageContainer>
  );
}
