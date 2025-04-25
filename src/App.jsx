// src/App.js
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import { auth } from './firebase';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activePage, setActivePage] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.displayName || user.email.split('@')[0]);
        // Store in localStorage for persistence
        localStorage.setItem('spotifyCloneLoggedIn', 'true');
        localStorage.setItem('spotifyUser', JSON.stringify({
          username: user.displayName || user.email.split('@')[0],
          email: user.email
        }));
      } else {
        setIsLoggedIn(false);
        setUsername('');
        localStorage.removeItem('spotifyCloneLoggedIn');
        localStorage.removeItem('spotifyUser');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const path = location.pathname.substring(1) || 'home';
    setActivePage(path);
  }, [location]);

  const handleLogin = (loggedInUsername) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUsername('');
      localStorage.removeItem('spotifyCloneLoggedIn');
      localStorage.removeItem('spotifyUser');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
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