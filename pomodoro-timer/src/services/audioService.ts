import { soundOptions } from '../data/soundOptions';

class AudioService {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private currentSound: string | null = null;
  private volume: number = 0.5;

  constructor() {
    // 预加载所有声音
    this.preloadAllSounds();
  }

  preloadAllSounds() {
    soundOptions.forEach((sound) => {
      this.preloadSound(sound.id, sound.src);
    });
  }

  preloadSound(id: string, url: string) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.volume;
    audio.load();
    this.audioElements.set(id, audio);
  }

  playSound(id: string): boolean {
    // 停止当前播放的声音
    this.stopCurrentSound();

    // 播放选定的声音
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.volume = this.volume;
      try {
        audio.play().catch((error) => {
          console.error('无法播放音频:', error);
          return false;
        });
        this.currentSound = id;
        return true;
      } catch (error) {
        console.error('无法播放音频:', error);
        return false;
      }
    }
    return false;
  }

  stopCurrentSound() {
    if (this.currentSound) {
      const audio = this.audioElements.get(this.currentSound);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      this.currentSound = null;
    }
  }

  setVolume(volume: number) {
    this.volume = volume / 100;

    // 更新当前播放的声音的音量
    if (this.currentSound) {
      const audio = this.audioElements.get(this.currentSound);
      if (audio) {
        audio.volume = this.volume;
      }
    }
  }
}

// 单例模式
export const audioService = new AudioService();
