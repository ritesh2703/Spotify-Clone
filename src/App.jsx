import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Library from './pages/Library';
import Search from './pages/Search';
import { featuredPlaylists, allSongs, popularArtists } from './mockData';

const App = () => {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'library':
        return <Library />;
      default:
        return <Home />;
    }
  };

  return (
    <PlayerProvider initialPlaylists={featuredPlaylists} initialSongs={allSongs}>
      <div className="flex h-screen bg-[#1A1A2E]">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <Player />
    </PlayerProvider>
  );
};

export default App;