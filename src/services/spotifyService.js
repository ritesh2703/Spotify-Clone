import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token)
}

export const getCurrentUserPlaylists = () => {
  return spotifyApi.getUserPlaylists()
}

export const getFeaturedPlaylists = () => {
  return spotifyApi.getFeaturedPlaylists({ country: 'US', limit: 10 })
}

export const getRecentlyPlayed = () => {
  return spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 })
}

export const getTopArtists = () => {
  return spotifyApi.getMyTopArtists({ limit: 10 })
}

export const playTrack = (trackUri) => {
  return spotifyApi.play({ uris: [trackUri] })
}

export const pausePlayback = () => {
  return spotifyApi.pause()
}

export const skipToNext = () => {
  return spotifyApi.skipToNext()
}

export const skipToPrevious = () => {
  return spotifyApi.skipToPrevious()
}

export const getCurrentPlaybackState = () => {
  return spotifyApi.getMyCurrentPlaybackState()
}