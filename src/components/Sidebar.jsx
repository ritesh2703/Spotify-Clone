import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMusic, FaTrash, FaPlay } from 'react-icons/fa';
import { MdOutlinePodcasts, MdChevronRight, MdChevronLeft } from 'react-icons/md';
import { usePlayer } from '../context/PlayerContext';

const Sidebar = ({ setActivePage, onLogout, username }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { playlists, deletePlaylist, createPlaylist, playTrack, addToQueue, viewPlaylist } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeLikedMusic = async () => {
      const hasLikedMusic = playlists.some(p => p.name === "Liked Music");
      if (!hasLikedMusic) {
        await createPlaylist("Liked Music");
      }
    };
    initializeLikedMusic();
  }, [playlists, createPlaylist]);

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name !== "Liked Music" || 
    (playlist.name === "Liked Music" && playlist.tracks?.length > 0)
  );

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleCreatePlaylist = () => {
    setActivePage('library');
    navigate('/library');
  };

  const handleBrowsePodcasts = () => {
    setActivePage('browse');
    navigate('/browse');
  };

  const handleViewPlaylist = (playlistId) => {
    setActivePage('library');
    viewPlaylist(playlistId);
    navigate(`/library?playlist=${playlistId}`);
  };

  const handlePlayPlaylist = (playlistId, e) => {
    e.stopPropagation();
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist?.tracks?.length) {
      playTrack(playlist.tracks[0]);
      playlist.tracks.slice(1).forEach(track => {
        addToQueue(track);
      });
    }
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    try {
      await deletePlaylist(playlistId);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  if (isCollapsed) {
    return (
      <div className="hidden md:flex flex-col items-center h-full p-4 bg-[#040306] border-r border-gray-800">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 mb-6"
        >
          <MdChevronRight size={24} />
        </button>
        
        <button 
          onClick={handleCreatePlaylist}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 mb-4"
          title="Create playlist"
        >
          <FaPlus size={20} />
        </button>
        
        <button 
          onClick={handleBrowsePodcasts}
          className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
          title="Browse podcasts"
        >
          <MdOutlinePodcasts size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-[#040306] border-r border-gray-800">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Your Library</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleCreatePlaylist}
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
              title="Create playlist"
            >
              <FaPlus size={18} />
            </button>
            <button 
              onClick={toggleSidebar}
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
            >
              <MdChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredPlaylists.length === 0 ? (
          <div className="px-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-4 mb-6">
              <h3 className="text-white font-medium mb-1">Create your first playlist</h3>
              <p className="text-gray-400 text-sm mb-4">It's easy, we'll help you</p>
              <button 
                className="bg-white text-black text-sm font-bold rounded-full px-4 py-2 flex items-center hover:scale-105 transition"
                onClick={handleCreatePlaylist}
              >
                <FaPlus className="mr-2" />
                <span>Create playlist</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPlaylists.map(playlist => (
              <button
                key={playlist.id}
                onClick={() => handleViewPlaylist(playlist.id)}
                className="w-full flex items-center p-2 text-gray-300 hover:text-white hover:bg-[#1E1E1E] rounded transition group"
              >
                <div className="bg-[#282828] p-2 rounded mr-3">
                  <FaMusic className="text-gray-400" size={14} />
                </div>
                <div className="text-left truncate flex-1">
                  <p className="truncate text-sm">{playlist.name}</p>
                  <p className="text-xs text-gray-400 truncate">Playlist • {playlist.tracks?.length || 0} songs</p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={(e) => handlePlayPlaylist(playlist.id, e)}
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition p-1 mr-1"
                    title="Play playlist"
                  >
                    <FaPlay size={12} />
                  </button>
                  {playlist.name !== "Liked Music" && (
                    <button 
                      onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                      title="Delete playlist"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {username && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <span className="truncate">Logged in as {username}</span>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white text-sm whitespace-nowrap ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;