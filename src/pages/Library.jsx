import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMusic, FiArrowLeft, FiSearch } from 'react-icons/fi';
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
    allSongs = []
  } = usePlayer();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
            imageUrl: track.image || 'https://imgjam.com/jam/artists/default.png',
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
      setShowCreateForm(false);
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

  const availableSongs = showAddSongModal && searchQuery.trim() ? 
    searchResults : 
    allSongs.filter(song => {
      if (!viewingPlaylist?.tracks) return true;
      return !viewingPlaylist.tracks.some(track => track.id === song.id);
    });

  return (
    <motion.div 
      className="flex-1 p-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {viewingPlaylist ? (
        <div>
          <div className="flex items-center mb-6">
            <button 
              onClick={backToLibrary}
              className="mr-4 text-[#B2B2B2] hover:text-white"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">{viewingPlaylist.name}</h1>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => handleAddToPlaylist(viewingPlaylist)}
              className="bg-[#6C5CE7] text-white px-4 py-2 rounded-full hover:bg-[#5D4ECB] transition"
            >
              Add Songs
            </button>
          </div>
          
          {viewingPlaylist.tracks?.length > 0 ? (
            <TrackList tracks={viewingPlaylist.tracks} />
          ) : (
            <div className="bg-[#2D2D44] rounded-lg p-8 text-center">
              <FiMusic className="mx-auto text-[#6C5CE7]" size={48} />
              <h2 className="text-white text-xl font-bold my-4">No songs in this playlist</h2>
              <p className="text-[#B2B2B2] mb-6">Add songs to get started</p>
              <button 
                onClick={() => handleAddToPlaylist(viewingPlaylist)}
                className="bg-[#6C5CE7] text-white font-bold px-6 py-2 rounded-full hover:bg-[#5D4ECB] transition"
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
            
            <div className="flex space-x-2">
              <button 
                className="bg-[#6C5CE7] text-white p-2 rounded-full hover:bg-[#5D4ECB] transition"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <FiPlus size={20} />
              </button>
            </div>
          </div>

          {showCreateForm && (
            <motion.div 
              className="bg-[#2D2D44] p-4 rounded-lg mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3 className="text-white font-medium mb-3">Create New Playlist</h3>
              <div className="flex">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="flex-1 bg-[#1A1A2E] text-white px-4 py-2 rounded-l focus:outline-none"
                />
                <button
                  onClick={handleCreatePlaylist}
                  className="bg-[#6C5CE7] text-white px-4 py-2 rounded-r hover:bg-[#5D4ECB] transition"
                >
                  Create
                </button>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    className="bg-[#2D2D44] p-4 rounded-lg hover:bg-[#3D3D5A] transition cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => viewPlaylist(playlist.id)}
                  >
                    <div className="relative mb-3">
                      <img 
                        src={playlist.imageUrl || 'https://imgjam.com/jam/artists/default.png'} 
                        alt={playlist.name} 
                        className="w-full aspect-square object-cover rounded-md shadow-lg"
                      />
                    </div>
                    <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                    <p className="text-[#B2B2B2] text-sm">{playlist.tracks?.length || 0} songs</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#2D2D44] rounded-lg p-8 text-center">
                <FiMusic className="mx-auto text-[#6C5CE7]" size={48} />
                <h2 className="text-white text-2xl font-bold my-4">Create your first playlist</h2>
                <p className="text-[#B2B2B2] mb-6">It's easy, we'll help you</p>
                <button 
                  className="bg-[#6C5CE7] text-white font-bold px-6 py-2 rounded-full hover:bg-[#5D4ECB] transition"
                  onClick={() => setShowCreateForm(true)}
                >
                  Create playlist
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {showAddSongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-[#2D2D44] rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">
                Add Songs to {selectedPlaylist?.name}
              </h3>
              <button 
                onClick={() => setShowAddSongModal(false)}
                className="text-[#B2B2B2] hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="relative mb-4">
              <div className="flex items-center bg-[#1A1A2E] rounded px-4 py-2">
                <FiSearch className="text-[#B2B2B2] mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs..."
                  className="w-full bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : availableSongs.length > 0 ? (
              <div className="space-y-3">
                {availableSongs.map(song => (
                  <motion.div
                    key={song.id}
                    className="flex items-center p-3 hover:bg-[#3D3D5A] rounded cursor-pointer"
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
                      <p className="text-[#B2B2B2] text-sm truncate">{song.artist}</p>
                    </div>
                    <span className="text-[#B2B2B2] text-sm whitespace-nowrap ml-2">
                      {song.duration}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#B2B2B2]">
                  {searchQuery.trim() ? 'No results found' : 'Search for songs to add'}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Powered by Jamendo's free music API
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Library;