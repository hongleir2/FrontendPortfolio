// src/hooks/use-toast.ts
import { toast } from 'sonner';

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    error: toast.error,
    success: toast.success,
    info: toast.info,
    warning: toast.warning,
  };
}
