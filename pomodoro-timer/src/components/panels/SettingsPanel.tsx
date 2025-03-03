import { usePanelStore } from '../../store/panelStore';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const SettingsPanel = () => {
  const activePanel = usePanelStore((state) => state.activePanel);
  const closePanel = usePanelStore((state) => state.closePanel);

  const {
    focusTime,
    shortBreakTime,
    longBreakTime,
    setFocusTime,
    setShortBreakTime,
    setLongBreakTime,
  } = useTimerStore();

  const {
    autoStartBreak,
    autoStartFocus,
    useLongBreaks,
    isImmersiveMode,
    setAutoStartBreak,
    setAutoStartFocus,
    setUseLongBreaks,
    setImmersiveMode,
    isDailyQuoteChangeEnabled,
    setDailyQuoteChangeEnabled,
  } = useSettingsStore();

  return (
    <div
      className={`fixed top-0 left-0 w-[350px] h-full bg-slate-600/20 rounded-lg backdrop-blur-md z-50 
                    flex flex-col transition-all duration-500 ease-out 
                    ${activePanel === 'settings' ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}
    >
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-normal">Settings</h2>
          <Button
            variant="ghost"
            className="text-3xl opacity-70 hover:opacity-100"
            onClick={closePanel}
          >
            ×
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm opacity-70 mb-2.5">Time Settings (Minutes)</h3>
          <div className="flex gap-2.5">
            <div className="flex-1">
              <p className="text-xs opacity-60 mb-1.5">Focus Time</p>
              <Input
                type="number"
                value={Math.floor(focusTime / 60)}
                onChange={(e) => setFocusTime(parseInt(e.target.value) * 60)}
                min={1}
                max={120}
                className="w-full bg-white/10 border-0 text-white rounded-xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-60 mb-1.5">Short Break</p>
              <Input
                type="number"
                value={Math.floor(shortBreakTime / 60)}
                onChange={(e) =>
                  setShortBreakTime(parseInt(e.target.value) * 60)
                }
                min={1}
                max={30}
                className="w-full bg-white/10 border-0 text-white rounded-xl"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-60 mb-1.5">Long Break</p>
              <Input
                type="number"
                value={Math.floor(longBreakTime / 60)}
                onChange={(e) =>
                  setLongBreakTime(parseInt(e.target.value) * 60)
                }
                min={5}
                max={60}
                className="w-full bg-white/10 border-0 text-white rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">
              Long Break Mode (After 4 Rounds)
            </Label>
            <Switch
              checked={useLongBreaks}
              onCheckedChange={setUseLongBreaks}
            />
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">Auto-Start Break</Label>
            <Switch
              checked={autoStartBreak}
              onCheckedChange={setAutoStartBreak}
            />
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">
              Auto-Start Next Focus Session
            </Label>
            <Switch
              checked={autoStartFocus}
              onCheckedChange={setAutoStartFocus}
            />
          </div>

          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">Full-Screen Mode</Label>
            <Switch
              checked={isImmersiveMode}
              onCheckedChange={setImmersiveMode}
            />
          </div>
          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">Daily Quote Change</Label>
            <Switch
              checked={isDailyQuoteChangeEnabled}
              onCheckedChange={setDailyQuoteChangeEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
