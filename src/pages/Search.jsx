import { useState, useEffect } from 'react';
import { featuredPlaylists, recentlyPlayed, popularArtists } from '../mockData';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    playlists: [],
    tracks: [],
    artists: []
  });

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({
        playlists: [],
        tracks: [],
        artists: []
      });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    const filteredPlaylists = featuredPlaylists.filter(playlist => 
      playlist.name.toLowerCase().includes(query) || 
      playlist.description.toLowerCase().includes(query)
    );

    const filteredTracks = recentlyPlayed.filter(track => 
      track.title.toLowerCase().includes(query) || 
      track.artist.toLowerCase().includes(query) || 
      track.album.toLowerCase().includes(query)
    );

    const filteredArtists = popularArtists.filter(artist => 
      artist.name.toLowerCase().includes(query)
    );

    setSearchResults({
      playlists: filteredPlaylists,
      tracks: filteredTracks,
      artists: filteredArtists
    });
  }, [searchQuery]);

  const hasResults = searchResults.playlists.length > 0 || 
                    searchResults.tracks.length > 0 || 
                    searchResults.artists.length > 0;

  return (
    <div className="flex-1 p-6 pb-32 bg-gradient-to-b from-[#121212] to-black">
      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="What do you want to listen to?"
          className="w-full bg-[#282828] text-white px-4 py-4 rounded-full pl-12 focus:outline-none focus:ring-2 focus:ring-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5 text-gray-400 absolute left-4 top-4"
        >
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
        </svg>
      </div>

      {hasResults ? (
        <>
          {searchResults.playlists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-6">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}

          {searchResults.tracks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-6">Songs</h2>
              <TrackList tracks={searchResults.tracks} />
            </div>
          )}

          {searchResults.artists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-6">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.artists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {searchQuery ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Search;