// Static sample data used only to populate the UI template.
// Replace with real API responses once the backend endpoints are wired up.

import type {
  HistoryEntry,
  InterviewQuestion,
  QuestionLevel,
  ResumeDetail,
} from '@/types/domain';

// Candidate matches now come from the backend (POST /api/v1/screening/search/); the sample rows live in
// the backend database (`python manage.py seed_sample_data`).

export const SAMPLE_RESUME_DETAILS: Record<string, ResumeDetail> = {
  r_104: {
    resumeId: 'r_104',
    candidateRef: 'CAND-0104',
    name: 'Candidate A',
    role: 'Data Engineer',
    yearsExperience: 8,
    skills: ['Python', 'SQL', 'Spark', 'Azure'],
    summary:
      'Built Spark batch and streaming pipelines on Azure Databricks for commercial analytics.',
    experience: [
      { title: 'Lead Data Engineer', period: '2021 – present' },
      { title: 'Data Engineer', period: '2018 – 2021' },
    ],
    education: 'B.Tech, Computer Science (synthetic sample)',
  },
};

export const SAMPLE_QUESTIONS: Record<QuestionLevel, InterviewQuestion[]> = {
  low: [
    { text: 'Describe a data pipeline you built end-to-end.' },
    { text: 'How do you validate data quality in SQL?' },
    { text: 'What is the difference between batch and streaming?' },
  ],
  medium: [
    { text: 'How would you partition and tune a large Spark join?' },
    { text: 'Walk through handling schema evolution in a lake table.' },
    { text: 'How do you design idempotent pipeline retries?' },
  ],
  high: [
    {
      text: 'Design a multi-tenant streaming platform with exactly-once semantics on Azure.',
    },
    { text: 'How would you cut a 6h batch job to under 1h at 10x data growth?' },
    { text: 'Defend a lakehouse vs warehouse decision for regulated data.' },
  ],
};

export const SAMPLE_HISTORY: HistoryEntry[] = [
  { id: 'h_1', title: 'Senior Data Engineer – shortlist', type: 'match', createdAt: 'Today' },
  { id: 'h_2', title: 'ML Engineer – screening', type: 'match', createdAt: '2 days ago' },
  {
    id: 'h_3',
    title: 'Interview Qs – Candidate A',
    type: 'questions',
    createdAt: '3 days ago',
  },
  {
    id: 'h_4',
    title: 'Analytics Lead – shortlist',
    type: 'match',
    createdAt: '12 days ago',
  },
];
