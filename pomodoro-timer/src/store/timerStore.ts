import { create } from 'zustand';

interface TimerState {
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  currentTime: number;
  originalTime: number;
  isRunning: boolean;
  isFocusMode: boolean;
  completedPomodoros: number;
  currentTask: string;

  // Methods
  setFocusTime: (time: number) => void;
  setShortBreakTime: (time: number) => void;
  setLongBreakTime: (time: number) => void;
  setCurrentTime: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsFocusMode: (isFocusMode: boolean) => void;
  setCompletedPomodoros: (count: number) => void;
  setCurrentTask: (task: string) => void;

  // Helper methods
  switchToFocusMode: () => void;
  switchToBreakMode: () => void;
  resetTimer: (preserveCurrentTime?: boolean) => void;
  decrementTime: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  focusTime: 35 * 60, // 35 minutes in seconds
  shortBreakTime: 5 * 60, // 5 minutes
  longBreakTime: 15 * 60, // 15 minutes
  currentTime: 35 * 60,
  originalTime: 35 * 60,
  isRunning: false,
  isFocusMode: true,
  completedPomodoros: 0,
  currentTask: '',

  // Methods
  setFocusTime: (time: number) =>
    set((state) => {
      // Only update currentTime if we're in focus mode and not running
      const shouldUpdateCurrent = state.isFocusMode && !state.isRunning;
      return {
        focusTime: time,
        currentTime: shouldUpdateCurrent ? time : state.currentTime,
        originalTime: shouldUpdateCurrent ? time : state.originalTime,
      };
    }),

  setShortBreakTime: (time: number) =>
    set((state) => {
      // Only update currentTime if we're in break mode, it's a short break, and not running
      const isShortBreak =
        !state.isFocusMode && state.completedPomodoros % 4 !== 0;
      const shouldUpdateCurrent = isShortBreak && !state.isRunning;
      return {
        shortBreakTime: time,
        currentTime: shouldUpdateCurrent ? time : state.currentTime,
        originalTime: shouldUpdateCurrent ? time : state.originalTime,
      };
    }),

  setLongBreakTime: (time: number) =>
    set((state) => {
      // Only update currentTime if we're in break mode, it's a long break, and not running
      const isLongBreak =
        !state.isFocusMode && state.completedPomodoros % 4 === 0;
      const shouldUpdateCurrent = isLongBreak && !state.isRunning;
      return {
        longBreakTime: time,
        currentTime: shouldUpdateCurrent ? time : state.currentTime,
        originalTime: shouldUpdateCurrent ? time : state.originalTime,
      };
    }),

  setCurrentTime: (time: number) => set({ currentTime: time }),
  setIsRunning: (isRunning: boolean) => set({ isRunning }),
  setIsFocusMode: (isFocusMode: boolean) => set({ isFocusMode }),
  setCompletedPomodoros: (count: number) => set({ completedPomodoros: count }),
  setCurrentTask: (task: string) => set({ currentTask: task }),

  // Helper methods
  switchToFocusMode: () =>
    set((state) => ({
      isFocusMode: true,
      currentTime: state.focusTime,
      originalTime: state.focusTime,
      isRunning: false,
    })),

  switchToBreakMode: () =>
    set((state) => {
      const useShortBreak = state.completedPomodoros % 4 !== 0;
      const breakTime = useShortBreak
        ? state.shortBreakTime
        : state.longBreakTime;

      return {
        isFocusMode: false,
        currentTime: breakTime,
        originalTime: breakTime,
        isRunning: false,
      };
    }),

  resetTimer: (preserveCurrentTime = false) =>
    set((state) => {
      const newTime = state.isFocusMode
        ? state.focusTime
        : state.completedPomodoros % 4 === 0
          ? state.longBreakTime
          : state.shortBreakTime;

      // If preserveCurrentTime is true, only update originalTime
      // Otherwise, update both currentTime and originalTime
      return {
        originalTime: newTime,
        currentTime: preserveCurrentTime ? state.currentTime : newTime,
        isRunning: false,
      };
    }),

  decrementTime: () =>
    set((state) => ({
      currentTime: Math.max(0, state.currentTime - 1),
    })),
}));
