import { create } from 'zustand';
import { Howl } from 'howler';

const SFX = {
  click: new Howl({ src: ['../../assets/sounds/click.mp3'], volume: 0.8 }),
};

const BGM = {
  startMusic: new Howl({ src: ['../../assets/sounds/AmbientSound.mp3'], loop: true, volume: 0.5 }),
};

type BGMTrack = keyof typeof BGM;
type SFXTrack = keyof typeof SFX;

interface SoundState {
  isMuted: boolean;
  masterVolume: number;
  currentBgm: BGMTrack | null;
  
  // Actions
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  playSfx: (track: SFXTrack) => void;
  playBgm: (track: BGMTrack) => void;
  stopBgm: () => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: false,
  masterVolume: 1.0,
  currentBgm: null,

  toggleMute: () => {
    const { isMuted } = get();
    Howler.mute(!isMuted); // Howler's global mute
    set({ isMuted: !isMuted });
  },

  setMasterVolume: (volume) => {
    Howler.volume(volume); // Howler's global volume
    set({ masterVolume: volume });
  },

  playSfx: (track) => {
    SFX[track].play();
  },

  playBgm: (track) => { // Smooth fade in/out when switching tracks
    const { currentBgm } = get();
    
    // Just return if it's already playing 
    if (currentBgm === track) return;

    // Fade out old track if one is playing
    if (currentBgm) {
      const oldTrack = BGM[currentBgm as BGMTrack];
      oldTrack.fade(oldTrack.volume(), 0, 1000);
      setTimeout(() => oldTrack.stop(), 1000);
    }

    // Play and fade in new track
    const newTrack = BGM[track];
    newTrack.play();
    newTrack.fade(0, 0.5, 1000); // Fade to default volume
    
    set({ currentBgm: track });
  },

  stopBgm: () => {
    const { currentBgm } = get();
    if (currentBgm) {
      BGM[currentBgm].stop();
      set({ currentBgm: null });
    }
  }
}));