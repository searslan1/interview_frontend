// services/dashboardService.ts
import api from '@/utils/api';
import { DashboardResponse } from '@/types/dashboard';

class DashboardService {
  /**
   * Tüm dashboard verilerini getirir
   */
  async getDashboardData(): Promise<DashboardResponse> {
    const response = await api.get('/dashboard');
    return response.data.data;
  }

  /**
   * Favorilere ekle/çıkar
   */
  async toggleFavorite(applicationId: string): Promise<void> {
    await api.post(`/dashboard/favorites/${applicationId}`);
  }

  /**
   * Başvuru trendlerini getirir (tarih filtreli)
   */
  async getApplicationTrends(startDate?: string, endDate?: string): Promise<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/dashboard/trends', { params });
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
