// src/components/PodcastCard.jsx
import { motion } from 'framer-motion';

const PodcastCard = ({ podcast, onPlay }) => {
  return (
    <motion.div 
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors duration-200"
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img 
          src={podcast.imageUrl} 
          alt={podcast.title} 
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="absolute bottom-6 right-2 bg-[#1DB954] rounded-full p-2 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <h3 className="text-white font-bold truncate">{podcast.title}</h3>
      <p className="text-gray-400 text-sm mt-1">{podcast.artist}</p>
      <p className="text-gray-500 text-xs mt-2">{podcast.duration}</p>
    </motion.div>
  );
};

export default PodcastCard;