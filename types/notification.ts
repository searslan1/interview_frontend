export interface Notification {
  id: string;
  userId: string;
  type: 
    | "new_application" 
    | "interview_reminder" 
    | "ai_recommendation" 
    | "application_status_change"
    | "interview_result"
    | "system_alert"
    | "announcement";
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  actionUrl?: string;
}
