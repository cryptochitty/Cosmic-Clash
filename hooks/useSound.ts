import { useCallback } from 'react';

export const useSound = (soundFile: string, volume: number = 0.5) => {
  const play = useCallback(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(soundFile);
      audio.volume = volume;
      audio.play().catch(error => {
        // Autoplay policies may prevent playback until user interaction.
        // Since sounds are triggered by clicks, this is generally not an issue.
        console.error(`Could not play sound ${soundFile}:`, error);
      });
    }
  }, [soundFile, volume]);

  return play;
};
