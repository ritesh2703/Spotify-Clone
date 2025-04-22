import { useState } from 'react';
import { featuredPlaylists, recentlyPlayed, popularArtists } from '../mockData';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

// Get your free API key from https://developer.jamendo.com/v3.0
const JAMENDO_CLIENT_ID = 'c3e329e0'; // Replace with your actual client ID

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { playTrack } = usePlayer();

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

  const searchSongs = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Using Jamendo API for search
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}` +
        `&format=jsonpretty` +
        `&search=${encodeURIComponent(searchQuery)}` +
        `&limit=20` +
        `&audiodlformat=mp31` // Ensure we get MP3 format
      );
      
      const data = await response.json();
      
      const formattedResults = data.results?.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        imageUrl: track.image || 'https://imgjam.com/jam/artists/default.png',
        duration: formatDuration(track.duration),
        audioUrl: track.audio // Jamendo provides full tracks
      })) || [];

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchSongs();
    }
  };

  const handlePlayTrack = (track) => {
    if (track.audioUrl) {
      playTrack(track);
    } else {
      console.warn('No audio available for this track');
      // You could show a toast notification here
    }
  };

  return (
    <motion.div 
      className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] via-[#0a0a0a] to-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Search Bar */}
      <section className="mb-10">
        <motion.div className="relative" variants={itemVariants}>
          <div className="flex items-center bg-[#282828] rounded-full px-4 py-3 shadow-lg">
            <FiSearch className="text-gray-400 mr-3 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for songs, artists, or albums..."
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={searchSongs}
                disabled={isSearching}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ml-2 ${
                  isSearching 
                    ? 'bg-gray-500 text-gray-300' 
                    : 'bg-[#1DB954] text-white hover:bg-[#1ed760]'
                }`}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            )}
          </div>
          {isSearching && (
            <p className="text-gray-400 text-sm mt-2 ml-4">
              Searching for "{searchQuery}"...
            </p>
          )}
        </motion.div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="mb-10">
          <motion.h2 className="text-white text-3xl font-bold mb-6" variants={itemVariants}>
            Search Results
          </motion.h2>
          <motion.div variants={itemVariants}>
            <TrackList 
              tracks={searchResults} 
              onTrackClick={handlePlayTrack}
              showWarning={true} // Add a prop to show warning about CC licenses
            />
          </motion.div>
          <motion.p className="text-gray-400 text-sm mt-2" variants={itemVariants}>
            Note: These tracks are provided under Creative Commons licenses via Jamendo
          </motion.p>
        </section>
      )}

      {/* Regular Content */}
      {searchResults.length === 0 && (
        <>
          <section className="mb-10">
            <motion.h2 className="text-white text-3xl font-bold mb-6" variants={itemVariants}>
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
          
          <section className="mb-10">
            <motion.h2 className="text-white text-3xl font-bold mb-6" variants={itemVariants}>
              Recently Played
            </motion.h2>
            <motion.div variants={itemVariants}>
              <TrackList 
                tracks={recentlyPlayed} 
                onTrackClick={handlePlayTrack}
              />
            </motion.div>
          </section>
          
          <section className="mb-24">
            <motion.h2 className="text-white text-3xl font-bold mb-6" variants={itemVariants}>
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
        </>
      )}
    </motion.div>
  );
};

export default Home;