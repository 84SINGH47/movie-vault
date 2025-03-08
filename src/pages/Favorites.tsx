import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { getDetails } from '../services/api';
import MediaCard from '../components/MediaCard';
import { Movie, TVShow } from '../types';

interface FavoritesProps {
  favorites: Array<{ id: string; type: 'movie' | 'tv' }>;
  onToggleFavorite: (id: string, type: 'movie' | 'tv') => void;
}

const Favorites = ({ favorites, onToggleFavorite }: FavoritesProps) => {
  const [favoriteItems, setFavoriteItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError('');

      try {
        const items = await Promise.all(
          favorites.map(async ({ id, type }) => {
            const response = await getDetails(type, id);
            return response.data;
          })
        );
        setFavoriteItems(items);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to fetch favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

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
        My Favorites
      </Typography>

      {favoriteItems.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No favorites yet. Start adding some!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favoriteItems.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <MediaCard
                item={item}
                isFavorite={true}
                onToggleFavorite={() => 
                  onToggleFavorite(
                    item.id,
                    'title' in item ? 'movie' : 'tv'
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 