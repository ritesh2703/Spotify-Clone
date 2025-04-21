module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#121212',
          lightBlack: '#181818',
          gray: '#282828',
          lightGray: '#B3B3B3',
          darkGray: '#535353'
        }
      },
      animation: {
        wave: 'wave 1s ease-in-out infinite',
        'wave-fast': 'wave 0.8s ease-in-out infinite',
        'wave-slow': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        }
      }
    },
  },
  plugins: [],
}