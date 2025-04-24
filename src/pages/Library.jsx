import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMusic, FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import TrackList from '../components/TrackList';

const JAMENDO_API_KEY = 'c3e329e0';

const Library = () => {
  const { 
    playlists = [], 
    viewingPlaylist, 
    viewPlaylist, 
    backToLibrary,
    createPlaylist,
    addToPlaylist,
    allSongs = [],
    currentTrack,
    isPlaying,
    playTrack,
    addToQueue
  } = usePlayer();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Ensure "Liked Music" playlist exists on first render
  useEffect(() => {
    const initializeLikedMusic = async () => {
      const hasLikedMusic = playlists.some(p => p.name === "Liked Music");
      if (!hasLikedMusic) {
        await createPlaylist("Liked Music");
      }
    };
    initializeLikedMusic();
  }, [playlists, createPlaylist]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}` +
            `&format=json` +
            `&search=${encodeURIComponent(searchQuery)}` +
            `&limit=20`
          );
          const data = await response.json();
          
          const formattedResults = data.results?.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artist_name,
            duration: formatDuration(track.duration),
            imageUrl: track.image || 'https://via.placeholder.com/150',
            audioUrl: track.audio
          })) || [];

          setSearchResults(formattedResults);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSongs();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowCreateModal(false);
    }
  };

  const handleAddToPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowAddSongModal(true);
  };

  const handleSelectSong = (song) => {
    if (selectedPlaylist?.id) {
      addToPlaylist(selectedPlaylist.id, song);
    }
    setShowAddSongModal(false);
    setSelectedPlaylist(null);
  };

  const handlePlayPlaylist = (startIndex = 0) => {
    if (viewingPlaylist?.tracks?.length) {
      playTrack(viewingPlaylist.tracks[startIndex]);
      // Queue the rest of the playlist
      viewingPlaylist.tracks.slice(startIndex + 1).forEach(track => {
        addToQueue(track);
      });
    }
  };

  const handlePlayTrack = (track, index) => {
    playTrack(track);
    // Queue the remaining tracks
    viewingPlaylist.tracks.slice(index + 1).forEach(t => {
      addToQueue(t);
    });
  };

  const availableSongs = showAddSongModal && searchQuery.trim() ? 
    searchResults : 
    allSongs.filter(song => {
      if (!viewingPlaylist?.tracks) return true;
      return !viewingPlaylist.tracks.some(track => track.id === song.id);
    });

  return (
    <motion.div 
      className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {viewingPlaylist ? (
        <div>
          <div className="flex items-center mb-8">
            <button 
              onClick={backToLibrary}
              className="mr-4 p-2 bg-[#282828] text-[#b3b3b3] hover:text-white rounded-full hover:bg-[#383838] transition"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">{viewingPlaylist.name}</h1>
              <p className="text-[#b3b3b3] text-sm">{viewingPlaylist.tracks?.length || 0} songs</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => handleAddToPlaylist(viewingPlaylist)}
              className="bg-[#1db954] hover:bg-[#1ed760] text-white px-6 py-2 rounded-full transition flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Songs
            </button>
            {viewingPlaylist.tracks?.length > 0 && (
              <button 
                onClick={() => handlePlayPlaylist(0)}
                className="bg-white text-black px-6 py-2 rounded-full transition flex items-center hover:bg-gray-100"
              >
                Play All
              </button>
            )}
          </div>
          
          {viewingPlaylist.tracks?.length > 0 ? (
            <div className="bg-[#121212] bg-opacity-50 rounded-lg overflow-hidden">
              {viewingPlaylist.tracks.map((track, index) => (
                <div 
                  key={`${track.id}-${index}`}
                  className={`flex items-center p-4 hover:bg-[#282828] transition cursor-pointer ${currentTrack?.id === track.id ? 'bg-[#282828]' : ''}`}
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <div className="w-10 text-center text-gray-400 mr-4">
                    {index + 1}
                  </div>
                  <img 
                    src={track.imageUrl} 
                    alt={track.title} 
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-white font-medium truncate ${currentTrack?.id === track.id ? 'text-[#1db954]' : ''}`}>
                      {track.title}
                    </h3>
                    <p className="text-[#b3b3b3] text-sm truncate">{track.artist}</p>
                  </div>
                  <div className="text-[#b3b3b3] text-sm">
                    {track.duration}
                  </div>
                  {currentTrack?.id === track.id && (
                    <div className="ml-4 text-[#1db954]">
                      {isPlaying ? '▶️' : '⏸'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#282828] rounded-xl p-8 text-center">
              <div className="bg-[#535353] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMusic className="text-white" size={24} />
              </div>
              <h2 className="text-white text-xl font-bold my-4">No songs in this playlist</h2>
              <p className="text-[#b3b3b3] mb-6">Add songs to get started</p>
              <button 
                onClick={() => handleAddToPlaylist(viewingPlaylist)}
                className="bg-[#1db954] hover:bg-[#1ed760] text-white font-bold px-6 py-2 rounded-full transition"
              >
                Add Songs
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              className="text-white text-3xl font-bold"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              Your Library
            </motion.h1>
            
            <button 
              className="bg-[#1db954] hover:bg-[#1ed760] text-white p-3 rounded-full transition"
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus size={20} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    className="bg-[#282828] p-4 rounded-xl hover:bg-[#383838] transition cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => viewPlaylist(playlist.id)}
                  >
                    <div className="relative mb-4">
                      <div className="aspect-square bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded-lg flex items-center justify-center">
                        <FiMusic className="text-white opacity-80 group-hover:opacity-100 transition" size={48} />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {playlist.tracks?.length || 0} songs
                      </div>
                    </div>
                    <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                    <p className="text-[#b3b3b3] text-sm">Playlist</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#282828] rounded-xl p-8 text-center">
                <div className="bg-[#535353] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMusic className="text-white" size={24} />
                </div>
                <h2 className="text-white text-2xl font-bold my-4">Create your first playlist</h2>
                <p className="text-[#b3b3b3] mb-6">It's easy, we'll help you</p>
                <button 
                  className="bg-[#1db954] hover:bg-[#1ed760] text-white font-bold px-6 py-3 rounded-full transition"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create playlist
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#282828] rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-bold">Create Playlist</h3>
                <button 
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName('');
                  }}
                  className="text-[#b3b3b3] hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#b3b3b3] text-sm mb-2">Playlist name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My awesome playlist"
                  className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName('');
                  }}
                  className="px-6 py-2 text-white bg-transparent hover:bg-[#383838] rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className={`px-6 py-2 text-white rounded-full transition ${newPlaylistName.trim() ? 'bg-[#1db954] hover:bg-[#1ed760]' : 'bg-[#535353] cursor-not-allowed'}`}
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Song Modal */}
      <AnimatePresence>
        {showAddSongModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              className="bg-[#282828] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-bold">
                  Add to {selectedPlaylist?.name}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddSongModal(false);
                    setSearchQuery('');
                  }}
                  className="text-[#b3b3b3] hover:text-white text-2xl"
                >
                  <FiX />
                </button>
              </div>

              <div className="relative mb-4">
                <div className="flex items-center bg-[#121212] rounded-lg px-4 py-3">
                  <FiSearch className="text-[#b3b3b3] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for songs..."
                    className="w-full bg-transparent text-white focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {isSearching ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1db954]"></div>
                </div>
              ) : availableSongs.length > 0 ? (
                <div className="space-y-2">
                  {availableSongs.map(song => (
                    <motion.div
                      key={song.id}
                      className="flex items-center p-3 bg-[#121212] hover:bg-[#282828] rounded-lg cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectSong(song)}
                    >
                      <img 
                        src={song.imageUrl} 
                        alt={song.title} 
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{song.title}</h4>
                        <p className="text-[#b3b3b3] text-sm truncate">{song.artist}</p>
                      </div>
                      <span className="text-[#b3b3b3] text-sm whitespace-nowrap ml-2">
                        {song.duration}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#b3b3b3]">
                    {searchQuery.trim() ? 'No results found' : 'Search for songs to add'}
                  </p>
                  <p className="text-[#1db954] text-xs mt-2">
                    Powered by Jamendo's free music API
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Library;