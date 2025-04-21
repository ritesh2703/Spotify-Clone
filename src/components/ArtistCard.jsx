import { motion } from 'framer-motion';

const ArtistCard = ({ artist }) => {
  return (
    <motion.div 
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="relative mb-4">
        <motion.img 
          src={artist.imageUrl} 
          alt={artist.name} 
          className="w-full aspect-square object-cover rounded-full shadow-lg"
          whileHover={{ scale: 1.03 }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-20 transition-opacity"
          initial={{ opacity: 0 }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-white font-bold truncate">{artist.name}</h3>
        <p className="text-[#A7A7A7] text-sm mt-1">Artist</p>
      </div>
      
      {/* Play button */}
      <motion.div 
        className="absolute bottom-6 right-6 bg-[#1DB954] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
        whileHover={{ scale: 1.1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M8 5v14l11-7z" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ArtistCard;