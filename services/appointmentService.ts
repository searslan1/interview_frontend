import { api } from "@/utils/api";
import { Appointment, CreateAppointmentPayload } from "@/types/appointment";

/**
 * API'den gelen ISO string formatındaki tarihleri JavaScript Date objelerine çevirir.
 */
const transformAppointmentDates = (data: any): Appointment => {
    // Backend'de createdBy alanı sadece ID döndürebilir, bu yüzden güvenli atama yapıyoruz.
    return {
        ...data,
        id: data._id || data.id, // Backend'den gelen _id'yi frontend'de id olarak kullanıyoruz
        date: new Date(data.date),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
    } as Appointment;
};

export class AppointmentService {
    private basePath = "/api/appointments";

    /**
     * Tüm randevuları API'den çeker. (GET /api/appointments)
     */
    public async fetchAppointments(): Promise<Appointment[]> {
        try {
            const response = await api.get<{ data: Appointment[] }>(this.basePath);
            
            // API'den gelen her randevuyu Date objesine dönüştürüyoruz.
            return response.data.data.map(transformAppointmentDates);
        } catch (error) {
            console.error("Randevular çekilirken hata oluştu:", error);
            // Hata oluştuğunda boş dizi döndürerek uygulamanın çökmesini önle
            return []; 
        }
    }

    /**
     * Yeni randevu oluşturur. (POST /api/appointments)
     * Backend'e gönderilecek randevu tarihi ISO string formatında olmalıdır.
     */
    public async createAppointment(payload: CreateAppointmentPayload): Promise<Appointment | null> {
        try {
            const response = await api.post<{ data: Appointment }>(this.basePath, payload);
            
            // Oluşturulan randevuyu Date objesine dönüştürüp döndür
            return transformAppointmentDates(response.data.data);
        } catch (error) {
            console.error("Randevu oluşturulurken hata oluştu:", error);
            throw error; // Hata yönetiminin üst katmana (Store/Component) bırakılması
        }
    }

    /**
     * Randevuyu siler. (DELETE /api/appointments/:id)
     */
    public async deleteAppointment(id: string): Promise<void> {
        try {
            // DELETE isteği genellikle 204 No Content döndürür, yanıt gövdesi beklenmez.
            await api.delete(`${this.basePath}/${id}`);
        } catch (error) {
            console.error(`Randevu silinirken hata oluştu (ID: ${id}):`, error);
            throw error;
        }
    }

    /**
     * Randevu hatırlatıcısı gönderir. (POST /api/appointments/:id/reminder)
     */
    public async sendReminder(id: string): Promise<void> {
        try {
            await api.post(`${this.basePath}/${id}/reminder`);
            console.log(`Hatırlatma isteği başarıyla gönderildi (ID: ${id}).`);
        } catch (error) {
            console.error(`Hatırlatma gönderilirken hata oluştu (ID: ${id}):`, error);
            throw error;
        }
    }
}

// Kolay kullanım için singleton instance'ı dışa aktar
export const appointmentService = new AppointmentService();