import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify, FaSearch, FaHome, FaBell, FaCompass } from 'react-icons/fa';
import { FiX, FiMenu } from 'react-icons/fi';

const Navbar = ({ username, onLogout, activePage, setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchFocus, setShowSearchFocus] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, text: 'New release from your favorite artist', time: '2 hours ago' },
    { id: 2, text: 'Your playlist was liked by 5 users', time: '1 day ago' },
    { id: 3, text: 'Weekly discover playlist updated', time: '3 days ago' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchFocus(true);
        document.querySelector('input[type="text"]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('home');
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    navigate(page === 'home' ? '/' : `/${page}`);
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  };

  const navItems = [
    { id: 'home', icon: <FaHome />, label: 'Home' },
    { id: 'browse', icon: <FaCompass />, label: 'Browse' },
  ];

  return (
    <nav className="bg-black text-white border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavigation('home')}
          >
            <FaSpotify className="text-2xl text-green-500 mr-2" />
            <span className="font-bold hidden md:block">Spotify</span>
          </div>
          
          <button 
            className={`p-2 rounded-full hover:bg-gray-800 ${activePage === 'home' ? 'text-white' : 'text-gray-300'}`}
            onClick={() => handleNavigation('home')}
          >
            <FaHome className="text-xl" />
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-3">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="What do you want to play?"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchFocus(true)}
              onBlur={() => setShowSearchFocus(false)}
            />
            {showSearchFocus && (
              <kbd className="absolute right-3 bg-gray-700 text-xs px-2 py-1 rounded hidden md:block">
                Ctrl+K
              </kbd>
            )}
          </form>
        </div>

        <div className="flex items-center space-x-4">
          {navItems.slice(1).map((item) => (
            <button
              key={item.id}
              className={`hidden md:block p-2 rounded-full hover:bg-gray-800 ${activePage === item.id ? 'text-white' : 'text-gray-300'}`}
              onClick={() => handleNavigation(item.id)}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
          
          <div className="relative">
            <button 
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-700 font-medium flex justify-between items-center">
                  <span>Notifications</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="p-3 border-b border-gray-700 hover:bg-gray-700 flex justify-between">
                        <div>
                          <p className="text-sm">{notification.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-white text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-2 text-center text-sm text-green-500 hover:bg-gray-700 cursor-pointer">
                  Mark all as read
                </div>
              </div>
            )}
          </div>
          
          {username && (
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-300 mr-2">Hi, {username}</span>
            </div>
          )}

          <button 
            className="hidden md:block px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200"
            onClick={() => handleNavigation('premium')}
          >
            Explore Premium
          </button>
          
          <button 
            className="hidden md:block px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200"
            onClick={() => handleNavigation('install')}
          >
            Install App
          </button>

          {username && (
            <div className="hidden md:flex items-center">
              <button 
                onClick={onLogout}
                className="text-sm bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 mt-2 py-2 px-4 rounded-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full text-left px-3 py-2 rounded ${activePage === item.id ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
              onClick={() => handleNavigation(item.id)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
          
          <div className="border-t border-gray-700 my-2"></div>
          
          <button 
            className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            onClick={() => handleNavigation('premium')}
          >
            Explore Premium
          </button>
          <button 
            className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
            onClick={() => handleNavigation('install')}
          >
            Install App
          </button>
          
          {username && (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="px-3 py-2 text-sm text-gray-400">Logged in as {username}</div>
              <button 
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;