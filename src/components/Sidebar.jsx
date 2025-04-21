import { FaHome, FaSearch, FaBook } from 'react-icons/fa'
import { MdLibraryMusic } from 'react-icons/md'

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-spotify-black p-5">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Spotify</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <button 
              onClick={() => setActivePage('home')}
              className={`flex items-center ${activePage === 'home' ? 'text-white' : 'text-spotify-lightGray'} hover:text-white transition`}
            >
              <FaHome className="mr-4" />
              <span>Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActivePage('search')}
              className={`flex items-center ${activePage === 'search' ? 'text-white' : 'text-spotify-lightGray'} hover:text-white transition`}
            >
              <FaSearch className="mr-4" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActivePage('library')}
              className={`flex items-center ${activePage === 'library' ? 'text-white' : 'text-spotify-lightGray'} hover:text-white transition`}
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
            <button className="text-spotify-lightGray hover:text-white text-sm transition">Create Playlist</button>
          </li>
          <li>
            <button className="text-spotify-lightGray hover:text-white text-sm transition">Liked Songs</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar