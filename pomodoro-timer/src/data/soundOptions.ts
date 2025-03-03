// src/data/soundOptions.ts

// Sound options data interface
export interface SoundOption {
  id: string;
  icon: string;
  name: string;
  src: string;
}

// Sound options data
export const soundOptions: SoundOption[] = [
  {
    id: 'rain',
    icon: '🌧️',
    name: 'Rain',
    src: 'src/assets/audios/light-rain.mp3',
  },
  {
    id: 'forest',
    icon: '🌲',
    name: 'Forest',
    src: 'src/assets/audios/night-forest.mp3',
  },
  {
    id: 'cafe',
    icon: '☕',
    name: 'Cafe',
    src: 'src/assets/audios/cafe-ambience.mp3',
  },
  {
    id: 'waves',
    icon: '🌊',
    name: 'Waves',
    src: 'src/assets/audios/sea-wave.mp3',
  },
  {
    id: 'fire',
    icon: '🔥',
    name: 'Bonfire',
    src: 'src/assets/audios/bonfire.mp3',
  },
  {
    id: 'thunder',
    icon: '⚡',
    name: 'Thunder',
    src: 'src/assets/audios/thunder-storm.mp3',
  },
  {
    id: 'birds',
    icon: '🐦',
    name: 'Birdsong',
    src: 'src/assets/audios/bird.mp3',
  },
  {
    id: 'city',
    icon: '🏙️',
    name: 'City',
    src: 'src/assets/audios/city-traffic.mp3',
  },
  {
    id: 'noise',
    icon: '📻',
    name: 'White Noise',
    src: 'src/assets/audios/radio-wave.mp3',
  },
];
