// src/utils/api.js
export const searchSongs = async (query) => {
    const formData = new FormData();
    formData.append('api_token', 'aa98176a9406c6fd6945d61d17b65b51');
    formData.append('q', query);
    
    try {
        const response = await fetch('https://api.audd.io/', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        return data.results?.map(song => ({
          ...song,
          imageUrl: song.image || 'https://i.scdn.co/image/ab67616d00001e026f3e1e6f9e1d7a1f3d3e1f6d' // Default Spotify image
        })) || [];
      } catch (error) {
        console.error('Error fetching songs:', error);
        return [];
      }
  };