// Domain types mirroring the MongoDB collections described in the project plan
// (users, sessions, chats, resumes, feedback). Kept UI-friendly (camelCase, string ids).

export type QuestionLevel = 'low' | 'medium' | 'high';
export type WorkflowType = 'match' | 'questions' | 'mixed';
export type SessionStatus = 'active' | 'archived';

export interface User {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
}

export interface JdSnapshot {
  title: string;
  skills: string[];
  text: string;
}

export interface Session {
  id: string;
  title: string;
  workflowType: WorkflowType;
  jdSnapshot: JdSnapshot;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateMatch {
  resumeId: string;
  candidateRef: string;
  name: string;
  role: string;
  yearsExperience: number;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

export interface ResumeExperienceEntry {
  title: string;
  period: string;
}

export interface ResumeDetail {
  resumeId: string;
  candidateRef: string;
  name: string;
  role: string;
  yearsExperience: number;
  skills: string[];
  summary: string;
  experience: ResumeExperienceEntry[];
  education: string;
}

export interface InterviewQuestion {
  text: string;
  skill?: string;
}

export interface Feedback {
  chatId: string;
  rating: number; // 1-5
  thumbs: 'up' | 'down' | '';
  comment: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  type: Extract<WorkflowType, 'match' | 'questions'>;
  createdAt: string;
}

export type ResumeViewMode = 'pdf' | 'summary';
export type WorkspaceModule = 'jd' | 'matches' | 'candidate';
