import { useQuery } from '@tanstack/react-query';
import { getApplicationById } from '@/services/applicationService';
import { Application, ApplicationStatus } from '@/types/application'; // ApplicationStatus'u tip dosyanızdan import edin

interface UseAnalysisStatusResult {
  application: Application | undefined;
  isLoading: boolean;
  isPolling: boolean;
  error: unknown;
}

/**
 * Bir başvurunun AI analiz durumunu izler.
 * Analiz bekleniyorsa (awaiting_ai_analysis), 10 saniyede bir yeniden veri çeker (polling).
 * * @param applicationId İzlenecek başvurunun ID'si
 * @returns Başvuru verisi, yüklenme durumu ve polling durumu
 */
export const useApplicationAnalysisStatus = (applicationId: string): UseAnalysisStatusResult => {
  
  // React Query ile başvuruyu çekiyoruz
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['application', applicationId], // Benzersiz Query Key
    queryFn: () => getApplicationById(applicationId),
    enabled: !!applicationId, // Yalnızca ID varsa sorguyu etkinleştir
    
    // Polling Mantığı:
    refetchInterval: (query) => {
      // Data mevcutsa ve durum 'awaiting_ai_analysis' ise
      if (
        query.state.data && 
        query.state.data.status === 'awaiting_ai_analysis'
      ) {
        // 10 saniyede bir yeniden çek (10000ms)
        return 10000; 
      }
      // Diğer durumlarda (completed, pending, rejected), polling yapma
      return false;
    },
    // Pencere yeniden odaklandığında tekrar çekmeyi devre dışı bırakıyoruz (Polling varken gereksiz)
    refetchOnWindowFocus: false, 
    staleTime: 5000, // Veri 5 saniye boyunca güncel kabul edilir
  });

  return {
    application: data,
    isLoading: isLoading,
    // isLoading (ilk yükleme) bittikten sonra isFetching devam ediyorsa, polling yapılıyor demektir.
    isPolling: data?.status === 'awaiting_ai_analysis' && isFetching, 
    error,
  };
};