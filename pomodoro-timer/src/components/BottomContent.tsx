// src/components/BottomContent.tsx
import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const BottomContent = () => {
  const isImmersiveMode = useSettingsStore((state) => state.isImmersiveMode);
  const checkAndUpdateDailyQuote = useSettingsStore(
    (state) => state.checkAndUpdateDailyQuote
  );
  const getCurrentQuote = useSettingsStore((state) => state.getCurrentQuote);

  // Check for daily quote update on component mount
  useEffect(() => {
    checkAndUpdateDailyQuote();
  }, [checkAndUpdateDailyQuote]);

  // Get the current quote
  const { text, author } = getCurrentQuote();

  return (
    <div
      className={`fixed bottom-10 left-0 w-full p-5 text-center text-white/70 transition-opacity duration-300 ${
        isImmersiveMode ? 'opacity-0 hover:opacity-30' : 'opacity-100'
      }`}
    >
      <p className="text-2xl">"{text}"</p>
      {author !== 'Focus Timer' && (
        <p className="text-lg mt-2 opacity-80">— {author}</p>
      )}
    </div>
  );
};

export default BottomContent;
