import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';

const JAMENDO_API_KEY = 'c3e329e0';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    playlists: [],
    tracks: [],
    artists: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults({
          playlists: [],
          tracks: [],
          artists: []
        });
        return;
      }

      setIsLoading(true);
      
      try {
        // Search for tracks
        const tracksResponse = await fetch(
          `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}` +
          `&format=json` +
          `&search=${encodeURIComponent(searchQuery)}` +
          `&limit=20`
        );
        const tracksData = await tracksResponse.json();
        
        // Search for artists
        const artistsResponse = await fetch(
          `https://api.jamendo.com/v3.0/artists/?client_id=${JAMENDO_API_KEY}` +
          `&format=json` +
          `&name=${encodeURIComponent(searchQuery)}` +
          `&limit=5`
        );
        const artistsData = await artistsResponse.json();

        // Format track results
        const formattedTracks = tracksData.results?.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artist_name,
          album: track.album_name || 'Single',
          imageUrl: track.image || 'https://imgjam.com/jam/artists/default.png',
          duration: formatDuration(track.duration),
          audioUrl: track.audio
        })) || [];

        // Format artist results
        const formattedArtists = artistsData.results?.map(artist => ({
          id: artist.id,
          name: artist.name,
          imageUrl: artist.image || 'https://imgjam.com/jam/artists/default.png',
          followers: artist.fans_count || 0
        })) || [];

        setSearchResults({
          playlists: [], // Jamendo doesn't provide playlist search in free tier
          tracks: formattedTracks,
          artists: formattedArtists
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const hasResults = searchResults.playlists.length > 0 || 
                    searchResults.tracks.length > 0 || 
                    searchResults.artists.length > 0;

  return (
    <div className="flex-1 p-6 pb-32 bg-gradient-to-b from-[#121212] to-black">
      <div className="relative mb-8">
        <div className="flex items-center bg-[#282828] rounded-full px-4 py-3 shadow-lg">
          <FiSearch className="text-gray-400 mr-3 text-xl" />
          <input 
            type="text" 
            placeholder="What do you want to listen to?"
            className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : hasResults ? (
        <>
          {searchResults.tracks.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-white text-2xl font-bold mb-6">Songs</h2>
              <TrackList tracks={searchResults.tracks} />
              <p className="text-gray-400 text-sm mt-4">
                Note: These tracks are provided under Creative Commons licenses via Jamendo
              </p>
            </motion.div>
          )}

          {searchResults.artists.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-white text-2xl font-bold mb-6">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.artists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {searchQuery ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">Search for songs, artists, or albums</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;