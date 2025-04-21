import { useEffect, useState } from 'react';

const MusicVisualizer = ({ isPlaying }) => {
  const [heights, setHeights] = useState([3, 5, 7, 4, 6]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setHeights(Array(5).fill(0).map(() => Math.floor(Math.random() * 8) + 2));
    }, 300);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end h-6 space-x-1 mx-4">
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-1 bg-spotify-green rounded-sm transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;