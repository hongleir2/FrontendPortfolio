// src/components/panels/PhotosPanel.tsx

import { usePanelStore } from '../../store/panelStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { backgroundImageUrls } from '../../data/backgroundImageUrls';

const PhotosPanel = () => {
  const activePanel = usePanelStore((state) => state.activePanel);
  const closePanel = usePanelStore((state) => state.closePanel);

  const {
    selectedBackgroundUrl,
    setSelectedBackgroundUrl,
    isDailyPhotoChangeEnabled,
    setDailyPhotoChangeEnabled,
  } = useSettingsStore();

  return (
    <div
      className={`fixed top-0 left-0 w-[420px] h-full bg-slate-500/50 text-white/90 backdrop-blur-md z-50 
                    flex flex-col transition-all duration-500 ease-out rounded-lg
                    ${activePanel === 'photos' ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}
    >
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-normal">Background Images</h2>
          <Button
            variant="ghost"
            className="text-2xl opacity-70 hover:opacity-100"
            onClick={closePanel}
          >
            ×
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {backgroundImageUrls.map((url, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden h-24 cursor-pointer group ${
                selectedBackgroundUrl === url ? 'ring-2 ring-white/50' : ''
              }`}
              onClick={() => setSelectedBackgroundUrl(url)}
            >
              <img
                src={url}
                alt={`Background ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {selectedBackgroundUrl === url && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <Label className="flex-1 text-sm">
              Auto-change background daily
            </Label>
            <Switch
              checked={isDailyPhotoChangeEnabled}
              onCheckedChange={setDailyPhotoChangeEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosPanel;
