import { useState, useEffect } from 'react';
import { Application } from '@/types/application';
import { getApplicationById } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';

export const useApplication = (id: string) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Başvuru getirilirken hata oluştu.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id, toast]);

  return { application, loading };
};
