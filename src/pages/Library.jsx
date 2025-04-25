import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiMusic, 
  FiArrowLeft, 
  FiSearch, 
  FiX, 
  FiTrash2, 
  FiMoreHorizontal,
  FiHeart,
  FiRadio,
  FiUser,
  FiDisc,
  FiLink,
  FiShare2
} from 'react-icons/fi';
import { FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';

const JAMENDO_API_KEY = 'c3e329e0';

const Library = () => {
  const { 
    playlists = [], 
    viewingPlaylist, 
    viewPlaylist, 
    backToLibrary,
    createPlaylist,
    addToPlaylist,
    deletePlaylist = (id) => console.log("Deleting playlist:", id), // Default implementation
    allSongs = [],
    currentTrack,
    isPlaying,
    playTrack,
    addToQueue,
    removeFromPlaylist,
    toggleLikeSong = () => {},
    isSongLiked = () => false,
    removeFromLikedSongs = () => {},
    viewArtist,
    viewAlbum
  } = usePlayer();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistImage, setNewPlaylistImage] = useState('');
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSongMenu, setShowSongMenu] = useState(null);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const menuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowSongMenu(null);
        setShowPlaylistSelection(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ensure "Liked Music" playlist exists on first render
  useEffect(() => {
    const initializeLikedMusic = async () => {
      const hasLikedMusic = playlists.some(p => p.name === "Liked Music");
      if (!hasLikedMusic) {
        await createPlaylist("Liked Music", "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png");
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
      createPlaylist(newPlaylistName, newPlaylistImage);
      setNewPlaylistName('');
      setNewPlaylistImage('');
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
      viewingPlaylist.tracks.slice(startIndex + 1).forEach(track => {
        addToQueue(track);
      });
    }
  };

  const handlePlayTrack = (track, index) => {
    playTrack(track);
    viewingPlaylist.tracks.slice(index + 1).forEach(t => {
      addToQueue(t);
    });
  };

  const handleRemoveFromPlaylist = (trackId, e) => {
    e?.stopPropagation();
    if (viewingPlaylist?.id) {
      removeFromPlaylist(viewingPlaylist.id, trackId);
    }
    setShowSongMenu(null);
  };

  const handleAddToQueue = (track, e) => {
    e?.stopPropagation();
    addToQueue(track);
    setShowSongMenu(null);
  };

  const toggleSongMenu = (trackId, e) => {
    e.stopPropagation();
    const track = viewingPlaylist.tracks.find(t => t.id === trackId);
    setSelectedTrack(track);
    setShowSongMenu(showSongMenu === trackId ? null : trackId);
    setShowPlaylistSelection(false);
    setShowDeleteConfirm(false);
  };

  const toggleAddToPlaylistMenu = (e) => {
    e.stopPropagation();
    setShowPlaylistSelection(true);
    setShowSongMenu(null);
    setShowDeleteConfirm(false);
  };

  const handleDeletePlaylist = (playlistId, e) => {
    e?.stopPropagation();
    setPlaylistToDelete(playlistId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePlaylist = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete);
      setShowDeleteConfirm(false);
      setPlaylistToDelete(null);
      if (viewingPlaylist?.id === playlistToDelete) {
        backToLibrary();
      }
    }
  };

  const getDominantColor = (imageUrl) => {
    const colors = [
      'bg-gradient-to-br from-purple-900 to-blue-800',
      'bg-gradient-to-br from-pink-900 to-purple-800',
      'bg-gradient-to-br from-green-900 to-teal-800',
      'bg-gradient-to-br from-red-900 to-orange-800',
      'bg-gradient-to-br from-yellow-900 to-amber-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const availableSongs = showAddSongModal && searchQuery.trim() ? 
    searchResults : 
    allSongs.filter(song => {
      if (!viewingPlaylist?.tracks) return true;
      return !viewingPlaylist.tracks.some(track => track.id === song.id);
    });

  return (
    <motion.div 
      className="flex-1 overflow-y-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {viewingPlaylist ? (
        <div>
          {/* Back Button */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
            <button 
              onClick={backToLibrary}
              className="flex items-center text-white/70 hover:text-white transition"
            >
              <FiArrowLeft className="mr-2" />
              Back to Library
            </button>
          </div>

          {/* Hero Section */}
          <div className={`relative h-64 w-full ${viewingPlaylist.imageUrl ? '' : getDominantColor(viewingPlaylist.imageUrl)}`}>
            {viewingPlaylist.imageUrl && (
              <img 
                src={viewingPlaylist.imageUrl} 
                alt={viewingPlaylist.name}
                className="w-full h-full object-cover absolute inset-0"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
              <div>
                <p className="text-sm uppercase tracking-wider text-white/80">Playlist</p>
                <h1 className="text-5xl font-bold text-white mt-2 mb-4">{viewingPlaylist.name}</h1>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handlePlayPlaylist(0)}
                    className="bg-[#1db954] hover:bg-[#1ed760] text-white px-6 py-3 rounded-full transition flex items-center font-medium"
                  >
                    Play
                  </button>
                  {viewingPlaylist.name === "Liked Music" ? (
                    <button className="p-3 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white transition">
                      <FaHeart className="text-[#1db954]" />
                    </button>
                  ) : (
                    <button className="p-3 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white transition">
                      <FiPlus />
                    </button>
                  )}
                  {viewingPlaylist.name !== "Liked Music" && (
                    <button 
                      onClick={(e) => handleDeletePlaylist(viewingPlaylist.id, e)}
                      className="p-3 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white transition"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleAddToPlaylist(viewingPlaylist)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition flex items-center"
                >
                  <FiPlus className="mr-2" />
                  Add Songs
                </button>
              </div>
            </div>
            
            {viewingPlaylist.tracks?.length > 0 ? (
              <div className="bg-[#121212]/50 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[50px_1fr_1fr_100px_50px] items-center px-4 py-3 border-b border-white/10 text-white/60 text-sm">
                  <div>#</div>
                  <div>TITLE</div>
                  <div>ARTIST</div>
                  <div>DURATION</div>
                  <div></div>
                </div>
                
                {/* Track Items */}
                {viewingPlaylist.tracks.map((track, index) => (
                  <div 
                    key={`${track.id}-${index}`}
                    className={`grid grid-cols-[50px_1fr_1fr_100px_50px] items-center px-4 py-3 hover:bg-white/5 transition group ${currentTrack?.id === track.id ? 'bg-white/10' : ''}`}
                    onClick={() => handlePlayTrack(track, index)}
                  >
                    <div className="text-white/60 group-hover:text-white">
                      {currentTrack?.id === track.id ? (
                        <div className="text-[#1db954]">
                          {isPlaying ? (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-full h-full bg-[#1db954] animate-pulse"></div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-full h-full bg-[#1db954]"></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex items-center">
                      <img 
                        src={track.imageUrl} 
                        alt={track.title} 
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                      <div>
                        <h3 className={`font-medium ${currentTrack?.id === track.id ? 'text-[#1db954]' : 'text-white'}`}>
                          {track.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-white/70 group-hover:text-white">
                      {track.artist}
                    </div>
                    <div className="text-white/60 group-hover:text-white">
                      {track.duration}
                    </div>
                    <div className="flex justify-end relative" ref={menuRef}>
                      <button 
                        onClick={(e) => toggleSongMenu(track.id, e)}
                        className="text-white/30 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiMoreHorizontal size={16} />
                      </button>

                      {/* Song Options Menu */}
                      <AnimatePresence>
                        {showSongMenu === track.id && (
                          <motion.div 
                            className="absolute right-0 top-10 z-50 bg-[#282828] shadow-lg rounded-md w-56 overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-1">
                              <div className="px-3 py-2 text-xs text-[#b3b3b3] border-b border-[#3e3e3e]">
                                {track.title}
                              </div>
                              
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => handleAddToQueue(track, e)}
                              >
                                <FiPlus className="mr-3" /> Add to queue
                              </button>
                              
                              <div className="border-t border-[#3e3e3e] my-1"></div>
                              
                              {viewingPlaylist.name !== "Liked Music" && (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isSongLiked(track.id)) {
                                      removeFromLikedSongs(track.id);
                                    } else {
                                      toggleLikeSong(track);
                                    }
                                    setShowSongMenu(null);
                                  }}
                                >
                                  {isSongLiked(track.id) ? (
                                    <>
                                      <FaHeart className="text-[#1db954] mr-3" /> Remove from Liked Songs
                                    </>
                                  ) : (
                                    <>
                                      <FiHeart className="mr-3" /> Add to Liked Songs
                                    </>
                                  )}
                                </button>
                              )}

                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => toggleAddToPlaylistMenu(e)}
                              >
                                <FiPlus className="mr-3" /> Add to playlist
                              </button>

                              {viewingPlaylist.name !== "Liked Music" && (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                  onClick={(e) => handleRemoveFromPlaylist(track.id, e)}
                                >
                                  <FiTrash2 className="mr-3" /> Remove from this playlist
                                </button>
                              )}
                              
                              <div className="border-t border-[#3e3e3e] my-1"></div>
                              
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Implement song radio functionality
                                  setShowSongMenu(null);
                                }}
                              >
                                <FiRadio className="mr-3" /> Go to song radio
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewArtist(track.artist);
                                  setShowSongMenu(null);
                                }}
                              >
                                <FiUser className="mr-3" /> Go to artist
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewAlbum(track.album || track.title);
                                  setShowSongMenu(null);
                                }}
                              >
                                <FiDisc className="mr-3" /> Go to album
                              </button>
                              
                              <div className="border-t border-[#3e3e3e] my-1"></div>
                              
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Implement view credits functionality
                                  setShowSongMenu(null);
                                }}
                              >
                                <FiLink className="mr-3" /> View credits
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3e3e3e] flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Implement share functionality
                                  setShowSongMenu(null);
                                }}
                              >
                                <FiShare2 className="mr-3" /> Share
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
        </div>
      ) : (
        <>
          <div className="p-6">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {playlists.map((playlist) => (
                    <motion.div
                      key={playlist.id}
                      className="group relative bg-[#181818] hover:bg-[#282828] transition rounded-lg p-4 cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      onClick={() => viewPlaylist(playlist.id)}
                    >
                      <div className="relative mb-4">
                        {playlist.imageUrl ? (
                          <img 
                            src={playlist.imageUrl} 
                            alt={playlist.name} 
                            className="aspect-square w-full object-cover rounded"
                          />
                        ) : (
                          <div className="aspect-square bg-gradient-to-br from-[#450af5] to-[#8e8ee5] rounded flex items-center justify-center">
                            <FiMusic className="text-white opacity-80 group-hover:opacity-100 transition" size={48} />
                          </div>
                        )}
                        <button 
                          className="absolute bottom-2 right-2 bg-[#1db954] rounded-full p-3 opacity-0 group-hover:opacity-100 transition hover:scale-105 shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPlaylist(playlist.id);
                            handlePlayPlaylist(0);
                          }}
                        >
                          <FaPlay className="text-white" size={16} />
                        </button>
                        {playlist.name === "Liked Music" && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2">
                            <FaHeart className="text-[#1db954]" size={16} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                      <p className="text-[#b3b3b3] text-sm mt-1">
                        {playlist.tracks?.length || 0} {playlist.tracks?.length === 1 ? 'song' : 'songs'}
                      </p>
                      {playlist.name !== "Liked Music" && (
                        <button 
                          className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlaylist(playlist.id, e);
                          }}
                        >
                          <FiTrash2 className="text-white" size={16} />
                        </button>
                      )}
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
          </div>
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
                    setNewPlaylistImage('');
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

              <div className="mb-6">
                <label className="block text-[#b3b3b3] text-sm mb-2">Playlist image URL (optional)</label>
                <input
                  type="text"
                  value={newPlaylistImage}
                  onChange={(e) => setNewPlaylistImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#121212] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistName('');
                    setNewPlaylistImage('');
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

      {/* Playlist Selection Modal */}
      <AnimatePresence>
        {showPlaylistSelection && selectedTrack && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlaylistSelection(false)}
          >
            <motion.div 
              className="bg-[#282828] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              ref={menuRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-bold">Add to playlist</h3>
                <button 
                  onClick={() => setShowPlaylistSelection(false)}
                  className="text-[#b3b3b3] hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center bg-[#121212] rounded-lg px-4 py-3 mb-2">
                  <FiSearch className="text-[#b3b3b3] mr-2" />
                  <input
                    type="text"
                    placeholder="Find a playlist"
                    className="w-full bg-transparent text-white focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <button 
                  className="w-full text-left px-4 py-3 text-white hover:bg-[#3e3e3e] rounded-lg flex items-center"
                  onClick={() => {
                    setShowPlaylistSelection(false);
                    setShowCreateModal(true);
                  }}
                >
                  <div className="w-10 h-10 bg-[#535353] rounded-full flex items-center justify-center mr-3">
                    <FiPlus className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">New playlist</h4>
                  </div>
                </button>
                
                {playlists
                  .filter(p => p.id !== viewingPlaylist?.id)
                  .map(playlist => (
                    <button
                      key={playlist.id}
                      className="w-full text-left px-4 py-3 text-white hover:bg-[#3e3e3e] rounded-lg flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(playlist.id, selectedTrack);
                        setShowPlaylistSelection(false);
                      }}
                    >
                      <img 
                        src={playlist.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={playlist.name}
                        className="w-10 h-10 rounded mr-3 object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{playlist.name}</h4>
                        <p className="text-[#b3b3b3] text-sm">
                          {playlist.tracks?.length || 0} songs
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              ref={menuRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-bold">Delete playlist</h3>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-[#b3b3b3] hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <p className="text-white mb-6">Are you sure you want to delete this playlist? This action cannot be undone.</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 text-white bg-transparent hover:bg-[#383838] rounded-full transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePlaylist}
                  className="px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Library;