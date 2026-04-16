import { create } from 'zustand';
import { Howl, Howler } from 'howler';

// Sound effects dictionary
const SFX: Record<string, Howl | null> = {
  click: new Howl({ src: ['../../assets/sounds/Click.mp3'], volume: 0.8 }),
  typing : new Howl({ src: ['../../assets/sounds/KeyboardTypingSound.mp3'], volume: 0.8 }),
  flash: new Howl({ src: ['../../assets/sounds/PortalSound.mp3'], volume: 0.8 }),
  glow: new Howl({ src: ['../../assets/sounds/SpellCast.mp3'], volume: 0.8 }),
  energy: null,
  reveal: null,
  transition: null,
};

// Background music dictionary
const BGM: Record<string, Howl | null> = {
  menuMusic: new Howl({ src: ['../../assets/sounds/AmbientSound.mp3'], loop: true, volume: 0.5 }),
  reflectionMusic: new Howl({ src: ['../../assets/sounds/AmbientSound.mp3'], loop: true, volume: 0.5 }),
  lectureHallSound: new Howl({ src: ['../../assets/sounds/LectureSoundEdited.mp3'], loop: true, volume: 0.8 }),
  cafeteriaSound: new Howl({ src: ['../../assets/sounds/SchoolCafeteriaCut.mp3'], loop: true, volume: 0.8 }),
};

export type BGMTrack = keyof typeof BGM;
export type SFXTrack = keyof typeof SFX;

export function isBgmTrack(track: string | null | undefined): track is BGMTrack {
  return !!track && track in BGM;
}

export function isSfxTrack(track: string | null | undefined): track is SFXTrack {
  return !!track && track in SFX;
}

const DEFAULT_BGM_VOLUME = 0.5;
const DUCK_RATIO = 0.2; // Duck to 20% of current BGM volume

interface SoundState {
  isMuted: boolean;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  currentBgm: string | null;
  isDucked: boolean;

  // Actions
  toggleMute: () => void;
  setMasterVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  playSfx: (track: SFXTrack) => void;
  stopSfx: (track: SFXTrack, fadeMs?: number) => void;
  playBgm: (track: BGMTrack) => void;
  stopBgm: () => void;
  duckBgm: () => void;
  unduckBgm: () => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  isMuted: false,
  masterVolume: 1.0,
  bgmVolume: DEFAULT_BGM_VOLUME,
  sfxVolume: 0.8,
  currentBgm: null,
  isDucked: false,

  toggleMute: () => {
    const { isMuted } = get();
    Howler.mute(!isMuted);
    set({ isMuted: !isMuted });
  },

  setMasterVolume: (volume) => {
    Howler.volume(volume); 
    set({ masterVolume: volume });
  },

  setBgmVolume: (volume) => {
    const { currentBgm } = get();
    set({ bgmVolume: volume });
    if (currentBgm) {
      const track = BGM[currentBgm];
      track?.volume(volume);
    }
  },

  setSfxVolume: (volume) => {
    set({ sfxVolume: volume });
  },

  playSfx: (track) => {
    const howl = SFX[track];
    if (!howl) return; 
    const { sfxVolume } = get();

    // Avoid stacking multiple loop instances of the same track
    if (howl.loop() && howl.playing()) {
      return;
    }

    howl.volume(sfxVolume);
    howl.play();
  },

  stopSfx: (track, fadeMs = 0) => {
    const howl = SFX[track];
    if (!howl || !howl.playing()) return;

    if (fadeMs > 0) {
      const fromVolume = howl.volume();
      howl.fade(fromVolume, 0, fadeMs);
      setTimeout(() => {
        howl.stop();
        howl.volume(get().sfxVolume);
      }, fadeMs);
      return;
    }

    howl.stop();
    howl.volume(get().sfxVolume);
  },

  playBgm: (track) => { // Smooth fade in/out when switching tracks
    const { currentBgm, bgmVolume } = get();

    // Just return if it's already playing
    if (currentBgm === track) return;

    // Fade out old track if one is playing
    if (currentBgm) {
      const oldHowl = BGM[currentBgm];
      if (oldHowl) {
        oldHowl.fade(oldHowl.volume(), 0, 1000);
        setTimeout(() => oldHowl.stop(), 1000);
      }
    }

    // Play and fade in new track
    const newHowl = BGM[track];
    if (!newHowl) { 
      set({ currentBgm: track });
      return;
    }
    newHowl.play();
    newHowl.fade(0, bgmVolume, 1000);

    set({ currentBgm: track, isDucked: false });
  },

  stopBgm: () => {
    const { currentBgm } = get();
    if (currentBgm) {
      const howl = BGM[currentBgm];
      if (howl) {
        howl.fade(howl.volume(), 0, 500);
        setTimeout(() => howl.stop(), 500);
      }
      set({ currentBgm: null, isDucked: false });
    }
  },

  duckBgm: () => {
    const { currentBgm, bgmVolume, isDucked } = get();
    if (isDucked || !currentBgm) return;
    const howl = BGM[currentBgm];
    if (howl) {
      howl.fade(howl.volume(), bgmVolume * DUCK_RATIO, 400);
    }
    set({ isDucked: true });
  },

  unduckBgm: () => {
    const { currentBgm, bgmVolume, isDucked } = get();
    if (!isDucked || !currentBgm) return;
    const howl = BGM[currentBgm];
    if (howl) {
      howl.fade(howl.volume(), bgmVolume, 400);
    }
    set({ isDucked: false });
  },
}));

// Click sound wrapper ( onClick={withClickSound(handleAdvance)} )
export function withClickSound<Args extends unknown[]>(
  handler: (...args: Args) => void,
): (...args: Args) => void {
  return (...args: Args) => {
    useSoundStore.getState().playSfx('click');
    handler(...args);
  };
}