// src/components/panels/SoundsPanel.tsx
import { useEffect } from 'react';
import { usePanelStore } from '../../store/panelStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { audioService } from '../../services/audioService';
import { useToast } from '../../hooks/use-toast';
import { soundOptions } from '../../data/soundOptions';

const SoundsPanel = () => {
  // Get toast function using useToast
  const { toast } = useToast();
  // Get activePanel and closePanel function using usePanelStore
  const activePanel = usePanelStore((state) => state.activePanel);
  const closePanel = usePanelStore((state) => state.closePanel);

  const {
    selectedSound,
    volume,
    muteOnEnd,
    setSelectedSound,
    setVolume,
    setMuteOnEnd,
  } = useSettingsStore();

  // Play or pause sound
  const handleSoundSelect = (soundId: string) => {
    if (selectedSound === soundId) {
      // If clicking the currently selected sound, turn it off
      audioService.stopCurrentSound();
      setSelectedSound(null);
    } else {
      // Select new sound and play it
      const success = audioService.playSound(soundId);
      if (!success) {
        toast('Unable to play audio', {
          description:
            'Please click on the interface to enable audio playback.',
        });
      }
      setSelectedSound(soundId);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioService.setVolume(newVolume);
  };

  // Handle panel closing
  useEffect(() => {
    if (activePanel !== 'sounds' && selectedSound === null) {
      audioService.stopCurrentSound();
    }
  }, [activePanel, selectedSound]);

  return (
    <div
      className={`fixed top-0 left-0 w-[350px] h-full bg-slate-600/20 rounded-lg  backdrop-blur-md z-50 
                    flex flex-col transition-all duration-500 ease-out 
                    ${activePanel === 'sounds' ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}
    >
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-normal">Background Sounds</h2>
          <Button
            variant="ghost"
            className="text-2xl opacity-70 hover:opacity-100"
            onClick={closePanel}
          >
            ×
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5">
          {soundOptions.map((sound) => (
            <div
              key={sound.id}
              className={`bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/15 ${
                selectedSound === sound.id
                  ? 'ring-2 ring-white/20 bg-white/15'
                  : ''
              }`}
              onClick={() => handleSoundSelect(sound.id)}
            >
              <div className="text-2xl mb-2">{sound.icon}</div>
              <div className="text-sm opacity-80">{sound.name}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm opacity-70 mb-3">Volume</h3>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full bg-white/30 rounded-lg"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">Mute when focus ends</Label>
            <Switch checked={muteOnEnd} onCheckedChange={setMuteOnEnd} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundsPanel;
