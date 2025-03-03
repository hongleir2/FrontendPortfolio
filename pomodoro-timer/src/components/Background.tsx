import { useSettingsStore } from '../store/settingsStore';

const Background = () => {
  const selectedBackgroundUrl = useSettingsStore(
    (state) => state.selectedBackgroundUrl
  );

  return (
    <>
      <img
        src={selectedBackgroundUrl}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0"></div>
    </>
  );
};

export default Background;
