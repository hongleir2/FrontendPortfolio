import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useSettingsStore } from '../store/settingsStore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useToast } from '../hooks/use-toast';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const TimerContainer = () => {
  const { toast } = useToast();
  const timerStore = useTimerStore();
  const {
    currentTime,
    originalTime,
    isRunning,
    isFocusMode,
    currentTask,
    completedPomodoros,
    setCurrentTask,
    switchToFocusMode,
    switchToBreakMode,
    setIsRunning,
    decrementTime,
    setCompletedPomodoros,
  } = timerStore;

  const [isEditing, setIsEditing] = useState(!currentTask);
  const [taskText, setTaskText] = useState(currentTask || '');
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { autoStartBreak, autoStartFocus } = useSettingsStore();

  const intervalRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the CircularProgressbar
  const calculateProgress = (): number => {
    return ((originalTime - currentTime) / originalTime) * 100;
  };

  const toggleTimer = () => {
    if (isRunning) {
      // Pause the timer - clear the interval but don't reset
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else {
      // Resume the timer - don't call resetTimer here
      setIsRunning(true);
    }
  };

  const handleModeChange = (focusMode: boolean) => {
    if (focusMode) {
      switchToFocusMode();
    } else {
      switchToBreakMode();
    }
  };

  const timerFinished = () => {
    if (isFocusMode) {
      // Focus mode ended
      setCompletedPomodoros(completedPomodoros + 1);
      toast('Focus time completed!', {
        description: 'Time to take a break.',
      });
      switchToBreakMode();

      // If auto-start break is enabled
      if (autoStartBreak) {
        setIsRunning(true);
      }
    } else {
      // Break mode ended
      toast('Break time completed!', {
        description: 'Time to start a new focus session.',
      });
      switchToFocusMode();

      // If auto-start focus is enabled
      if (autoStartFocus) {
        setIsRunning(true);
      }
    }
  };

  // Handle task input keydown (enter to submit)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && taskText.trim() !== '') {
      setIsEditing(false);
      setCurrentTask(taskText.trim());
    }
  };

  // Start editing the task
  const startEditing = () => {
    if (!isTaskCompleted) {
      setIsEditing(true);
      // Focus the input after it becomes visible
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        decrementTime();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, decrementTime]);

  useEffect(() => {
    if (currentTime <= 0 && isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      timerFinished();
    }
  }, [currentTime, isRunning]);

  // Also, update the useEffect that watches for currentTask changes to ensure proper initialization
  useEffect(() => {
    setTaskText(currentTask || '');
    // Automatically switch to editing mode if there's no task set
    if (!currentTask) {
      setIsEditing(true);
      setIsTaskCompleted(false);
    }
  }, [currentTask]);

  useEffect(() => {
    // If they finish editing with no content, go back to edit mode
    if (!isEditing && !taskText.trim()) {
      setIsEditing(true);
    }
  }, [isEditing, taskText]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex gap-4 mb-5">
        <button
          className={`bg-transparent border-none uppercase text-xl tracking-wider px-2.5 py-1.5 cursor-pointer text-white font-medium opacity-60 rounded-lg hover:bg-white hover:text-black/60`}
          onClick={() => handleModeChange(true)}
        >
          POMODORO
        </button>
        <button
          className={`bg-transparent border-none uppercase text-xl tracking-wider px-2.5 py-1.5 cursor-pointer text-white font-medium opacity-60 rounded-lg hover:bg-white hover:text-black/60`}
          onClick={() => handleModeChange(false)}
        >
          BREAK
        </button>
      </div>

      <div className="relative flex flex-col items-center justify-center w-[30rem] h-[30rem]">
        {/* Transparent circle background */}
        <div className="w-full h-full absolute">
          <CircularProgressbar
            value={100}
            strokeWidth={2}
            styles={buildStyles({
              strokeLinecap: 'butt',
              pathColor: 'rgba(255, 255, 255, 0.3)',
              trailColor: 'transparent',
            })}
          />
        </div>

        {/* Progress circle */}
        <div className="w-full h-full absolute">
          <CircularProgressbar
            value={calculateProgress()}
            strokeWidth={2}
            styles={buildStyles({
              strokeLinecap: 'round',
              pathColor: 'rgba(255, 255, 255, 0.8)',
              trailColor: 'transparent',
              rotation: 0,
            })}
          />
        </div>

        <div className="flex flex-col items-center justify-center absolute inset-0 z-10">
          <div className="text-[7rem] font-medium text-white tracking-tighter leading-none mb-6">
            {formatTime(currentTime)}
          </div>

          <div className="flex items-center justify-center w-[70%] max-w-md mb-6">
            {isEditing || !taskText ? (
              <Input
                ref={inputRef}
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (taskText.trim() !== '') {
                    setIsEditing(false);
                    setCurrentTask(taskText.trim());
                  }
                }}
                placeholder="I will focus on..."
                className="bg-transparent h-14 border-0 border-b-2 border-white text-white text-3xl font-medium text-center py-3 px-4 mb-6 w-full max-w-md focus:border-white placeholder:text-white placeholder:text-3xl placeholder:font-medium focus:ring-0"
                autoFocus
              />
            ) : (
              <div
                className={`flex items-center justify-center text-white text-3xl font-medium text-center py-3 px-5 w-full ${!isTaskCompleted ? 'cursor-pointer' : ''}`}
                onClick={startEditing}
              >
                <Checkbox
                  checked={isTaskCompleted}
                  onCheckedChange={(checked) => {
                    setIsTaskCompleted(checked === true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mr-4 w-6 h-6 border-white"
                />

                <span
                  className={isTaskCompleted ? 'line-through opacity-70' : ''}
                >
                  {taskText}
                </span>
              </div>
            )}
          </div>

          <div className="mb-[-20px] opacity-80 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="w-[4rem] h-[4rem] text-[1.8rem] bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black/60"
              onClick={toggleTimer}
            >
              {isRunning ? '❚❚' : '▶'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerContainer;
