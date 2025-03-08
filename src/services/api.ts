import axios from 'axios';
import { Movie, TVShow, OMDBResponse, OMDBSearchResponse, OMDBSearchResult } from '../types';

const api = axios.create({
  baseURL: 'https://www.omdbapi.com',
  params: {
    apikey: import.meta.env.VITE_OMDB_API_KEY,
  },
});

// Helper function to get random year between 1990 and current year
const getRandomYear = () => {
  const currentYear = new Date().getFullYear();
  return Math.floor(Math.random() * (currentYear - 1990 + 1)) + 1990;
};

// Helper function to get random search terms
const getRandomSearchTerm = () => {
  const terms = ['love', 'action', 'hero', 'life', 'world', 'dark', 'light', 'time', 'star', 'dream', 
    'day', 'night', 'man', 'city', 'game', 'war', 'space', 'heart', 'death', 'king'];
  return terms[Math.floor(Math.random() * terms.length)];
};

// Helper function to transform OMDB movie data to our format
const transformMovieData = (data: OMDBResponse): Movie => ({
  id: data.imdbID,
  title: data.Title,
  overview: data.Plot,
  poster_path: data.Poster !== 'N/A' ? data.Poster : '/placeholder.png',
  backdrop_path: data.Poster !== 'N/A' ? data.Poster : '/placeholder.png',
  vote_average: parseFloat(data.imdbRating) || 0,
  release_date: data.Year,
  media_type: 'movie',
});

// Helper function to transform OMDB series data to our format
const transformSeriesData = (data: OMDBResponse): TVShow => ({
  id: data.imdbID,
  name: data.Title,
  overview: data.Plot,
  poster_path: data.Poster !== 'N/A' ? data.Poster : '/placeholder.png',
  backdrop_path: data.Poster !== 'N/A' ? data.Poster : '/placeholder.png',
  vote_average: parseFloat(data.imdbRating) || 0,
  first_air_date: data.Year,
  media_type: 'tv',
});

export const getPopularMovies = async (page: number = 1) => {
  try {
    // Make multiple requests with different search terms and years to get diverse results
    const searchPromises = Array(3).fill(0).map(() => 
      api.get<OMDBSearchResponse>('/', { 
        params: { 
          s: getRandomSearchTerm(),
          y: getRandomYear(),
          type: 'movie',
          page: page
        } 
      })
    );

    const responses = await Promise.all(searchPromises);
    const allMovies: OMDBSearchResult[] = [];

    responses.forEach(response => {
      if (response.data.Response === 'True') {
        allMovies.push(...response.data.Search);
      }
    });

    // Shuffle the movies array
    const shuffledMovies = allMovies.sort(() => Math.random() - 0.5);

    // Get detailed information for each movie
    const detailedMovies = await Promise.all(
      shuffledMovies.slice(0, 20).map(async (movie) => {
        const details = await api.get<OMDBResponse>('/', { params: { i: movie.imdbID, plot: 'full' } });
        return transformMovieData(details.data);
      })
    );

    return { 
      data: { 
        results: detailedMovies,
        total_pages: 5 // We'll limit to 5 pages for now
      } 
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { data: { results: [], total_pages: 0 } };
  }
};

export const getPopularTVShows = async (page: number = 1) => {
  try {
    // Make multiple requests with different search terms and years to get diverse results
    const searchPromises = Array(3).fill(0).map(() => 
      api.get<OMDBSearchResponse>('/', { 
        params: { 
          s: getRandomSearchTerm(),
          y: getRandomYear(),
          type: 'series',
          page: page
        } 
      })
    );

    const responses = await Promise.all(searchPromises);
    const allShows: OMDBSearchResult[] = [];

    responses.forEach(response => {
      if (response.data.Response === 'True') {
        allShows.push(...response.data.Search);
      }
    });

    // Shuffle the shows array
    const shuffledShows = allShows.sort(() => Math.random() - 0.5);

    // Get detailed information for each show
    const detailedShows = await Promise.all(
      shuffledShows.slice(0, 20).map(async (show) => {
        const details = await api.get<OMDBResponse>('/', { params: { i: show.imdbID, plot: 'full' } });
        return transformSeriesData(details.data);
      })
    );

    return { 
      data: { 
        results: detailedShows,
        total_pages: 5 // We'll limit to 5 pages for now
      } 
    };
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { data: { results: [], total_pages: 0 } };
  }
};

export const searchMulti = async (query: string) => {
  const [movieResponse, seriesResponse] = await Promise.all([
    api.get<OMDBSearchResponse>('/', { params: { s: query, type: 'movie' } }),
    api.get<OMDBSearchResponse>('/', { params: { s: query, type: 'series' } })
  ]);

  const results = [];

  if (movieResponse.data.Response === 'True') {
    const movies = await Promise.all(
      movieResponse.data.Search.slice(0, 4).map(async (movie: OMDBSearchResult) => {
        const details = await api.get<OMDBResponse>('/', { params: { i: movie.imdbID, plot: 'full' } });
        return transformMovieData(details.data);
      })
    );
    results.push(...movies);
  }

  if (seriesResponse.data.Response === 'True') {
    const shows = await Promise.all(
      seriesResponse.data.Search.slice(0, 4).map(async (show: OMDBSearchResult) => {
        const details = await api.get<OMDBResponse>('/', { params: { i: show.imdbID, plot: 'full' } });
        return transformSeriesData(details.data);
      })
    );
    results.push(...shows);
  }

  return { data: { results } };
};

export const getDetails = async (mediaType: 'movie' | 'tv', id: string) => {
  const response = await api.get<OMDBResponse>('/', { params: { i: id, plot: 'full' } });
  
  if (response.data.Response === 'True') {
    const data = mediaType === 'movie' 
      ? transformMovieData(response.data)
      : transformSeriesData(response.data);
    return { data };
  }
  throw new Error('Not found');
};

export const getCredits = async (mediaType: 'movie' | 'tv', id: string) => {
  const response = await api.get<OMDBResponse>('/', { params: { i: id, plot: 'full' } });
  
  if (response.data.Response === 'True') {
    // OMDB provides actors in a comma-separated string
    const cast = response.data.Actors.split(', ').map((name: string, index: number) => ({
      id: `${id}-${index}`,
      name,
      character: mediaType === 'movie' ? 'Cast Member' : 'Series Regular',
      profile_path: null
    }));
    return { data: { cast } };
  }
  return { data: { cast: [] } };
};

// Note: OMDB doesn't provide video/trailer data, so we'll return an empty array
export const getVideos = async () => {
  return { data: { results: [] } };
};

export default api; 