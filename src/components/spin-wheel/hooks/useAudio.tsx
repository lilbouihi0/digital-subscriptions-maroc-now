
import { useState, useEffect, useCallback } from 'react';

export const useAudio = () => {
  // Audio elements
  const [tickAudio, setTickAudio] = useState<HTMLAudioElement | null>(null);
  const [endAudio, setEndAudio] = useState<HTMLAudioElement | null>(null);
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null);
  const [tryAgainAudio, setTryAgainAudio] = useState<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    // Tick sound for spinning
    const tickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    tickSound.volume = 0.3;
    setTickAudio(tickSound);
    
    // End sound when wheel stops
    const endSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3');
    endSound.volume = 0.5;
    setEndAudio(endSound);
    
    // Win sound
    const winSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1500/1500-preview.mp3');
    winSound.volume = 0.6;
    setWinAudio(winSound);

    // Try again sound
    const tryAgainSound = new Audio('https://assets.mixkit.co/active_storage/sfx/938/938-preview.mp3');
    tryAgainSound.volume = 0.5;
    setTryAgainAudio(tryAgainSound);
    
    // Preload audio
    Promise.all([
      tickSound.load, 
      endSound.load, 
      winSound.load, 
      tryAgainSound.load
    ]).catch(e => console.log("Audio preload error:", e));
    
    return () => {
      // Cleanup
      [tickSound, endSound, winSound, tryAgainSound].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Play tick sound
  const playTickSound = useCallback(() => {
    if (tickAudio) {
      tickAudio.currentTime = 0;
      tickAudio.play().catch(e => console.log("Audio play error:", e));
    }
  }, [tickAudio]);

  // Play end sound
  const playEndSound = useCallback(() => {
    if (endAudio) {
      endAudio.currentTime = 0;
      endAudio.play().catch(e => console.log("Audio play error:", e));
    }
  }, [endAudio]);

  // Play win sound
  const playWinSound = useCallback(() => {
    if (winAudio) {
      winAudio.currentTime = 0;
      winAudio.play().catch(e => console.log("Audio play error:", e));
    }
  }, [winAudio]);

  // Play try again sound
  const playTryAgainSound = useCallback(() => {
    if (tryAgainAudio) {
      tryAgainAudio.currentTime = 0;
      tryAgainAudio.play().catch(e => console.log("Audio play error:", e));
    }
  }, [tryAgainAudio]);

  return {
    playTickSound,
    playEndSound,
    playWinSound,
    playTryAgainSound,
  };
};
