
export enum UserRole {
  ADMIN = 'ADMIN',
  GROUP = 'GROUP'
}

export interface ScoreLog {
  id: string;
  timestamp: number;
  oldScore: number;
  newScore: number;
  adminId: string;
}

export interface Group {
  id: string;
  name: string;
  accessCode: string;
  score: number;
  logs: ScoreLog[];
}

export interface AuthState {
  user: {
    id: string;
    name: string;
    role: UserRole;
  } | null;
}

export interface AppData {
  groups: Group[];
  activityLogs: string[];
}
