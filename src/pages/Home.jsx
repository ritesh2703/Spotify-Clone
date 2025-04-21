import { featuredPlaylists, recentlyPlayed, popularArtists } from '../mockData';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';
import { motion } from 'framer-motion';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] via-[#0a0a0a] to-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Featured Playlists Section */}
      <section className="mb-10">
        <motion.h2 
          className="text-white text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          Featured Playlists
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {featuredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              variants={itemVariants}
              custom={index}
              whileHover="hover"
            >
              <PlaylistCard playlist={playlist} />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Recently Played Section */}
      <section className="mb-10">
        <motion.h2 
          className="text-white text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          Recently Played
        </motion.h2>
        <motion.div variants={itemVariants}>
          <TrackList tracks={recentlyPlayed} />
        </motion.div>
      </section>
      
      {/* Popular Artists Section - Added extra padding bottom */}
      <section className="mb-24">
        <motion.h2 
          className="text-white text-3xl font-bold mb-6"
          variants={itemVariants}
        >
          Popular Artists
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {popularArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              variants={itemVariants}
              custom={index}
              whileHover="hover"
            >
              <ArtistCard artist={artist} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;