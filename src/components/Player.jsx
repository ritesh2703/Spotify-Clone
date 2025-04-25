import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp,
  FaList,
  FaExpand,
  FaCompress,
  FaMicrophone,
  FaTimes,
  FaPlus,
  FaMinus,
  FaMusic,
  FaHeadphones,
  FaRandom,
  FaRedo
} from 'react-icons/fa';
import { BsFillVolumeMuteFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const JAMENDO_API_KEY = 'c3e329e0';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

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
    toggleMute,
    viewingPlaylist = { tracks: [] },
    playlists = [],
    addToPlaylist,
    createPlaylist,
    shuffleQueue,
    repeatMode,
    toggleRepeat,
    setCurrentTrackIndex
  } = usePlayer();

  // Initialize queue with safe fallback
  const queue = viewingPlaylist?.tracks || [];

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  
  const progressRef = useRef(null);
  const playerRef = useRef(null);
  const playlistNameInputRef = useRef(null);
  const lyricsPopupRef = useRef(null);
  const nowPlayingPopupRef = useRef(null);
  const queuePopupRef = useRef(null);

  // Fetch lyrics from Jamendo API
  const fetchLyrics = async () => {
    if (!currentTrack?.id) return;
    
    setIsLoadingLyrics(true);
    try {
      const response = await fetch(
        `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&id=${currentTrack.id}&include=lyrics`
      );
      const data = await response.json();
      
      if (data.results?.[0]?.lyrics) {
        setLyrics(data.results[0].lyrics);
      } else {
        setLyrics('No lyrics available for this track');
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setLyrics('Could not load lyrics');
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  // Load lyrics when showing
  useEffect(() => {
    if (showLyrics) {
      fetchLyrics();
    }
  }, [showLyrics, currentTrack]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lyricsPopupRef.current && !lyricsPopupRef.current.contains(event.target)) {
        setShowLyrics(false);
      }
      if (nowPlayingPopupRef.current && !nowPlayingPopupRef.current.contains(event.target)) {
        setShowNowPlaying(false);
      }
      if (queuePopupRef.current && !queuePopupRef.current.contains(event.target)) {
        setShowQueue(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle shuffle functionality
  const handleShuffle = () => {
    if (queue.length > 0) {
      shuffleQueue();
    }
  };

  // Handle track selection from queue
  const handlePlayTrackFromQueue = (index) => {
    setCurrentTrackIndex(index);
    if (!isPlaying) {
      togglePlay();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (!currentTrack) return;
      
      switch (e.code) {
        case 'Space': 
          e.preventDefault();
          togglePlay(); 
          break;
        case 'ArrowRight': 
          e.preventDefault();
          if (e.ctrlKey) seek(Math.min(progress + 10, duration));
          else playNextTrack();
          break;
        case 'ArrowLeft': 
          e.preventDefault();
          if (e.ctrlKey) seek(Math.max(progress - 10, 0));
          else playPreviousTrack();
          break;
        case 'KeyM': 
          e.preventDefault();
          toggleMute(); 
          break;
        case 'KeyL': 
          e.preventDefault();
          setShowLyrics(!showLyrics);
          break;
        case 'KeyF': 
          e.preventDefault();
          toggleFullscreen(); 
          break;
        case 'KeyP': 
          e.preventDefault();
          setShowPlaylistModal(true);
          break;
        case 'KeyN': 
          e.preventDefault();
          setShowNowPlaying(!showNowPlaying);
          break;
        case 'KeyQ':
          e.preventDefault();
          setShowQueue(!showQueue);
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTrack, isPlaying, progress, duration, showLyrics, isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen && playerRef.current) {
      playerRef.current.requestFullscreen?.().catch(console.error);
      setIsFullscreen(true);
      setIsMinimized(false);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setShowLyrics(false);
      setShowNowPlaying(false);
      setShowQueue(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addToPlaylist(playlistId, currentTrack);
      setShowPlaylistModal(false);
    } catch (error) {
      console.error('Error adding to playlist:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowPlaylistModal(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    seek(percentage * duration);
  };

  // Minimized player view
  if (isMinimized && !isFullscreen) {
    return (
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-br from-[#121212] via-[#181818] to-[#1a1a1a] border-t border-gray-800 shadow-lg z-50 flex items-center px-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center w-1/4 min-w-[200px]">
          {currentTrack && (
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 rounded-md overflow-hidden">
                <img 
                  src={currentTrack.imageUrl} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{currentTrack.title}</h4>
                <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center w-2/4">
          <button 
            onClick={togglePlay}
            className={`rounded-full flex items-center justify-center w-8 h-8 shadow-lg ${
              currentTrack ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
            }`}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <FaPause className="text-black text-xs" />
            ) : (
              <FaPlay className="text-black text-xs ml-0.5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-end w-1/4 space-x-3">
          <button 
            onClick={() => setShowLyrics(true)}
            className="text-gray-400 hover:text-white text-sm"
            disabled={!currentTrack}
          >
            <FaMicrophone />
          </button>
          
          <button 
            onClick={() => setShowNowPlaying(true)}
            className="text-gray-400 hover:text-white text-sm"
            disabled={!currentTrack}
          >
            <FaMusic />
          </button>
          
          <button 
            onClick={() => setShowQueue(true)}
            className="text-gray-400 hover:text-white text-sm"
            disabled={!currentTrack || queue.length === 0}
          >
            <FaHeadphones />
          </button>
          
          <button 
            onClick={toggleMinimize}
            className="text-gray-400 hover:text-white text-sm"
          >
            <FaExpand />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Main Player */}
      <motion.div 
        ref={playerRef}
        className={`fixed bottom-0 left-0 right-0 flex items-center px-6 bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] border-t border-gray-800 shadow-lg z-50 ${
          isFullscreen ? 'h-screen flex-col justify-center bg-gradient-to-br from-[#050505] via-[#121212] to-[#1f1f1f]' : 'h-24'
        }`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Track Info */}
        <div className={`flex items-center ${isFullscreen ? 'w-full justify-center mb-8' : 'w-1/4 min-w-[200px]'}`}>
          {currentTrack ? (
            <div className={`flex items-center ${isFullscreen ? 'flex-col text-center' : ''}`}>
              <motion.div 
                className={`rounded-md shadow-lg overflow-hidden ${
                  isFullscreen ? 'w-72 h-72 mb-6' : 'w-16 h-16 mr-4'
                }`}
                whileHover={isFullscreen ? { scale: 1.03 } : {}}
              >
                <img 
                  src={currentTrack.imageUrl} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className={`${isFullscreen ? 'max-w-2xl' : ''}`}>
                <div className="flex items-center justify-center">
                  <h4 className={`font-semibold truncate ${
                    isFullscreen ? 'text-2xl text-white mb-2' : 'text-sm text-white'
                  }`}>
                    {currentTrack.title}
                  </h4>
                  <button 
                    onClick={() => setShowPlaylistModal(true)}
                    className={`ml-3 transition ${isFullscreen ? 'text-2xl' : 'text-sm'}`}
                    aria-label="Add to playlist"
                  >
                    <FaPlus className="text-gray-400 hover:text-white" />
                  </button>
                </div>
                <p className={`truncate ${
                  isFullscreen ? 'text-lg text-gray-300' : 'text-xs text-gray-400'
                }`}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No track selected</div>
          )}
        </div>

        {/* Player Controls */}
        <div className={`flex flex-col items-center ${isFullscreen ? 'w-full' : 'w-2/4 px-4'}`}>
          <div className="flex items-center space-x-8 mb-3">
            <button 
              onClick={playPreviousTrack}
              className="text-gray-400 hover:text-white transition transform hover:scale-110"
              disabled={!currentTrack}
              aria-label="Previous track"
            >
              <FaStepBackward size={isFullscreen ? 20 : 16} />
            </button>
            
            <motion.button 
              onClick={togglePlay}
              className={`rounded-full flex items-center justify-center shadow-lg ${
                currentTrack ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
              } ${isFullscreen ? 'w-20 h-20' : 'w-12 h-12'}`}
              whileHover={currentTrack ? { scale: 1.1 } : {}}
              whileTap={currentTrack ? { scale: 0.95 } : {}}
              style={{ background: isPlaying && currentTrack ? '#1DB954' : '' }}
              disabled={!currentTrack}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <FaPause className={`text-black ${isFullscreen ? 'text-2xl' : 'text-lg'}`} />
              ) : (
                <FaPlay className={`text-black ${isFullscreen ? 'text-2xl ml-1' : 'text-lg ml-1'}`} />
              )}
            </motion.button>
            
            <button 
              onClick={playNextTrack}
              className="text-gray-400 hover:text-white transition transform hover:scale-110"
              disabled={!currentTrack}
              aria-label="Next track"
            >
              <FaStepForward size={isFullscreen ? 20 : 16} />
            </button>
          </div>
          
          <div className={`flex items-center ${isFullscreen ? 'w-full max-w-2xl' : 'w-full max-w-md'}`}>
            <span className="text-xs text-gray-400 mr-3 w-10 text-right">
              {formatTime(progress)}
            </span>
            <div 
              ref={progressRef}
              className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-gradient-to-r from-green-500 to-green-300 h-full rounded-full relative"
                style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              >
                <motion.div 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
                  animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                Click to seek | Ctrl+←/→ to jump 10s
              </span>
            </div>
            <span className="text-xs text-gray-400 ml-3 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Right Controls */}
        <div className={`flex items-center ${isFullscreen ? 'absolute top-6 right-6' : 'justify-end w-1/4'} space-x-4`}>
          {/* Shuffle and Repeat Controls */}
          {!isFullscreen && (
            <>
              <button 
                onClick={handleShuffle}
                className={`text-gray-400 hover:text-white transition ${
                  queue.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={queue.length === 0}
                aria-label="Shuffle queue"
              >
                <FaRandom size={16} />
              </button>
              <button 
                onClick={toggleRepeat}
                className={`transition ${
                  repeatMode === 'off' ? 'text-gray-400' :
                  repeatMode === 'all' ? 'text-green-500' :
                  'text-green-500'
                }`}
                aria-label={`Repeat ${repeatMode}`}
              >
                <FaRedo size={16} />
                {repeatMode === 'one' && (
                  <span className="absolute -bottom-1 -right-1 text-xs">1</span>
                )}
              </button>
            </>
          )}

          <div className="flex items-center space-x-2 group">
            <button 
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {!isMuted ? (
                <FaVolumeUp className="text-green-500" size={isFullscreen ? 20 : 16} />
              ) : (
                <BsFillVolumeMuteFill className="text-red-400" size={isFullscreen ? 20 : 16} />
              )}
            </button>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={isMuted ? 0 : volume} 
              onChange={(e) => {
                setVolume(parseInt(e.target.value));
                if (isMuted) toggleMute(false);
              }}
              className={`accent-green-500 hover:accent-green-400 cursor-pointer ${
                isFullscreen ? 'w-32' : 'w-24'
              }`}
            />
          </div>
          
          {!isFullscreen && (
            <>
              <button 
                onClick={() => setShowNowPlaying(!showNowPlaying)}
                className="text-gray-400 hover:text-white ml-2 transition"
                aria-label="Show now playing"
              >
                <FaMusic size={16} />
              </button>
              
              <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className="text-gray-400 hover:text-white ml-2 transition"
                aria-label="Show lyrics"
              >
                <FaMicrophone size={16} />
              </button>
              
              <button 
                onClick={() => setShowQueue(!showQueue)}
                className="text-gray-400 hover:text-white ml-2 transition"
                disabled={queue.length === 0}
                aria-label="Show queue"
              >
                <FaHeadphones size={16} />
              </button>
            </>
          )}
          
          <button 
            onClick={toggleMinimize}
            className="text-gray-400 hover:text-white ml-2 transition"
            aria-label="Minimize player"
          >
            <FaMinus size={16} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white ml-4 transition"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <FaCompress size={isFullscreen ? 20 : 16} />
            ) : (
              <FaExpand size={isFullscreen ? 20 : 16} />
            )}
          </button>
        </div>

        {/* Fullscreen Content */}
        {isFullscreen && (
          <div className="w-full max-w-4xl px-8 mb-8">
            {/* Lyrics Display */}
            {showLyrics && (
              <div className="mb-6 bg-black bg-opacity-30 p-5 rounded-xl backdrop-blur-sm max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-medium">Lyrics</h3>
                  <button 
                    onClick={() => setShowLyrics(false)}
                    className="text-gray-300 hover:text-white p-1 rounded-full bg-black bg-opacity-50"
                  >
                    <FaTimes />
                  </button>
                </div>
                {isLoadingLyrics ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse text-gray-400">Loading lyrics...</div>
                  </div>
                ) : (
                  <pre className="text-gray-100 whitespace-pre-wrap font-sans text-center">
                    {lyrics}
                  </pre>
                )}
              </div>
            )}

            {/* Queue Preview */}
            {queue.length > 0 && !showLyrics && (
              <div className="mb-8 bg-black bg-opacity-20 p-5 rounded-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-gray-300 text-sm font-medium uppercase tracking-wider">Up Next</h4>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleShuffle}
                      className="text-gray-400 hover:text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition"
                      disabled={queue.length === 0}
                      aria-label="Shuffle queue"
                    >
                      <FaRandom size={14} />
                    </button>
                    <button 
                      onClick={toggleRepeat}
                      className={`p-2 rounded-full transition ${
                        repeatMode === 'off' ? 'text-gray-400 bg-black bg-opacity-30 hover:bg-opacity-50' :
                        repeatMode === 'all' ? 'text-green-500 bg-green-900 bg-opacity-30' :
                        'text-green-500 bg-green-900 bg-opacity-50'
                      }`}
                      aria-label="Toggle repeat"
                    >
                      <FaRedo size={14} />
                      {repeatMode === 'one' && (
                        <span className="absolute -bottom-1 -right-1 text-xs">1</span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {queue.slice(0, 5).map((track, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 bg-black bg-opacity-30 rounded-lg hover:bg-opacity-40 transition group"
                      onClick={() => handlePlayTrackFromQueue(index)}
                    >
                      <div className="w-12 h-12 mr-4 rounded overflow-hidden">
                        <img 
                          src={track.imageUrl} 
                          alt={track.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-md font-medium truncate">{track.title}</p>
                        <p className="text-gray-300 text-sm truncate">{track.artist}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrackFromQueue(index);
                        }}
                        className="text-gray-300 hover:text-white ml-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                        aria-label="Play this track next"
                      >
                        <FaPlay className="text-xs" />
                      </button>
                    </div>
                  ))}
                  {queue.length > 5 && (
                    <div className="text-center text-gray-400 text-sm mt-2">
                      + {queue.length - 5} more tracks
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className={`px-6 py-3 rounded-full flex items-center transition ${
                  showLyrics ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaMicrophone className="mr-2" />
                {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
              </button>
              <button 
                onClick={() => setShowPlaylistModal(true)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full flex items-center transition"
              >
                <FaList className="mr-2" />
                Add to Playlist
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Lyrics Popup (Non-Fullscreen) */}
      <AnimatePresence>
        {showLyrics && !isFullscreen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={lyricsPopupRef}
              className="bg-gradient-to-br from-[#181818] to-[#282828] rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                <div>
                  <h3 className="text-white text-xl font-bold">Lyrics</h3>
                  <p className="text-gray-300 text-sm truncate">
                    {currentTrack?.title || 'Current Track'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowLyrics(false)}
                  className="text-gray-300 hover:text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                  aria-label="Close lyrics"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {isLoadingLyrics ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse text-gray-400">Loading lyrics...</div>
                  </div>
                ) : (
                  <pre className="text-gray-100 whitespace-pre-wrap font-sans text-center">
                    {lyrics}
                  </pre>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Now Playing Popup */}
      <AnimatePresence>
        {showNowPlaying && !isFullscreen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={nowPlayingPopupRef}
              className="bg-gradient-to-br from-[#181818] to-[#282828] rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                <div>
                  <h3 className="text-white text-xl font-bold">Now Playing</h3>
                  <p className="text-gray-300 text-sm truncate">
                    {currentTrack?.title || 'Current Track'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowNowPlaying(false)}
                  className="text-gray-300 hover:text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                  aria-label="Close now playing"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {currentTrack ? (
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 mb-6 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={currentTrack.imageUrl} 
                        alt={currentTrack.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-center mb-6">
                      <h4 className="text-white text-xl font-bold mb-1">{currentTrack.title}</h4>
                      <p className="text-gray-300">{currentTrack.artist}</p>
                    </div>
                    
                    <div className="w-full mb-6">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div 
                        className="w-full h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-300 h-full rounded-full relative"
                          style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6 mb-6">
                      <button 
                        onClick={playPreviousTrack}
                        className="text-gray-400 hover:text-white transition"
                        disabled={!currentTrack}
                      >
                        <FaStepBackward size={20} />
                      </button>
                      
                      <button 
                        onClick={togglePlay}
                        className={`rounded-full flex items-center justify-center w-12 h-12 shadow-lg ${
                          currentTrack ? 'bg-white hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!currentTrack}
                      >
                        {isPlaying ? (
                          <FaPause className="text-black text-lg" />
                        ) : (
                          <FaPlay className="text-black text-lg ml-1" />
                        )}
                      </button>
                      
                      <button 
                        onClick={playNextTrack}
                        className="text-gray-400 hover:text-white transition"
                        disabled={!currentTrack}
                      >
                        <FaStepForward size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <button 
                        onClick={() => setShowLyrics(true)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        <FaMicrophone size={18} />
                      </button>
                      
                      <button 
                        onClick={() => setShowPlaylistModal(true)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        <FaPlus size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-400">
                    <p>No track currently playing</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue Popup */}
      <AnimatePresence>
        {showQueue && !isFullscreen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={queuePopupRef}
              className="bg-gradient-to-br from-[#181818] to-[#282828] rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                <div>
                  <h3 className="text-white text-xl font-bold">Play Queue</h3>
                  <p className="text-gray-300 text-sm">
                    {queue.length} track{queue.length !== 1 ? 's' : ''} in queue
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleShuffle}
                    className={`text-gray-400 hover:text-white p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition ${
                      queue.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={queue.length === 0}
                    aria-label="Shuffle queue"
                  >
                    <FaRandom size={14} />
                  </button>
                  <button 
                    onClick={toggleRepeat}
                    className={`p-2 rounded-full transition ${
                      repeatMode === 'off' ? 'text-gray-400 bg-black bg-opacity-30 hover:bg-opacity-50' :
                      repeatMode === 'all' ? 'text-green-500 bg-green-900 bg-opacity-30' :
                      'text-green-500 bg-green-900 bg-opacity-50'
                    }`}
                    aria-label="Toggle repeat"
                  >
                    <FaRedo size={14} />
                    {repeatMode === 'one' && (
                      <span className="absolute -bottom-1 -right-1 text-xs">1</span>
                    )}
                  </button>
                  <button 
                    onClick={() => setShowQueue(false)}
                    className="text-gray-300 hover:text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                    aria-label="Close queue"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1">
                {queue.length > 0 ? (
                  <div className="space-y-2">
                    {queue.map((track, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-3 bg-[#383838] hover:bg-[#484848] rounded-lg transition cursor-pointer group"
                        onClick={() => handlePlayTrackFromQueue(index)}
                      >
                        <div className="w-12 h-12 mr-4 rounded overflow-hidden">
                          <img 
                            src={track.imageUrl} 
                            alt={track.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-md font-medium truncate">{track.title}</p>
                          <p className="text-gray-300 text-sm truncate">{track.artist}</p>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-white ml-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrackFromQueue(index);
                          }}
                          aria-label="Play this track next"
                        >
                          <FaPlay className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FaHeadphones size={32} className="mb-4" />
                    <p>Your queue is empty</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-[#181818] to-[#282828] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                <div>
                  <h3 className="text-white text-xl font-bold">Add to Playlist</h3>
                  <p className="text-gray-300 text-sm truncate">
                    Adding: {currentTrack?.title || 'Current Track'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowPlaylistModal(false)}
                  className="text-gray-300 hover:text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
                  aria-label="Close playlist modal"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {playlists.length > 0 ? (
                  <div className="space-y-3">
                    {playlists.map(playlist => (
                      <motion.div 
                        key={playlist.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 hover:bg-[#383838] cursor-pointer rounded-lg flex justify-between items-center transition"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                      >
                        <div>
                          <h4 className="text-white font-medium">{playlist.name}</h4>
                          <p className="text-gray-400 text-xs">
                            {playlist.tracks?.length || 0} tracks
                            {playlist.name === "Liked Music" && " • Default playlist"}
                          </p>
                        </div>
                        <FaPlus className="text-gray-400" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p className="mb-4">You don't have any playlists yet</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    ref={playlistNameInputRef}
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="New playlist name"
                    className="flex-1 bg-[#383838] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button 
                    onClick={handleCreatePlaylist}
                    disabled={!newPlaylistName.trim()}
                    className={`px-5 py-3 rounded-lg transition flex items-center ${
                      newPlaylistName.trim() 
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaPlus className="mr-2" />
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Player;