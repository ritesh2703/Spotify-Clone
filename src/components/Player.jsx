import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa';
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { motion } from 'framer-motion';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNextTrack,
    playPreviousTrack,
    volume, 
    setVolume,
    progress,
    duration,
    audioRef,
    seek,
    formatTime,
    isMuted,
    toggleMute
  } = usePlayer();

  const progressRef = useRef(null);

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressRef.current.clientWidth;
    const percentageClicked = (clickPosition / progressBarWidth) * 100;
    const newTime = (percentageClicked / 100) * duration;
    
    seek(newTime);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 h-24 flex items-center px-6 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-t border-gray-800 shadow-lg z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Left Section - Track Info */}
      <div className="flex items-center w-1/4 min-w-[200px]">
        {currentTrack ? (
          <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
            <img 
              src={currentTrack.imageUrl} 
              alt={currentTrack.title} 
              className="w-16 h-16 object-cover mr-4 rounded-md shadow-lg"
              onError={(e) => {
                e.target.src = 'https://imgjam.com/jam/artists/default.png';
              }}
            />
            <div className="overflow-hidden">
              <h4 className="text-white text-sm font-semibold truncate">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artist}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-gray-500 text-sm">No track selected</div>
        )}
      </div>
      
      {/* Center Section - Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 px-4">
        <div className="flex items-center space-x-8 mb-3">
          <button 
            onClick={playPreviousTrack}
            className="text-gray-400 hover:text-white transition transform hover:scale-110"
            disabled={!currentTrack}
          >
            <FaStepBackward />
          </button>
          
          <motion.button 
            onClick={togglePlay}
            className={`rounded-full w-10 h-10 flex items-center justify-center shadow-lg ${
              currentTrack ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
            }`}
            whileHover={currentTrack ? { scale: 1.1 } : {}}
            whileTap={currentTrack ? { scale: 0.95 } : {}}
            style={{ background: isPlaying && currentTrack ? '#1DB954' : '' }}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <FaPause className="text-black" />
            ) : (
              <FaPlay className="text-black ml-1" />
            )}
          </motion.button>
          
          <button 
            onClick={playNextTrack}
            className="text-gray-400 hover:text-white transition transform hover:scale-110"
            disabled={!currentTrack}
          >
            <FaStepForward />
          </button>
        </div>
        
        <div className="w-full flex items-center max-w-md">
          <span className="text-xs text-gray-400 mr-3 w-10 text-right">
            {formatTime(progress)}
          </span>
          <div 
            ref={progressRef}
            className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="bg-green-500 h-1 rounded-full relative"
              style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
            >
              <motion.div 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
                animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 ml-3 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Right Section - Volume Controls */}
      <div className="flex items-center justify-end w-1/4 space-x-4">
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            {!isMuted ? (
              <FaVolumeUp className="text-green-500" />
            ) : (
              <BsFillVolumeMuteFill className="text-red-400" />
            )}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-28 accent-green-500 hover:accent-green-400 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${isMuted ? 0 : volume}%, #4B5563 ${isMuted ? 0 : volume}%, #4B5563 100%)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Player;