import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';

const TrackList = ({ tracks, onTrackClick }) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();

  return (
    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#121212] to-[#000000] shadow-lg">
      {/* Header */}
      <div 
        className="grid grid-cols-12 text-sm py-4 px-6 font-medium sticky top-0 z-10"
        style={{ 
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          color: '#A7A7A7',
          borderBottom: '1px solid #282828',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-4">ALBUM</div>
        <div className="col-span-2 text-right">DURATION</div>
      </div>
      
      {/* Track items */}
      <div className="bg-gradient-to-b from-[#121212] to-[#000000]">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            className="grid grid-cols-12 items-center text-sm py-3 px-6 cursor-pointer group relative"
            style={{ 
              backgroundColor: currentTrack?.id === track.id ? 'rgba(40, 40, 40, 0.7)' : 'transparent',
              color: currentTrack?.id === track.id ? '#1DB954' : '#FFFFFF',
              borderBottom: '1px solid rgba(40, 40, 40, 0.5)'
            }}
            onClick={() => {
              if (currentTrack?.id === track.id) {
                togglePlay();
              } else {
                onTrackClick(track);
              }
            }}
            whileHover={{ 
              backgroundColor: 'rgba(40, 40, 40, 0.5)',
            }}
            transition={{ duration: 0.2 }}
          >
            {currentTrack?.id === track.id && (
              <div className="absolute inset-0 bg-green-500 opacity-10 rounded-md pointer-events-none" />
            )}

            <div className="col-span-1 relative z-10">
              {currentTrack?.id === track.id && isPlaying ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="flex space-x-1">
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
                </div>
              ) : (
                <>
                  <span 
                    className="group-hover:hidden block"
                    style={{ color: '#A7A7A7' }}
                  >
                    {index + 1}
                  </span>
                  <div className="hidden group-hover:block w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              )}
            </div>

            <div className="col-span-5 flex items-center space-x-3 relative z-10">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={track.imageUrl || 'https://png.pngtree.com/png-clipart/20221006/original/pngtree-music-notes-png-image_8660757.png'} 
                  alt={track.title} 
                  className="w-10 h-10 object-cover rounded-sm shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://png.pngtree.com/png-clipart/20221006/original/pngtree-music-notes-png-image_8660757.png';
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity rounded-sm" />
              </motion.div>
              <div className="overflow-hidden">
                <h4 className="font-medium truncate">{track.title}</h4>
                <p className="text-xs truncate" style={{ color: '#A7A7A7' }}>
                  {track.artist}
                </p>
              </div>
            </div>

            <div className="col-span-4 truncate relative z-10" style={{ color: '#A7A7A7' }}>
              {track.album}
            </div>

            <div className="col-span-2 text-right relative z-10" style={{ color: '#A7A7A7' }}>
              {track.duration}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;