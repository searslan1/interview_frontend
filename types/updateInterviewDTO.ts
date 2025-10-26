import { InterviewQuestion } from "./interview";

/**
 * Backend'deki UpdateInterviewDTO'ya karşılık gelen tip.
 * Backend'e sadece güncellenmesi gereken alanlar gönderilebilir.
 */
export interface UpdateInterviewDTO {
    title?: string;
    expirationDate?: string | Date; // Date veya ISO string olabilir
    personalityTestId?: string;
    stages?: {
        personalityTest?: boolean;
        questionnaire?: boolean;
    };
    questions?: InterviewQuestion[];
    status?: 'active' | 'completed' | 'published' | 'draft' | 'inactive';
}
