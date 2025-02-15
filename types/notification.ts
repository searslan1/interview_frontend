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
  createdAt: Date;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
}
