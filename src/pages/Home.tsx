import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress,
  Pagination,
  Stack,
  useTheme
} from '@mui/material';
import { getPopularMovies, getPopularTVShows } from '../services/api';
import MediaCard from '../components/MediaCard';
import { Movie, TVShow } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const theme = useTheme();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [totalTVPages, setTotalTVPages] = useState(1);

  const fetchData = async (moviePageNum: number, tvPageNum: number) => {
    setLoading(true);
    setError('');

    try {
      const [moviesResponse, tvShowsResponse] = await Promise.all([
        getPopularMovies(moviePageNum),
        getPopularTVShows(tvPageNum)
      ]);

      setMovies(moviesResponse.data.results);
      setTvShows(tvShowsResponse.data.results);
      setTotalMoviePages(moviesResponse.data.total_pages);
      setTotalTVPages(tvShowsResponse.data.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(moviePage, tvPage);
  }, [moviePage, tvPage]);

  const handleMoviePageChange = (_: unknown, value: number) => {
    setMoviePage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTVPageChange = (_: unknown, value: number) => {
    setTvPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Popular Movies
      </Typography>
      <AnimatePresence mode="wait">
        <motion.div
          key={`movies-${moviePage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MediaCard item={movie} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
      
      <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
        <Pagination 
          count={totalMoviePages} 
          page={moviePage} 
          onChange={handleMoviePageChange}
          variant="outlined"
          shape="rounded"
          size="large"
          sx={{
            '& .MuiPaginationItem-root': {
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            },
          }}
        />
      </Stack>

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Popular TV Shows
      </Typography>
      <AnimatePresence mode="wait">
        <motion.div
          key={`tv-${tvPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {tvShows.map((show) => (
              <Grid item key={show.id} xs={12} sm={6} md={4} lg={3}>
                <MediaCard item={show} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>

      <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
        <Pagination 
          count={totalTVPages} 
          page={tvPage} 
          onChange={handleTVPageChange}
          variant="outlined"
          shape="rounded"
          size="large"
          sx={{
            '& .MuiPaginationItem-root': {
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            },
          }}
        />
      </Stack>

      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 3, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          mt: 4
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontStyle: 'italic',
            '& span': { 
              color: 'primary.main',
              fontWeight: 'bold' 
            }
          }}
        >
          Made By <span>Sahilpreet Singh</span> <span>24BMM0084</span>
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 