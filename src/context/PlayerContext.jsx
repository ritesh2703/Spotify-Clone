import { createContext, useState, useContext, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [viewingPlaylist, setViewingPlaylist] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const handleTrackEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error('Playback error:', error);
        setIsPlaying(false);
      }
    };

    handlePlayback();
  }, [isPlaying, currentTrack]);

  const playTrack = (track) => {
    if (!track?.audioUrl) {
      console.error('No audio URL provided');
      return;
    }

    // If same track, toggle play/pause
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // Set new track
    setCurrentTrack({
      ...track,
      imageUrl: track.imageUrl || 'https://imgjam.com/jam/artists/default.png'
    });
    setProgress(0);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const playNextTrack = () => {
    if (!viewingPlaylist?.tracks?.length) return;
    
    const currentIndex = viewingPlaylist.tracks.findIndex(
      track => track.id === currentTrack?.id
    );
    
    if (currentIndex === -1 || currentIndex === viewingPlaylist.tracks.length - 1) {
      // Play first track if no current track or at end
      playTrack(viewingPlaylist.tracks[0]);
    } else {
      // Play next track
      playTrack(viewingPlaylist.tracks[currentIndex + 1]);
    }
  };

  const playPreviousTrack = () => {
    if (!viewingPlaylist?.tracks?.length) return;
    
    const currentIndex = viewingPlaylist.tracks.findIndex(
      track => track.id === currentTrack?.id
    );
    
    if (currentIndex <= 0) {
      // Play last track if at beginning
      playTrack(viewingPlaylist.tracks[viewingPlaylist.tracks.length - 1]);
    } else {
      // Play previous track
      playTrack(viewingPlaylist.tracks[currentIndex - 1]);
    }
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      imageUrl: 'https://purepng.com/public/uploads/large/purepng.com-music-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596085b6osz.png'
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, track) => {
    setPlaylists(playlists.map(playlist => 
      playlist.id === playlistId && !playlist.tracks.some(t => t.id === track.id)
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));
  };

  const viewPlaylist = (playlistId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    setViewingPlaylist(playlist);
  };

  const backToLibrary = () => {
    setViewingPlaylist(null);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      volume, 
      progress,
      duration,
      playlists,
      viewingPlaylist,
      isMuted,
      audioRef,
      playTrack, 
      togglePlay,
      toggleMute,
      playNextTrack,
      playPreviousTrack,
      setVolume,
      seek,
      formatTime,
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