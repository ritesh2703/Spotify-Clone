// src/components/SectionHeader.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectionHeader = ({ title, viewAllLink }) => {
  return (
    <motion.div 
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-white text-2xl font-bold">{title}</h2>
      {viewAllLink && (
        <Link 
          to={viewAllLink}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          View All
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeader;