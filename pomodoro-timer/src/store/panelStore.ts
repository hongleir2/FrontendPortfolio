import { create } from 'zustand';

type PanelType = 'settings' | 'sounds' | 'photos' | null;

interface PanelState {
  activePanel: PanelType;
  openPanel: (panel: PanelType) => void;
  closePanel: () => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null }),
}));
