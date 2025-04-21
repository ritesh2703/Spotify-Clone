import { useState, useEffect } from 'react'
import { 
  getFeaturedPlaylists, 
  getRecentlyPlayed, 
  getTopArtists,
  setAccessToken
} from '../services/spotifyService'

export const useSpotify = (token) => {
  const [data, setData] = useState({
    featuredPlaylists: [],
    recentlyPlayed: [],
    popularArtists: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    if (!token) return

    setAccessToken(token)
    const fetchData = async () => {
      try {
        const [
          { playlists: featuredPlaylists },
          { items: recentlyPlayed },
          { items: popularArtists }
        ] = await Promise.all([
          getFeaturedPlaylists(),
          getRecentlyPlayed(),
          getTopArtists()
        ])

        setData({
          featuredPlaylists: featuredPlaylists.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            imageUrl: item.images[0]?.url,
            uri: item.uri
          })),
          recentlyPlayed: recentlyPlayed.map(item => ({
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map(a => a.name).join(', '),
            album: item.track.album.name,
            duration: msToMinutes(item.track.duration_ms),
            imageUrl: item.track.album.images[0]?.url,
            uri: item.track.uri
          })),
          popularArtists: popularArtists.map(item => ({
            id: item.id,
            name: item.name,
            imageUrl: item.images[0]?.url,
            uri: item.uri
          })),
          isLoading: false,
          error: null
        })
      } catch (error) {
        setData({
          featuredPlaylists: [],
          recentlyPlayed: [],
          popularArtists: [],
          isLoading: false,
          error: error.message
        })
      }
    }

    fetchData()
  }, [token])

  return data
}

const msToMinutes = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}