import { motion } from 'framer-motion';

const MoodCard = ({ mood, onClick }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg aspect-square cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <img 
        src={mood.imageUrl} 
        alt={mood.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-colors" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-xl font-bold">{mood.name}</h3>
      </div>
    </motion.div>
  );
};

export default MoodCard;