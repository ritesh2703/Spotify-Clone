import { useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignUp && !username) {
      setError('Please enter a username');
      return;
    }

    // In a real app, you would validate against a backend here
    if (isSignUp) {
      // Store user data in localStorage
      const userData = {
        email,
        password,
        username
      };
      localStorage.setItem('spotifyUser', JSON.stringify(userData));
      setError('Account created successfully! Please log in.');
      setIsSignUp(false);
    } else {
      // Check if user exists (for demo purposes)
      const storedUser = JSON.parse(localStorage.getItem('spotifyUser'));
      if (storedUser && storedUser.email === email && storedUser.password === password) {
        onLogin(storedUser.username);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 rounded-lg bg-[#121212]">
        <div className="flex justify-center mb-8">
          <FaSpotify className="text-5xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isSignUp ? 'Sign up for Spotify' : 'Log in to Spotify'}
        </h1>
        
        {error && (
          <div className={`mb-4 p-2 rounded text-sm ${error.includes('success') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your username"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-[#333] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition duration-200"
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-white hover:underline focus:outline-none"
            >
              {isSignUp ? 'Log in' : 'Sign up for Spotify'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;