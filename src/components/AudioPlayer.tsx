import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#382f29] to-[#2c2520] rounded-xl p-4 sm:p-6 shadow-xl border border-[#e9883e]/20">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{title}</h3>
        <p className="text-xs sm:text-sm text-[#b8a99d]">Audio Memory</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between text-xs text-[#b8a99d] mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={isLoading}
            className="w-full h-2 bg-[#181411] rounded-lg appearance-none cursor-pointer audio-slider"
            style={{
              background: `linear-gradient(to right, #e9883e 0%, #e9883e ${(currentTime / duration) * 100}%, #181411 ${(currentTime / duration) * 100}%, #181411 100%)`
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={skipBackward}
            disabled={isLoading}
            className="p-2 sm:p-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors disabled:opacity-50 touch-manipulation"
            title="Skip back 10s"
          >
            <RotateCcw className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-3 sm:p-4 bg-[#e9883e] text-[#181411] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center touch-manipulation min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#181411] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={skipForward}
            disabled={isLoading}
            className="p-2 sm:p-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors disabled:opacity-50 touch-manipulation"
            title="Skip forward 10s"
          >
            <FastForward className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Volume Control - Hidden on very small screens, visible on larger mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={toggleMute}
            className="p-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <div className="flex-1 sm:flex-none sm:w-20 max-w-[120px]">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-[#181411] rounded-lg appearance-none cursor-pointer volume-slider touch-manipulation"
              style={{
                background: `linear-gradient(to right, #e9883e 0%, #e9883e ${(isMuted ? 0 : volume) * 100}%, #181411 ${(isMuted ? 0 : volume) * 100}%, #181411 100%)`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .audio-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e9883e;
          cursor: pointer;
          border: 3px solid #181411;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
        
        .audio-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e9883e;
          cursor: pointer;
          border: 3px solid #181411;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e9883e;
          cursor: pointer;
          border: 2px solid #181411;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e9883e;
          cursor: pointer;
          border: 2px solid #181411;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Ensure touch targets are large enough on mobile */
        @media (max-width: 640px) {
          .audio-slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
          }
          
          .audio-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
          }

          .volume-slider::-webkit-slider-thumb {
            width: 20px;
            height: 20px;
          }
          
          .volume-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;