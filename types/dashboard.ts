// types/dashboard.ts
/**
 * Dashboard Type Definitions
 * Backend DashboardResponseDTO ile eşleşir
 */

export interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  completedApplications: number;
}

export interface ApplicationTrend {
  currentWeekApplications: number;
  previousWeekApplications: number;
  weeklyAverage: number;
  percentageChange: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface WeeklyTrendData {
  week: string;
  weekLabel: string;
  applicationCount: number;
  acceptedCount: number;
  rejectedCount: number;
  completionRate: number;
}

export interface RecentApplication {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  interviewTitle: string;
  interviewId: string;
  status: string;
  aiScore?: number;
  createdAt: string;
  isFavorite: boolean;
}

export interface ActiveInterview {
  _id: string;
  title: string;
  position: string;
  department: string;
  status: string;
  totalApplications: number;
  pendingApplications: number;
  completedApplications: number;
  expirationDate: string;
  createdAt: string;
}

export interface DepartmentStats {
  department: string;
  applicationCount: number;
  acceptedCount: number;
  rejectedCount: number;
  pendingCount: number;
  avgAIScore?: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  applicationTrend: ApplicationTrend;
  weeklyTrends: WeeklyTrendData[];
  recentApplications: RecentApplication[];
  activeInterviews: ActiveInterview[];
  departmentStats: DepartmentStats[];
  favoriteApplications: RecentApplication[];
  notifications: any[];
  statusDistribution: StatusDistribution[];
}
