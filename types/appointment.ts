/**
 * Randevu Türleri (Backend DTO ile uyumlu olmalıdır)
 */
export enum AppointmentType {
    INTERVIEW = 'interview',
    FOLLOWUP = 'followup',
}

/**
 * Backend'den gelen veya Frontend'de kullanılan temel randevu nesnesi.
 */
export interface Appointment {
    // Backend'den gelen MongoDB ID'si
    id: string; // Randevu ID'si

    // Randevu içeriği
    candidateName: string; 
    type: AppointmentType; // Mülakat veya Takip Görüşmesi

    // Tarih bilgisi
    date: Date; // Frontend'de Date nesnesi olarak tutulur (API'de ISO string olarak gelir/gider)
    time?: string; // Sadece formlarda gösterim kolaylığı için olabilir.
    duration: number; // Dakika cinsinden süre

    // Randevuyu oluşturan kullanıcı bilgisi
    createdBy: {
        userId: string; // Kullanıcı ID'si
        // name?: string; // Populated (dolu) gelmesi gerekebilir
    };

    // Bildirim ve Durum bilgileri
    isReminderSent: boolean; // Hatırlatmanın gönderilip gönderilmediği
    sendEmail: boolean; // Oluşturma sırasında e-posta seçeneği
    sendSMS: boolean; // Oluşturma sırasında SMS seçeneği
    
    // Zaman damgaları
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Randevu oluşturmak için API'ye gönderilen veri yapısı.
 * Randevu API'mizdeki CreateAppointmentDTO ile uyumludur.
 */
export interface CreateAppointmentPayload {
    candidateName: string;
    type: AppointmentType;
    date: string; // ISO 8601 string olarak gönderilir
    duration: number;
    sendEmail: boolean;
    sendSMS: boolean;
}

/**
 * Randevu Store'unda (Zustand) tutulan nesne tipi (Date yerine string kullanılır).
 */
export type PlainAppointment = Omit<Appointment, "date" | "createdAt" | "updatedAt"> & { 
    date: string;
    createdAt: string;
    updatedAt: string;
};
