// src/services/applicationService.ts

import api from '@/utils/api';
import { Application, ApplicationFilters } from '@/types/application'; // ✅ ApplicationFilters import edildi

// ✅ YENİ TİP: Backend'den beklediğimiz sayfalandırılmış yanıt yapısı
interface PaginatedResponse {
    success: boolean;
    data: Application[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

/**
 * ✅ YENİ METOT: Filtreler, sayfalama ve limit ile başvuruları getirir.
 * Bu, İK panelinin ana veri çekme fonksiyonu olacaktır.
 */
export const getFilteredApplications = async (
    filters: Partial<ApplicationFilters>,
    page: number = 1,
    limit: number = 10
): Promise<PaginatedResponse> => {
    try {
        // Filtre objesini Query Parametrelerine dönüştür
        const queryParams = new URLSearchParams();
        
        // Temel sayfalandırma parametreleri
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        // Dinamik filtreleri ekle
        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof ApplicationFilters];
            
            if (value !== undefined && value !== null && value !== 'all' && value !== '') {
                // Tarih aralığı gibi karmaşık objeler özel olarak ele alınabilir
                if (key === 'dateRange' && typeof value === 'object') {
                    if (value.from) queryParams.append('dateFrom', value.from.toISOString());
                    if (value.to) queryParams.append('dateTo', value.to.toISOString());
                } else if (key === 'searchTerm') {
                    queryParams.append('query', value as string); // Backend 'query' bekliyor
                } else {
                    queryParams.append(key, String(value));
                }
            }
        });

        const response = await api.get<PaginatedResponse>(`/applications?${queryParams.toString()}`);
        return response.data; // Tüm yanıtı (data ve meta) döndürüyoruz

    } catch (error) {
        console.error('Error fetching filtered applications:', error);
        throw error;
    }
};

/**
 * Tüm başvuruları getiren fonksiyon (Artık filtreli metodu kullanacak).
 * Bu metot, filtre/sayfalama gerektirmeyen basit çağrılar için geriye dönük uyumluluğu sağlar.
 */
export const getApplications = async (): Promise<Application[]> => {
    // ✅ DÜZELTME: Eski metot, yeni filtreli metodu varsayılan değerlerle çağırıyor.
    const response = await getFilteredApplications({}, 1, 50); 
    return response.data;
};

/**
 * Tek bir başvuruyu ID ile getiren fonksiyon.
 * ... mevcut kod ...
 */
export const getApplicationById = async (id: string): Promise<Application> => {
    try {
        const response = await api.get<{ success: boolean; data: Application }>(
            `/applications/${id}`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching application by id:', error);
        throw error;
    }
};

/**
 * ✅ YENİ METOT: Başvurunun durumunu günceller (Kabul/Red/Beklemede).
 * @param id Başvurunun ID'si
 * @param newStatus Yeni durum ('pending', 'rejected', 'accepted')
 */
export const updateApplicationStatus = async (
    id: string,
    newStatus: 'pending' | 'rejected' | 'accepted'
): Promise<Application> => {
    try {
        const response = await api.patch<{ success: boolean; data: Application }>(
            // Backend'deki rota: PATCH /applications/:id/status
            `/applications/${id}/status`, 
            { status: newStatus } // Backend DTO'suna uygun olarak gönderiliyor
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error updating application status for ${id}:`, error);
        throw error;
    }
};