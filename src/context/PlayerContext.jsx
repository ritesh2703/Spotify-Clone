import { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [viewingPlaylist, setViewingPlaylist] = useState(null);
  const [allSongs] = useState([]); 

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      imageUrl: 'https://misc.scdn.co/liked-songs/liked-songs-64.png'
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, track) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId && !playlist.tracks.some(t => t.id === track.id)) {
        return { ...playlist, tracks: [...playlist.tracks, track] };
      }
      return playlist;
    }));
  };

  const viewPlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId) || 
                    featuredPlaylists.find(p => p.id === playlistId);
    setViewingPlaylist(playlist);
  };

  const backToLibrary = () => {
    setViewingPlaylist(null);
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      volume, 
      progress,
      playlists,
      viewingPlaylist,
      allSongs,
      playTrack, 
      togglePlay,
      setVolume,
      createPlaylist,
      addToPlaylist,
      viewPlaylist,
      backToLibrary
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);