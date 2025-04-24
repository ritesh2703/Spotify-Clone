import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';
import PodcastCard from '../components/PodcastCard';
import MoodCard from '../components/MoodCard';
import SectionHeader from '../components/SectionHeader';
import { useLocation, useNavigate } from 'react-router-dom';

const JAMENDO_API_KEY = 'c3e329e0';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';

const dummyPodcasts = [
  {
    id: 'p1',
    title: "Tech Talk Today",
    artist: "Digital Insights",
    imageUrl: "https://source.unsplash.com/random/300x300/?podcast,tech",
    duration: "45 min",
    audioUrl: "https://example.com/podcast1.mp3",
    isPodcast: true
  },
  {
    id: 'p2',
    title: "Science Weekly",
    artist: "Discovery Channel",
    imageUrl: "https://source.unsplash.com/random/300x300/?podcast,science",
    duration: "32 min",
    audioUrl: "https://example.com/podcast2.mp3",
    isPodcast: true
  },
  {
    id: 'p3',
    title: "Business Insights",
    artist: "Finance Network",
    imageUrl: "https://source.unsplash.com/random/300x300/?podcast,business",
    duration: "28 min",
    audioUrl: "https://example.com/podcast3.mp3",
    isPodcast: true
  },
  {
    id: 'p4',
    title: "Health Matters",
    artist: "Wellness Radio",
    imageUrl: "https://source.unsplash.com/random/300x300/?podcast,health",
    duration: "50 min",
    audioUrl: "https://example.com/podcast4.mp3",
    isPodcast: true
  }
];

const moodCategories = [
  { id: 'm1', name: 'Chill', color: 'from-blue-500 to-blue-700', image: 'https://source.unsplash.com/random/300x300/?chill' },
  { id: 'm2', name: 'Workout', color: 'from-red-500 to-red-700', image: 'https://source.unsplash.com/random/300x300/?workout' },
  { id: 'm3', name: 'Focus', color: 'from-green-500 to-green-700', image: 'https://source.unsplash.com/random/300x300/?focus' },
  { id: 'm4', name: 'Party', color: 'from-purple-500 to-purple-700', image: 'https://source.unsplash.com/random/300x300/?party' },
  { id: 'm5', name: 'Sleep', color: 'from-indigo-500 to-indigo-700', image: 'https://source.unsplash.com/random/300x300/?sleep' },
];

