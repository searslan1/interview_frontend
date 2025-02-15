export interface Appointment {
  id: string;
  candidateId: string;
  candidateName: string;
  type: "interview" | "followup";
  interviewId?: string;
  date: Date;
  duration: number;
  sendEmail?: boolean;
  sendSMS?: boolean;
  location?: string;
}
