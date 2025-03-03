import { Button } from './ui/button';
import { usePanelStore } from '../store/panelStore';

const Navbar = () => {
  const { openPanel } = usePanelStore();

  return (
    <nav className=" absolute top-0  w-full flex items-center justify-end px-6 py-5 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="text-lg opacity-80 hover:opacity-100 hover:rounded-lg hover:bg-white hover:text-black/80"
          onClick={() => openPanel('settings')}
        >
          Settings
        </Button>
        <Button
          variant="ghost"
          className="text-lg opacity-80 hover:opacity-100 hover:rounded-lg hover:bg-white hover:text-black/80"
          onClick={() => openPanel('sounds')}
        >
          Sounds
        </Button>
        <Button
          variant="ghost"
          className="text-lg opacity-80 hover:opacity-100 hover:rounded-lg hover:bg-white hover:text-black/80"
          onClick={() => openPanel('photos')}
        >
          Background
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
