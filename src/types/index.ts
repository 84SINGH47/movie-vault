export interface Movie {
  id: string;  // imdbID
  title: string;  // Title
  overview: string;  // Plot
  poster_path: string;  // Poster
  backdrop_path: string;  // We'll reuse Poster
  vote_average: number;  // imdbRating
  release_date: string;  // Year
  media_type?: 'movie';
}

export interface TVShow {
  id: string;  // imdbID
  name: string;  // Title
  overview: string;  // Plot
  poster_path: string;  // Poster
  backdrop_path: string;  // We'll reuse Poster
  vote_average: number;  // imdbRating
  first_air_date: string;  // Year
  media_type?: 'tv';
}

export interface Credit {
  id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export type MediaItem = Movie | TVShow;

// OMDB specific interfaces for reference
export interface OMDBResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
}

export interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDBSearchResponse {
  Search: OMDBSearchResult[];
  totalResults: string;
  Response: string;
} 