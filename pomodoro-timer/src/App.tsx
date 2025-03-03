import Background from './components/Background';
import Navbar from './components/Navbar';
import TimerContainer from './components/TimerContainer';
import BottomContent from './components/BottomContent';
import SettingsPanel from './components/panels/SettingsPanel';
import SoundsPanel from './components/panels/SoundsPanel';
import PhotosPanel from './components/panels/PhotosPanel';
import { Toaster } from './components/ui/toaster';
import { useSettingsStore } from './store/settingsStore';
import { useEffect } from 'react';

function App() {
  const isImmersiveMode = useSettingsStore((state) => state.isImmersiveMode);
  const { checkAndUpdateDailyBackground, checkAndUpdateDailyQuote } =
    useSettingsStore();

  // Check for daily updates when the app loads
  useEffect(() => {
    checkAndUpdateDailyBackground();
    checkAndUpdateDailyQuote();
  }, [checkAndUpdateDailyBackground, checkAndUpdateDailyQuote]);

  return (
    <div
      className={`relative min-h-screen ${isImmersiveMode ? 'immersive-mode' : ''}`}
    >
      <Background />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <TimerContainer />
        <BottomContent />
      </div>

      <SettingsPanel />
      <SoundsPanel />
      <PhotosPanel />
      <Toaster />
    </div>
  );
}

export default App;
