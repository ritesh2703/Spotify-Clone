import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const JAMENDO_API_KEY = 'c3e329e0';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

// Audio player component
const AudioPlayer = ({ currentTrack, isPlaying, onPlayPause }) => {
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-gray-800 p-4 z-10">
      <div className="container mx-auto flex items-center">
        <div className="flex items-center w-1/4">
          <img 
            src={currentTrack.image || 'https://via.placeholder.com/300'} 
            alt={currentTrack.name} 
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div>
            <h4 className="text-white font-medium truncate">{currentTrack.name}</h4>
            <p className="text-gray-400 text-sm">{currentTrack.artist_name || currentTrack.artist}</p>
          </div>
        </div>
        
        <div className="w-2/4 flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>
            
            <button 
              onClick={onPlayPause}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </button>
          </div>
          
          <div className="w-full flex items-center mt-2 space-x-2">
            <span className="text-xs text-gray-400">0:00</span>
            <div className="h-1 bg-gray-600 rounded-full flex-grow">
              <div className="h-1 bg-[#1DB954] rounded-full w-1/3"></div>
            </div>
            <span className="text-xs text-gray-400">
              {currentTrack.duration ? `${Math.floor(currentTrack.duration / 60)}:${String(currentTrack.duration % 60).padStart(2, '0')}` : '0:00'}
            </span>
          </div>
        </div>
        
        <div className="w-1/4 flex justify-end items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const TrackCard = ({ track, onPlay, isCurrentTrack, isPlaying }) => {
  return (
    <motion.div 
      className={`bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors duration-200 cursor-pointer group ${isCurrentTrack ? 'ring-2 ring-[#1DB954]' : ''}`}
      whileHover={{ y: -5 }}
      onClick={() => onPlay(track)}
    >
      <div className="relative">
        <img 
          src={track.image || 'https://via.placeholder.com/300'} 
          alt={track.name} 
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onPlay(track);
          }}
          className={`absolute bottom-6 right-2 ${isCurrentTrack && isPlaying ? 'bg-[#1DB954]' : 'bg-white'} rounded-full p-2 shadow-lg transform ${isCurrentTrack ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'} transition-all duration-200`}
        >
          {isCurrentTrack && isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      <h3 className="text-white font-bold truncate">{track.name}</h3>
      <p className="text-gray-400 text-sm mt-1">{track.artist_name || track.artist}</p>
      <p className="text-gray-500 text-xs mt-2">
        {track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : '0:00'}
      </p>
    </motion.div>
  );
};

const Browse = () => {
  const [activeTab, setActiveTab] = useState('tracks');
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch popular tracks
        const tracksResponse = await fetch(
          `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=jsonpretty&limit=20&order=popularity_total`
        );
        const tracksData = await tracksResponse.json();
        setTracks(tracksData.results);
        
        // Fetch playlists
        const playlistsResponse = await fetch(
          `${JAMENDO_API_URL}/playlists/?client_id=${JAMENDO_API_KEY}&format=jsonpretty&limit=10`
        );
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData.results);
        
        // Fetch podcasts (using tracks API with podcast tag)
        const podcastsResponse = await fetch(
          `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=jsonpretty&limit=10&tags=podcast`
        );
        const podcastsData = await podcastsResponse.json();
        setPodcasts(podcastsData.results);
        
        // Fetch genres
        const genresResponse = await fetch(
          `${JAMENDO_API_URL}/tags/?client_id=${JAMENDO_API_KEY}&format=jsonpretty&limit=20&groupby=tag_name`
        );
        const genresData = await genresResponse.json();
        setGenres(genresData.results.slice(0, 12).map(genre => ({
          id: genre.id,
          name: genre.name,
          image: `https://source.unsplash.com/random/300x300/?music,${genre.name.toLowerCase()}`
        })));
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  useEffect(() => {
    // Clean up audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const handlePlay = (item) => {
    // If the same track is clicked, toggle play/pause
    if (currentTrack && currentTrack.id === item.id) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    // Stop current audio if playing
    if (audio) {
      audio.pause();
    }

    // Create new audio element
    const newAudio = new Audio(item.audio || item.audio_download);
    setAudio(newAudio);
    setCurrentTrack(item);
    
    newAudio.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error('Error playing audio:', err);
        setError('Could not play the selected track');
      });
  };

  const handlePlayPause = () => {
    if (!audio || !currentTrack) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="text-white p-6 pb-24 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white p-6 pb-24">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading content: {error}</p>
          <p className="text-gray-400 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-6 pb-32">
      <h1 className="text-3xl font-bold mb-6">Browse Music & Podcasts</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-2 overflow-x-auto">
        {['tracks', 'playlists', 'podcasts', 'genres'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === tab ? 'text-white border-b-2 border-[#1DB954]' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'tracks' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {tracks.map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onPlay={handlePlay}
                isCurrentTrack={currentTrack?.id === track.id}
                isPlaying={isPlaying && currentTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'playlists' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {playlists.map((playlist) => (
                <motion.div 
                  key={playlist.id}
                  className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors duration-200 cursor-pointer group"
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    // For simplicity, play the first track if available
                    if (playlist.tracks && playlist.tracks.length > 0) {
                      handlePlay(playlist.tracks[0]);
                    }
                  }}
                >
                  <div className="relative">
                    <img 
                      src={playlist.image || 'https://via.placeholder.com/300'} 
                      alt={playlist.name} 
                      className="w-full aspect-square object-cover rounded-md mb-4"
                    />
                    <button 
                      className="absolute bottom-6 right-2 bg-[#1DB954] rounded-full p-2 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-white font-bold truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{playlist.track_count} tracks</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No playlists found</p>
          )}
        </div>
      )}
      
      {activeTab === 'podcasts' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Podcasts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {podcasts.map((podcast) => (
              <TrackCard 
                key={podcast.id} 
                track={podcast} 
                onPlay={handlePlay}
                isCurrentTrack={currentTrack?.id === podcast.id}
                isPlaying={isPlaying && currentTrack?.id === podcast.id}
              />
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'genres' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {genres.map((genre) => (
              <motion.div 
                key={genre.id}
                className="relative rounded-lg overflow-hidden h-40 cursor-pointer group"
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  // For simplicity, fetch and play a random track from this genre
                  fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=jsonpretty&limit=1&tags=${genre.name}&order=popularity_total`)
                    .then(res => res.json())
                    .then(data => {
                      if (data.results && data.results.length > 0) {
                        handlePlay(data.results[0]);
                      }
                    })
                    .catch(err => console.error('Error fetching genre tracks:', err));
                }}
              >
                <img 
                  src={genre.image} 
                  alt={genre.name} 
                  className="w-full h-full object-cover brightness-75"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg">{genre.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Audio Player */}
      <AudioPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause} 
      />
    </div>
  );
};

export default Browse;