import { usePlayer } from '../context/PlayerContext';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist }) => {
  const { playTrack } = usePlayer();

  const handleClick = () => {
    playTrack({
      id: playlist.id,
      title: playlist.name,
      artist: playlist.owner || 'Various Artists',
      imageUrl: playlist.imageUrl,
      duration: playlist.duration || '30:00'
    });
  };

  return (
    <motion.div 
      className="bg-[#181818] p-4 rounded-lg cursor-pointer relative overflow-hidden group"
      onClick={handleClick}
      whileHover={{ 
        backgroundColor: '#282828',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative mb-4">
        <motion.img 
          src={playlist.imageUrl} 
          alt={playlist.name} 
          className="w-full aspect-square object-cover rounded-md shadow-lg"
          whileHover={{ scale: 1.03 }}
        />
        <motion.div 
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity rounded-md"
          initial={{ opacity: 0 }}
        />
      </div>
      
      <div className="min-h-[60px]">
        <h3 className="font-bold text-white truncate mb-1">
          {playlist.name}
        </h3>
        <p className="text-sm text-[#A7A7A7] line-clamp-2">
          {playlist.description || `By ${playlist.owner || 'Spotify'}`}
        </p>
      </div>
      
      {/* Play button overlay */}
      <motion.div 
        className="absolute bottom-6 right-6 bg-[#1DB954] rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0"
        whileHover={{ scale: 1.1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M8 5v14l11-7z" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default PlaylistCard;