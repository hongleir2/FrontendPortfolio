import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import quotes from '../data/quotes';
import { backgroundImageUrls } from '../data/backgroundImageUrls';

interface SettingsState {
  autoStartBreak: boolean;
  autoStartFocus: boolean;
  useLongBreaks: boolean;
  isImmersiveMode: boolean;
  selectedBackgroundUrl: string;
  isDailyPhotoChangeEnabled: boolean;
  lastPhotoChangeDate: string | null;
  selectedSound: string | null;
  volume: number;
  muteOnEnd: boolean;

  selectedQuoteIndex: number;
  isDailyQuoteChangeEnabled: boolean;
  lastQuoteChangeDate: string | null;

  setAutoStartBreak: (value: boolean) => void;
  setAutoStartFocus: (value: boolean) => void;
  setUseLongBreaks: (value: boolean) => void;
  setImmersiveMode: (value: boolean) => void;
  setSelectedBackgroundUrl: (url: string) => void;
  setDailyPhotoChangeEnabled: (value: boolean) => void;
  checkAndUpdateDailyBackground: () => void;
  setSelectedSound: (sound: string | null) => void;
  setVolume: (volume: number) => void;
  setMuteOnEnd: (value: boolean) => void;

  setDailyQuoteChangeEnabled: (value: boolean) => void;
  checkAndUpdateDailyQuote: () => void;
  getCurrentQuote: () => { text: string; author: string };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      autoStartBreak: false,
      autoStartFocus: false,
      useLongBreaks: true,
      isImmersiveMode: false,
      selectedBackgroundUrl: backgroundImageUrls[0],
      isDailyPhotoChangeEnabled: false,
      lastPhotoChangeDate: null,
      selectedSound: null,
      volume: 50,
      muteOnEnd: false,
      selectedQuoteIndex: 0,
      isDailyQuoteChangeEnabled: true,
      lastQuoteChangeDate: null,

      setAutoStartBreak: (value: boolean) => set({ autoStartBreak: value }),
      setAutoStartFocus: (value: boolean) => set({ autoStartFocus: value }),
      setUseLongBreaks: (value: boolean) => set({ useLongBreaks: value }),
      setImmersiveMode: (value: boolean) => set({ isImmersiveMode: value }),
      setSelectedBackgroundUrl: (url: string) =>
        set({ selectedBackgroundUrl: url }),
      setDailyPhotoChangeEnabled: (value: boolean) =>
        set({
          isDailyPhotoChangeEnabled: value,
        }),
      checkAndUpdateDailyBackground: () => {
        const state = get();
        if (!state.isDailyPhotoChangeEnabled) return;

        const today = new Date().toISOString().split('T')[0];

        // 如果今天还没更换过背景
        if (state.lastPhotoChangeDate !== today) {
          // 从背景图片列表中获取所有URL

          // 随机选择一个不同的背景
          let newUrl = state.selectedBackgroundUrl;
          while (
            newUrl === state.selectedBackgroundUrl &&
            backgroundImageUrls.length > 1
          ) {
            const randomIndex = Math.floor(
              Math.random() * backgroundImageUrls.length
            );
            newUrl = backgroundImageUrls[randomIndex];
          }

          // 更新状态
          set({
            selectedBackgroundUrl: newUrl,
            lastPhotoChangeDate: today,
          });
        }
      },
      setSelectedSound: (sound: string | null) => set({ selectedSound: sound }),
      setVolume: (volume: number) => set({ volume: volume }),
      setMuteOnEnd: (value: boolean) => set({ muteOnEnd: value }),
      // Quote related methods
      setDailyQuoteChangeEnabled: (value: boolean) =>
        set({ isDailyQuoteChangeEnabled: value }),

      checkAndUpdateDailyQuote: () => {
        const state = get();
        if (!state.isDailyQuoteChangeEnabled) return;

        const today = new Date().toISOString().split('T')[0];

        // If quote hasn't been changed today
        if (state.lastQuoteChangeDate !== today) {
          // Randomly select a different quote
          let newIndex = state.selectedQuoteIndex;
          while (newIndex === state.selectedQuoteIndex && quotes.length > 1) {
            newIndex = Math.floor(Math.random() * quotes.length);
          }

          // Update state
          set({
            selectedQuoteIndex: newIndex,
            lastQuoteChangeDate: today,
          });
        }
      },

      getCurrentQuote: () => {
        const state = get();
        return quotes[state.selectedQuoteIndex];
      },
    }),
    {
      name: 'focus-timer-settings',
    }
  )
);
