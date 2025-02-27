import api from '@/utils/api';
import { Application } from '@/types/application';

/**
 * Tüm başvuruları getiren fonksiyon.
 */
export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get<{ success: boolean; data: Application[] }>('/applications');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

/**
 * Tek bir başvuruyu ID ile getiren fonksiyon.
 * @param id Başvurunun ID'si
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
