export const featuredPlaylists = [
  {
    id: '1',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music',
    imageUrl: 'https://th.bing.com/th/id/OIP.NfpUqO9RZN0FjEHeqE6WMwAAAA?rs=1&pid=ImgDetMain'
  },
  {
    id: '2',
    name: 'Daily Mix 1',
    description: 'A mix of your favorites',
    imageUrl: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb99e4fca7c0b7cb166d915789/1/en/large'
  },
  {
    id: '3',
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    imageUrl: 'https://th.bing.com/th/id/OIP.RK5HHQiwQuNmwGH4qbFJ6AAAAA?rs=1&pid=ImgDetMain6'
  },
  {
    id: '4',
    name: 'Bollywood Hits',
    description: 'Latest popular Hindi songs',
    imageUrl: 'https://i.scdn.co/image/ab67706c0000bebb77ef554ce79359be928fae5d'
  },
  {
    id: '5',
    name: 'Marathi Vibes',
    description: 'Best of Marathi music',
    imageUrl: 'https://mosaic.scdn.co/640/ab67616d00001e0208c8c1a8c217a0f878992129ab67616d00001e022f59c0f2d05e55a268e24bb9ab67616d00001e02f7f528d9334ef6362452000eab67616d00001e02f950058ccd18e37db7389d19'
  }
];

export const recentlyPlayed = [
  // English Songs
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    imageUrl: 'https://th.bing.com/th/id/OIP.aESN9ZbNP7ugzKm65zK3ZwHaHa?rs=1&pid=ImgDetMain'
  },
  {
    id: '2',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:35',
    imageUrl: 'https://images.complex.com/complex/images/c_fill,f_auto,g_center,w_1200/fl_lossy,pg_1/uij71a2harr1jq7pz5t8/the-weeknd-ariana-grande-save-your-tears-remix-animated-video'
  },
  
  // Hindi Songs
  {
    id: '3',
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmāstra',
    duration: '4:28',
    imageUrl: 'https://is2-ssl.mzstatic.com/image/thumb/Music112/v4/c9/b8/d0/c9b8d049-07d4-2faf-48c5-72c1090ecca6/196589105493.jpg/1200x1200bf-60.jpg'
  },
  {
    id: '4',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh',
    album: 'Bhediya',
    duration: '4:21',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b27329455d0a5c4ae1ac20510f84'
  },
  {
    id: '5',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    album: 'Aashiqui 2',
    duration: '4:22',
    imageUrl: 'https://images.genius.com/d7a02693d69d1c65e4b47de07989900a.1000x1000x1.jpg'
  },
  
  // Marathi Songs
  {
    id: '6',
    title: 'Zing Zing Zingat',
    artist: 'Ajay-Atul',
    album: 'Sairat',
    duration: '3:58',
    imageUrl: 'https://i.ytimg.com/vi/t4Al208ko_U/maxresdefault.jpg'
  },
  {
    id: '7',
    title: 'Apsara Aali',
    artist: 'Ajay-Atul',
    album: 'Natrang',
    duration: '4:12',
    imageUrl: 'https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/radio/track/7uWt6BU9XnA6izKKjHtMwG/en'
  },
  {
    id: '8',
    title: 'Ved Lagala',
    artist: 'Ajay Gogavale',
    album: 'Yeu Kashi Tashi Me Nandayla',
    duration: '3:45',
    imageUrl: 'https://i.scdn.co/image/ab67616d00001e02f3e1e6f9e1d7a1f3d3e1f6d9'
  }
];

export const popularArtists = [
  // International Artists
  {
    id: '1',
    name: 'The Weeknd',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebb5f9e28219c169fd4b9e8379'
  },
  {
    id: '2',
    name: 'Dua Lipa',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2736f3a9d2b11ad1707cbb88369'
  },
  
  // Hindi Artists
  {
    id: '3',
    name: 'Arijit Singh',
    imageUrl: 'https://th.bing.com/th/id/OIP.oWk-7OyoiLSMv_m9yKF-KgHaFj?rs=1&pid=ImgDetMain'
  },
  {
    id: '4',
    name: 'Neha Kakkar',
    imageUrl: 'https://th.bing.com/th/id/OIP.GZhXhpNMxS4jSJbHmCMYeQHaI-?rs=1&pid=ImgDetMain'
  },
  
  // Marathi Artists
  {
    id: '5',
    name: 'Ajay-Atul',
    imageUrl: 'https://miro.medium.com/v2/resize:fit:500/1*9UDqPIj5OZ9lWWe2zgxw6w.jpeg'
  },
  {
    id: '6',
    name: 'Shreya Ghoshal',
    imageUrl: 'https://media.insider.in/image/upload/c_crop,g_custom/v1669033779/ds4bbdue5v8qcakdth4c.jpg'
  }
];

// Additional data for more variety
export const allSongs = [
  ...recentlyPlayed,
  {
    id: '9',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷',
    duration: '3:53',
    imageUrl: 'https://i.scdn.co/image/ab67616d00001e02093c9f57a3e70f391fd5e3f1'
  },
  {
    id: '10',
    title: 'Manike Mage Hithe',
    artist: 'Yohani',
    album: 'Manike Mage Hithe',
    duration: '3:17',
    imageUrl: 'https://i.scdn.co/image/ab67616d00001e0219e1e6f9e1d7a1f3d3e1f6d9'
  },
  {
    id: '11',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    album: 'Bajirao Mastani',
    duration: '4:05',
    imageUrl: 'https://i.scdn.co/image/ab67616d00001e021ae1e6f9e1d7a1f3d3e1f6d9'
  }
];