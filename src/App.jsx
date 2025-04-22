import { useState, useEffect } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Library from './pages/Library';
import Search from './pages/Search';
import Login from './pages/Login';
import { featuredPlaylists, allSongs } from './mockData';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('spotifyCloneLoggedIn');
    const userData = JSON.parse(localStorage.getItem('spotifyUser'));
    
    if (loggedInStatus === 'true' && userData) {
      setIsLoggedIn(true);
      setUsername(userData.username);
    }
  }, []);

  const handleLogin = (loggedInUsername) => {
    const userData = { username: loggedInUsername };
    localStorage.setItem('spotifyCloneLoggedIn', 'true');
    localStorage.setItem('spotifyUser', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('spotifyCloneLoggedIn');
    localStorage.removeItem('spotifyUser');
    setIsLoggedIn(false);
    setUsername('');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home />;
      case 'search': return <Search />;
      case 'library': return <Library />;
      default: return <Home />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <PlayerProvider initialPlaylists={featuredPlaylists} initialSongs={allSongs}>
      <div className="flex h-screen bg-[#121212] overflow-hidden">
        {/* Sidebar with proper height calculation */}
        <div className="hidden md:flex h-[calc(100vh-6rem)]">
          <Sidebar 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onLogout={handleLogout}
            username={username}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pb-24">
            {renderPage()}
          </main>
        </div>
        
        {/* Player fixed at bottom */}
        <Player />
      </div>
    </PlayerProvider>
  );
};

export default App;