const Home = () => {
  const [data, setData] = useState({
    getStarted: [],
    bollywoodHits: [],
    biggestHits: [],
    recommended: [],
    recentlyPlayed: [],
    popularArtists: [],
    podcasts: dummyPodcasts,
    artistDetails: null,
    artistTracks: [],
    searchResults: null,
    playlistDetails: null,
    playlistTracks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [likedSongs, setLikedSongs] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const { playTrack, playPlaylist } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedSongs');
    if (savedLikes) {
      setLikedSongs(JSON.parse(savedLikes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchInitialData();
    }
  }, [location.search]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const [
        getStartedRes,
        bollywoodRes,
        biggestHitsRes,
        recommendedRes,
        recentRes,
        artistsRes
      ] = await Promise.all([
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=6&order=popularity_total`),
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=6&tags=bollywood`),
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=6&order=popularity_month`),
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=6&order=weight`),
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=8&order=releasedate_desc`),
        fetch(`${JAMENDO_API_URL}/artists/?client_id=${JAMENDO_API_KEY}&format=json&limit=6&order=popularity_total`)
      ]);

      const getStarted = await getStartedRes.json();
      const bollywood = await bollywoodRes.json();
      const biggestHits = await biggestHitsRes.json();
      const recommended = await recommendedRes.json();
      const recent = await recentRes.json();
      const artists = await artistsRes.json();

      setData({
        getStarted: formatTracks(getStarted.results),
        bollywoodHits: formatTracks(bollywood.results),
        biggestHits: formatTracks(biggestHits.results),
        recommended: formatTracks(recommended.results),
        recentlyPlayed: formatTracks(recent.results),
        popularArtists: formatArtists(artists.results),
        podcasts: dummyPodcasts,
        artistDetails: null,
        artistTracks: [],
        searchResults: null,
        playlistDetails: null,
        playlistTracks: []
      });
    } catch (err) {
      console.error('API Error:', err);
      setError('Could not connect to music service. Using sample data.');
      setData({
        ...generateMockData(),
        searchResults: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setData(prev => ({ ...prev, searchResults: null }));
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      const [tracksRes, artistsRes] = await Promise.all([
        fetch(`${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=20&search=${encodeURIComponent(query)}`),
        fetch(`${JAMENDO_API_URL}/artists/?client_id=${JAMENDO_API_KEY}&format=json&limit=5&name=${encodeURIComponent(query)}`)
      ]);

      const tracksData = await tracksRes.json();
      const artistsData = await artistsRes.json();

      setData(prev => ({
        ...prev,
        searchResults: {
          query,
          tracks: formatTracks(tracksData.results || []),
          artists: formatArtists(artistsData.results || [])
        },
        artistDetails: null,
        artistTracks: [],
        playlistDetails: null,
        playlistTracks: []
      }));
    } catch (err) {
      console.error('Search Error:', err);
      setData(prev => ({
        ...prev,
        searchResults: {
          query,
          tracks: Array(5).fill().map((_, i) => ({
            id: `search-track-${i}`,
            title: `${query} Track ${i+1}`,
            artist: `Artist ${i+1}`,
            album: `Album ${i+1}`,
            imageUrl: 'https://via.placeholder.com/300',
            duration: '3:30',
            audioUrl: `https://example.com/${query}-track${i}.mp3`,
            isPodcast: false
          })),
          artists: Array(3).fill().map((_, i) => ({
            id: `search-artist-${i}`,
            name: `${query} Artist ${i+1}`,
            imageUrl: 'https://via.placeholder.com/300',
            stats: {
              fans: Math.floor(Math.random() * 1000000),
              albums: Math.floor(Math.random() * 10) + 1
            }
          }))
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (track) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(t => t.id === track.id);
      if (isLiked) {
        return prev.filter(t => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const isTrackLiked = (trackId) => {
    return likedSongs.some(track => track.id === trackId);
  };

  const handlePlaylistClick = (playlist) => {
    setData(prev => ({
      ...prev,
      playlistDetails: playlist,
      playlistTracks: playlist.tracks,
      viewMode: 'list'
    }));
  };

  const handleArtistClick = async (artist) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${JAMENDO_API_URL}/artists/tracks/?client_id=${JAMENDO_API_KEY}&format=json&id=${artist.id}`
      );
      const data = await response.json();
      
      setData(prev => ({
        ...prev,
        artistDetails: artist,
        artistTracks: formatTracks(data.results || []).slice(0, 10),
        searchResults: null,
        playlistDetails: null,
        playlistTracks: []
      }));
    } catch (err) {
      console.error('Error fetching artist tracks:', err);
      setData(prev => ({
        ...prev,
        artistDetails: artist,
        artistTracks: Array(10).fill().map((_, i) => ({
          id: `artist-${artist.id}-track-${i}`,
          title: `${artist.name} - Track ${i+1}`,
          artist: artist.name,
          album: `Album ${i+1}`,
          imageUrl: artist.imageUrl,
          duration: '3:45',
          audioUrl: `https://example.com/${artist.id}-track${i}.mp3`,
          isPodcast: false
        }))
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setData(prev => ({
      ...prev,
      artistDetails: null,
      artistTracks: [],
      playlistDetails: null,
      playlistTracks: [],
      viewMode: 'grid'
    }));
  };

  const formatTracks = (tracks) => {
    return tracks?.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name || 'Single',
      imageUrl: track.image || 'https://via.placeholder.com/300',
      duration: formatDuration(track.duration),
      audioUrl: track.audio,
      isPodcast: false
    })) || [];
  };

  const formatArtists = (artists) => {
    return artists?.map(artist => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.image || 'https://via.placeholder.com/300',
      stats: {
        fans: artist.fans,
        albums: artist.albums
      }
    })) || [];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const generateMockData = () => {
    const mockTrack = (i) => ({
      id: `mock-${i}`,
      title: `Track ${i}`,
      artist: `Artist ${i}`,
      album: `Album ${i}`,
      imageUrl: 'https://via.placeholder.com/300',
      duration: '3:30',
      audioUrl: `https://example.com/track${i}.mp3`,
      isPodcast: false
    });

    return {
      getStarted: Array(6).fill().map((_, i) => mockTrack(i+1)),
      bollywoodHits: Array(6).fill().map((_, i) => mockTrack(i+10)),
      biggestHits: Array(6).fill().map((_, i) => mockTrack(i+20)),
      recommended: Array(6).fill().map((_, i) => mockTrack(i+30)),
      recentlyPlayed: Array(8).fill().map((_, i) => mockTrack(i+40)),
      popularArtists: Array(6).fill().map((_, i) => ({
        id: `artist-${i}`,
        name: `Artist ${i}`,
        imageUrl: 'https://via.placeholder.com/300',
        stats: {
          fans: Math.floor(Math.random() * 1000000),
          albums: Math.floor(Math.random() * 10) + 1
        }
      })),
      podcasts: dummyPodcasts,
      artistDetails: null,
      artistTracks: []
    };
  };

  const renderTrackList = (tracks, showLikeButton = true, showAlbum = false) => {
    return (
      <TrackList 
        tracks={tracks} 
        onTrackClick={playTrack}
        onPlayAll={() => playPlaylist(tracks)}
        onLikeTrack={showLikeButton ? toggleLike : undefined}
        isTrackLiked={showLikeButton ? isTrackLiked : undefined}
        showAlbum={showAlbum}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    );
  };

  const renderGridTracks = (tracks) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            variants={itemVariants}
            custom={index}
            whileHover="hover"
          >
            <PlaylistCard 
              playlist={{
                id: track.id,
                name: track.title,
                description: track.artist,
                imageUrl: track.imageUrl,
                tracks: [track]
              }} 
              onClick={() => playTrack(track)}
              onPlaylistClick={() => handlePlaylistClick({
                id: track.id,
                name: track.title,
                description: track.artist,
                imageUrl: track.imageUrl,
                tracks: [track]
              })}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const shouldShowSection = (section) => {
    if (filter === 'all') return true;
    if (filter === 'music' && section !== 'podcasts') return true;
    if (filter === 'podcasts' && section === 'podcasts') return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 pb-32 flex items-center justify-center bg-gradient-to-b from-[#121212] to-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading your music...</p>
        </div>
      </div>
    );
  }

  if (data.artistDetails) {
    return (
      <motion.div 
        className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] to-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <button 
          onClick={handleBackToHome}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Browse
        </button>
        
        <motion.div className="flex flex-col md:flex-row items-start md:items-end mb-8 gap-6" variants={itemVariants}>
          <motion.div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-xl"
            whileHover={{ rotate: 2, scale: 1.02 }}
          >
            <img 
              src={data.artistDetails.imageUrl} 
              alt={data.artistDetails.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="flex-1">
            <motion.h2 className="text-white text-4xl font-bold mb-2" variants={itemVariants}>
              {data.artistDetails.name}
            </motion.h2>
            
            <motion.div className="flex gap-6 mb-4" variants={itemVariants}>
              <div>
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-white font-bold">
                  {data.artistDetails.stats?.fans?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Albums</p>
                <p className="text-white font-bold">
                  {data.artistDetails.stats?.albums || 'N/A'}
                </p>
              </div>
            </motion.div>
            
            <motion.button
              onClick={() => playPlaylist(data.artistTracks)}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-2 rounded-full font-medium flex items-center transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play All
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {renderTrackList(data.artistTracks, true, true)}
        </motion.div>
      </motion.div>
    );
  }

  if (data.playlistDetails) {
    return (
      <motion.div 
        className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] to-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <button 
          onClick={handleBackToHome}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Browse
        </button>
        
        <motion.div className="flex flex-col md:flex-row items-start md:items-end mb-8 gap-6" variants={itemVariants}>
          <motion.div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-md overflow-hidden shadow-xl"
            whileHover={{ rotate: 1, scale: 1.02 }}
          >
            <img 
              src={data.playlistDetails.imageUrl} 
              alt={data.playlistDetails.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="flex-1">
            <motion.h2 className="text-white text-4xl font-bold mb-2" variants={itemVariants}>
              {data.playlistDetails.name}
            </motion.h2>
            
            <motion.p className="text-gray-400 mb-4" variants={itemVariants}>
              {data.playlistDetails.description}
            </motion.p>
            
            <motion.div className="flex gap-4" variants={itemVariants}>
              <motion.button
                onClick={() => playPlaylist(data.playlistTracks)}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-2 rounded-full font-medium flex items-center transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play All
              </motion.button>
              
              <motion.button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="bg-[#282828] hover:bg-[#383838] text-white px-4 py-2 rounded-full font-medium flex items-center transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  {viewMode === 'grid' ? (
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  ) : (
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
                  )}
                </svg>
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {viewMode === 'list' ? (
          <motion.div variants={itemVariants}>
            {renderTrackList(data.playlistTracks, true, true)}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            {renderGridTracks(data.playlistTracks)}
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (data.searchResults) {
    return (
      <motion.div 
        className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] to-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">
            Search results for "{data.searchResults.query}"
          </h2>
          
          {data.searchResults.artists.length > 0 && (
            <div className="mb-10">
              <SectionHeader title="Artists" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {data.searchResults.artists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover="hover"
                    onClick={() => handleArtistClick(artist)}
                  >
                    <ArtistCard artist={artist} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {data.searchResults.tracks.length > 0 && (
            <div className="mb-10">
              <SectionHeader title="Tracks" />
              {renderTrackList(data.searchResults.tracks)}
            </div>
          )}
          
          {data.searchResults.artists.length === 0 && data.searchResults.tracks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">No results found for "{data.searchResults.query}"</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex-1 p-6 pb-32 overflow-y-auto bg-gradient-to-b from-[#121212] to-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {error && (
        <motion.div 
          className="bg-yellow-900/20 border border-yellow-700 text-yellow-300 p-4 rounded-lg mb-6 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}

      <motion.div 
        className="flex gap-3 mb-8 p-1 bg-[#282828] rounded-full max-w-max"
        variants={itemVariants}
      >
        {['all', 'music', 'podcasts'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f 
                ? 'bg-white text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {likedSongs.length > 0 && shouldShowSection('liked') && (
        <section className="mb-10">
          <SectionHeader title="Your Liked Songs" viewAllLink="#" />
          {renderTrackList(likedSongs)}
        </section>
      )}

      {shouldShowSection('getStarted') && (
        <section className="mb-10">
          <SectionHeader title="Get Started" viewAllLink="#" />
          {renderGridTracks(data.getStarted)}
        </section>
      )}

      {shouldShowSection('bollywood') && (
        <section className="mb-10">
          <SectionHeader title="Bollywood Center" viewAllLink="#" />
          {renderTrackList(data.bollywoodHits)}
        </section>
      )}

      {shouldShowSection('hits') && (
        <section className="mb-10">
          <SectionHeader title="Today's Biggest Hits" viewAllLink="#" />
          {renderGridTracks(data.biggestHits)}
        </section>
      )}

      {shouldShowSection('recommended') && (
        <section className="mb-10">
          <SectionHeader title="Recommended For You" viewAllLink="#" />
          {renderTrackList(data.recommended)}
        </section>
      )}

      {shouldShowSection('recent') && (
        <section className="mb-10">
          <SectionHeader title="Recently Played" viewAllLink="#" />
          {renderTrackList(data.recentlyPlayed)}
        </section>
      )}

      {shouldShowSection('mood') && (
        <section className="mb-10">
          <SectionHeader title="Mood" viewAllLink="#" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {moodCategories.map((mood, index) => (
              <motion.div
                key={mood.id}
                variants={itemVariants}
                custom={index}
                whileHover="hover"
              >
                <MoodCard 
                  mood={mood} 
                  onClick={() => playPlaylist(data.recommended)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {shouldShowSection('podcasts') && (
        <section className="mb-10">
          <SectionHeader title="Featured Podcasts" viewAllLink="#" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.podcasts.map((podcast, index) => (
              <motion.div
                key={podcast.id}
                variants={itemVariants}
                custom={index}
                whileHover="hover"
              >
                <PodcastCard 
                  podcast={podcast} 
                  onPlay={() => playTrack(podcast)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {shouldShowSection('artists') && (
        <section className="mb-24">
          <SectionHeader title="Popular Artists" viewAllLink="#" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {data.popularArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                onClick={() => handleArtistClick(artist)}
              >
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Home;