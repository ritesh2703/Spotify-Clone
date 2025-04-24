import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Browse from './pages/Browse';
import Playlists from './pages/Playlists';
import Premium from './pages/Premium';
import { featuredPlaylists, allSongs } from './mockData';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activePage, setActivePage] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('spotifyCloneLoggedIn');
    const userData = JSON.parse(localStorage.getItem('spotifyUser'));
    
    if (loggedInStatus === 'true' && userData) {
      setIsLoggedIn(true);
      setUsername(userData.username);
    }
  }, []);

  useEffect(() => {
    // Update active page based on current route
    const path = location.pathname.substring(1) || 'home';
    setActivePage(path);
  }, [location]);

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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <PlayerProvider initialPlaylists={featuredPlaylists} initialSongs={allSongs}>
      <div className="flex flex-col h-screen bg-[#121212] overflow-hidden">
        <Navbar 
          username={username} 
          onLogout={handleLogout}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex h-full">
            <Sidebar 
              activePage={activePage} 
              setActivePage={setActivePage}
              onLogout={handleLogout}
              username={username}
            />
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto pb-[90px]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/premium" element={<Premium />} />
              </Routes>
            </main>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0">
          <Player />
        </div>
      </div>
    </PlayerProvider>
  );
};

export default App;