// src/hooks/useNotification.ts
import { useToast } from './use-toast';

export const useNotification = () => {
  const { toast } = useToast();

  const showNotification = (message: string) => {
    toast(message, {
      duration: 3000,
    });
  };

  return { showNotification };
};
