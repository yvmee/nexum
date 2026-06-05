import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl, Howler } from 'howler';

// Import audio files through Vite
import clickSrc from '../../assets/sounds/ClickEdited.mp3';
import typingSrc from '../../assets/sounds/KeyboardTypingSound.mp3';
import portalSrc from '../../assets/sounds/PortalSound.mp3';
import spellSrc from '../../assets/sounds/SpellCast.mp3';
import healingSrc from '../../assets/sounds/HealingMagic.mp3';
import ambientSrc from '../../assets/sounds/AmbientSound.mp3';
import lectureSrc from '../../assets/sounds/LectureSoundEdited.mp3';
import cafeteriaSrc from '../../assets/sounds/SchoolCafeteriaCut.mp3';
import tutorialSrc from '../../assets/sounds/TutorialSound.mp3';

// Individual base volumes for SFX and BGM
const SFX_BASE_VOLUMES: Record<string, number> = {
  click: 1.0,
  typing: 0.8,
  flash: 0.5,
  glow: 0.5,
  energy: 0.7,
};

const BGM_BASE_VOLUMES: Record<string, number> = {
  reflectionMusic: 0.5,
  lectureHallSound: 0.3,
  cafeteriaSound: 0.4,
  hallwaySound: 0.2,
  tutorialSound: 0.3,
};

// Sound effects dictionary
const SFX: Record<string, Howl | null> = {
  click: new Howl({ src: [clickSrc]}),
  typing : new Howl({ src: [typingSrc]}),
  flash: new Howl({ src: [portalSrc]}),
  energy: new Howl({ src: [spellSrc]}),
  glow: new Howl({ src: [healingSrc]}),
};

// Background music dictionary
const BGM: Record<string, Howl | null> = {
  reflectionMusic: new Howl({ src: [ambientSrc], loop: true }),
  lectureHallSound: new Howl({ src: [lectureSrc], loop: true }),
  cafeteriaSound: new Howl({ src: [cafeteriaSrc], loop: true }),
  hallwaySound: new Howl({ src: [cafeteriaSrc], loop: true }),
  tutorialSound: new Howl({ src: [tutorialSrc], loop: true }),
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
const DEFAULT_SFX_VOLUME = 0.7;
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

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
  isMuted: false,
  masterVolume: 1.0,
  bgmVolume: DEFAULT_BGM_VOLUME,
  sfxVolume: DEFAULT_SFX_VOLUME,
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
      track?.volume((BGM_BASE_VOLUMES[currentBgm] ?? 1.0) * volume);
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

    howl.volume((SFX_BASE_VOLUMES[track] ?? 1.0) * sfxVolume);
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
        howl.volume((SFX_BASE_VOLUMES[track] ?? 1.0) * get().sfxVolume);
      }, fadeMs);
      return;
    }

    howl.stop();
    howl.volume((SFX_BASE_VOLUMES[track] ?? 1.0) * get().sfxVolume);
  },

  playBgm: (track) => { // Smooth fade in/out when switching tracks
    const { currentBgm, bgmVolume } = get();

    // Return if it's already playing
    if (currentBgm === track) return;

    // Fade out old track if one is playing
    if (currentBgm) {
      const oldHowl = BGM[currentBgm];
      if (oldHowl) {
        oldHowl.off('fade');
        oldHowl.once('fade', () => oldHowl.stop());
        oldHowl.fade(oldHowl.volume(), 0, 1000);
      }
    }

    // Play and fade in new track
    const newHowl = BGM[track];
    if (!newHowl) { 
      set({ currentBgm: track });
      return;
    }
    // Cancel any pending fade-stop from a previous transition and reset
    newHowl.off('fade');
    newHowl.stop();
    newHowl.play();
    newHowl.fade(0, (BGM_BASE_VOLUMES[track] ?? 1.0) * bgmVolume, 1000);

    set({ currentBgm: track, isDucked: false });
  },

  stopBgm: () => {
    const { currentBgm } = get();
    if (currentBgm) {
      const howl = BGM[currentBgm];
      if (howl) {
        howl.off('fade');
        howl.once('fade', () => howl.stop());
        howl.fade(howl.volume(), 0, 500);
      }
      set({ currentBgm: null, isDucked: false });
    }
  },

  duckBgm: () => {
    const { currentBgm, bgmVolume, isDucked } = get();
    if (isDucked || !currentBgm) return;
    const howl = BGM[currentBgm];
    if (howl) {
      const effectiveVolume = (BGM_BASE_VOLUMES[currentBgm] ?? 1.0) * bgmVolume;
      howl.fade(howl.volume(), effectiveVolume * DUCK_RATIO, 400);
    }
    set({ isDucked: true });
  },

  unduckBgm: () => {
    const { currentBgm, bgmVolume, isDucked } = get();
    if (!isDucked || !currentBgm) return;
    const howl = BGM[currentBgm];
    if (howl) {
      howl.fade(howl.volume(), (BGM_BASE_VOLUMES[currentBgm] ?? 1.0) * bgmVolume, 400);
    }
    set({ isDucked: false });
  },
    }),
    {
      name: 'nexum-sound-store',
      partialize: (state) => ({ // Persist parts of the state
        isMuted: state.isMuted,
        masterVolume: state.masterVolume,
        bgmVolume: state.bgmVolume,
        sfxVolume: state.sfxVolume,
        currentBgm: state.currentBgm,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Restore Howler state
        Howler.mute(state.isMuted);
        Howler.volume(state.masterVolume);
        if (state.currentBgm && isBgmTrack(state.currentBgm)) { 
          const howl = BGM[state.currentBgm];
          if (howl) {
            howl.volume((BGM_BASE_VOLUMES[state.currentBgm] ?? 1.0) * state.bgmVolume);
            howl.play();
          }
        }
        state.isDucked = false;
      },
    }
  )
);

// Click sound wrapper ( onClick={withClickSound(handleAdvance)} )
export function withClickSound<Args extends unknown[]>(
  handler: (...args: Args) => void,
): (...args: Args) => void {
  return (...args: Args) => {
    useSoundStore.getState().playSfx('click');
    handler(...args);
  };
}