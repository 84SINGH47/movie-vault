import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { searchMulti } from '../services/api';
import MediaCard from '../components/MediaCard';
import { MediaItem } from '../types';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await searchMulti(query);
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

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
        Search Results for "{query}"
      </Typography>
      
      {results.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No results found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {results.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <MediaCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Search; 