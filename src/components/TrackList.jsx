import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';

const TrackList = ({ 
  tracks, 
  onTrackClick, 
  onPlayAll,
  onLikeTrack,
  isTrackLiked,
  showAlbum = false,
  showHeader = true,
  viewMode = 'list',
  onViewModeChange
}) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            className="relative bg-[#181818] rounded-lg p-4 cursor-pointer group overflow-hidden transition-all duration-200 hover:bg-[#282828]"
            style={{
              boxShadow: currentTrack?.id === track.id ? '0 8px 24px rgba(29, 185, 84, 0.2)' : 'none'
            }}
            onClick={() => {
              if (currentTrack?.id === track.id) {
                togglePlay();
              } else {
                onTrackClick(track);
              }
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentTrack?.id === track.id && (
              <div className="absolute inset-0 bg-green-500 opacity-10 rounded-lg pointer-events-none" />
            )}

            <div className="relative mb-4">
              <motion.div 
                className="relative aspect-square w-full"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={track.imageUrl || 'https://png.pngtree.com/png-clipart/20221006/original/pngtree-music-notes-png-image_8660757.png'} 
                  alt={track.title} 
                  className="w-full h-full object-cover rounded-md shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://png.pngtree.com/png-clipart/20221006/original/pngtree-music-notes-png-image_8660757.png';
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-md">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="flex space-x-1">
                      {[1, 1.5, 1.2, 1.8].map((scale, i) => (
                        <motion.span
                          key={i}
                          className="w-1 h-6 rounded-full"
                          style={{ backgroundColor: '#1DB954' }}
                          animate={{
                            scaleY: [1, scale, 1],
                            transition: { 
                              repeat: Infinity, 
                              duration: 0.8,
                              delay: i * 0.1
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="min-h-[60px]">
              <h3 
                className="font-medium truncate mb-1" 
                style={{ color: currentTrack?.id === track.id ? '#1DB954' : '#FFFFFF' }}
              >
                {track.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {track.artist}
              </p>
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
              {showAlbum && <span className="truncate">{track.album}</span>}
              <div className="flex items-center">
                {onLikeTrack && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeTrack(track);
                    }}
                    className="mr-2 text-gray-400 hover:text-[#1DB954] transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill={isTrackLiked?.(track.id) ? "#1DB954" : "currentColor"}
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>
                )}
                <span>{track.duration}</span>
              </div>
            </div>

            {currentTrack?.id === track.id && (
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            )}

            {onLikeTrack && isTrackLiked?.(track.id) && (
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#1DB954]"></div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#181818] rounded-lg overflow-hidden">
      {showHeader && (
        <div className="p-4 flex justify-between items-center border-b border-[#282828]">
          <h3 className="text-white font-bold">Tracks</h3>
          <div className="flex gap-3">
            {onPlayAll && (
              <button 
                onClick={onPlayAll}
                className="text-sm text-[#1DB954] hover:text-[#1ed760] font-medium"
              >
                Play All
              </button>
            )}
            <button 
              onClick={() => onViewModeChange?.('grid')}
              className="text-sm text-gray-400 hover:text-white font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-[#282828]">
        {tracks.map((track) => (
          <div 
            key={track.id} 
            className="flex items-center p-4 hover:bg-[#282828] transition-colors cursor-pointer group"
            onClick={() => {
              if (currentTrack?.id === track.id) {
                togglePlay();
              } else {
                onTrackClick(track);
              }
            }}
          >
            <div className="w-8 text-center text-gray-400 mr-4">
              {currentTrack?.id === track.id && isPlaying ? (
                <div className="flex space-x-1 justify-center">
                  {[1, 1.5, 1.2, 1.8].map((scale, i) => (
                    <motion.span
                      key={i}
                      className="w-1 h-4 rounded-full"
                      style={{ backgroundColor: '#1DB954' }}
                      animate={{
                        scaleY: [1, scale, 1],
                        transition: { 
                          repeat: Infinity, 
                          duration: 0.8,
                          delay: i * 0.1
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <span className="group-hover:hidden">
                  {tracks.indexOf(track) + 1}
                </span>
              )}
              <div className="hidden group-hover:flex items-center justify-center">
                {currentTrack?.id === track.id ? (
                  <svg viewBox="0 0 24 24" fill="#1DB954" className="w-5 h-5">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 mr-4">
              <img 
                src={track.imageUrl} 
                alt={track.title} 
                className="w-12 h-12 object-cover rounded"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-white truncate ${currentTrack?.id === track.id ? 'text-[#1DB954]' : ''}`}>
                {track.title}
              </h4>
              <p className="text-gray-400 text-sm truncate">
                {track.artist} {showAlbum && `• ${track.album}`}
              </p>
            </div>
            
            <div className="ml-4 flex items-center">
              {onLikeTrack && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeTrack(track);
                  }}
                  className="p-2 text-gray-400 hover:text-[#1DB954] mr-4"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill={isTrackLiked?.(track.id) ? "#1DB954" : "currentColor"}
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              )}
              
              <span className="text-gray-400 text-sm">
                {track.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;