import { FaHome, FaSearch, FaBook, FaSignOutAlt, FaSpotify } from 'react-icons/fa';
import { MdLibraryMusic } from 'react-icons/md';

const Sidebar = ({ activePage, setActivePage, onLogout, username }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-black p-5 h-full overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <FaSpotify className="text-3xl text-green-500 mr-2" />
          <h1 className="text-white text-2xl font-bold">Spotify</h1>
        </div>
        {username && (
          <p className="text-gray-400 text-sm mt-1 ml-1">Welcome, {username}</p>
        )}
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <button 
              onClick={() => setActivePage('home')}
              className={`flex items-center ${activePage === 'home' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              <FaHome className="mr-4" />
              <span>Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActivePage('search')}
              className={`flex items-center ${activePage === 'search' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              <FaSearch className="mr-4" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActivePage('library')}
              className={`flex items-center ${activePage === 'library' ? 'text-white' : 'text-gray-400'} hover:text-white transition`}
            >
              <MdLibraryMusic className="mr-4" />
              <span>Your Library</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto">
        <ul className="space-y-2">
          <li>
            <button 
              onClick={onLogout}
              className="flex items-center text-gray-400 hover:text-white text-sm transition mt-4"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;