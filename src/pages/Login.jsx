// src/pages/Login.js
import { useState } from 'react';
import { FaSpotify, FaGoogle, FaFacebook } from 'react-icons/fa';
import { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  facebookProvider
} from '../firebase';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // Sign up with email/password
        if (!username) {
          setError('Please enter a username');
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // For demo, we'll just pass the username to onLogin
        // In a real app, you'd update the user profile with the username
        onLogin(username);
      } else {
        // Sign in with email/password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Use email as username for demo
        onLogin(userCredential.user.email.split('@')[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Use displayName if available, otherwise use email prefix
      onLogin(user.displayName || user.email.split('@')[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
          <div className={`mb-4 p-2 rounded text-sm bg-red-500 text-white`}>
            {error}
          </div>
        )}
        
        {/* Add social login buttons */}
        <div className="flex flex-col space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-white text-black py-3 px-4 rounded-full font-medium hover:bg-gray-200 transition"
          >
            <FaGoogle className="text-red-500" />
            <span>{isSignUp ? 'Sign up with Google' : 'Continue with Google'}</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin(facebookProvider)}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-[#3b5998] text-white py-3 px-4 rounded-full font-medium hover:bg-[#344e86] transition"
          >
            <FaFacebook />
            <span>{isSignUp ? 'Sign up with Facebook' : 'Continue with Facebook'}</span>
          </button>
        </div>
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        {/* Rest of your existing form remains the same */}
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
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition duration-200 disabled:opacity-70"
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
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
              disabled={isLoading}
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