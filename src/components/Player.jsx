import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa';
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import MusicVisualizer from './MusicVisualizer';
import { motion } from 'framer-motion';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume,
    progress
  } = usePlayer();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 h-24 flex items-center px-6"
      style={{
        background: 'linear-gradient(to right, #1a1a1a, #2a2a2a)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Left Section - Track Info */}
      <div className="flex items-center w-1/4">
        {currentTrack ? (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={currentTrack.imageUrl} 
              alt={currentTrack.title} 
              className="w-16 h-16 object-cover mr-4 rounded-md shadow-lg"
            />
            <div>
              <h4 className="text-white text-sm font-semibold truncate max-w-[180px]">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-xs">
                {currentTrack.artist}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-gray-500 text-sm">No track selected</div>
        )}
      </div>
      
      {/* Center Section - Controls */}
      <div className="flex flex-col items-center justify-center w-2/4">
        <div className="flex items-center space-x-8 mb-3">
          <button className="text-gray-400 hover:text-white transition transform hover:scale-110">
            <FaStepBackward />
          </button>
          
          <motion.button 
            onClick={togglePlay}
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isPlaying ? '#1DB954' : 'white'
            }}
          >
            {isPlaying ? (
              <FaPause className="text-black" />
            ) : (
              <FaPlay className="text-black ml-1" />
            )}
          </motion.button>
          
          <button className="text-gray-400 hover:text-white transition transform hover:scale-110">
            <FaStepForward />
          </button>
        </div>
        
        <div className="w-full flex items-center">
          <span className="text-xs text-gray-400 mr-3 w-10 text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="bg-green-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress / 180) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-gray-400 ml-3 w-10">
            {currentTrack?.duration || '3:00'}
          </span>
        </div>
      </div>
      
      {/* Right Section - Volume Controls */}
      <div className="flex items-center justify-end w-1/4 space-x-4">
        <MusicVisualizer isPlaying={isPlaying} />
        
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-white">
            {volume > 0 ? (
              <FaVolumeUp className="text-green-500" />
            ) : (
              <BsFillVolumeMuteFill className="text-red-400" />
            )}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => setVolume(e.target.value)}
            className="w-28 accent-green-500 hover:accent-green-400 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, #4B5563 ${volume}%, #4B5563 100%)`
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Player;