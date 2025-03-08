import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { getDetails, getCredits } from '../services/api';
import { Movie, TVShow, Credit } from '../types';

interface DetailsProps {
  favorites: Array<{ id: string; type: 'movie' | 'tv' }>;
  onToggleFavorite: (id: string, type: 'movie' | 'tv') => void;
}

const Details = ({ favorites, onToggleFavorite }: DetailsProps) => {
  const { mediaType, id } = useParams<{ mediaType: 'movie' | 'tv'; id: string }>();
  const [details, setDetails] = useState<Movie | TVShow | null>(null);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isFavorite = favorites.some(
    (fav) => fav.id === id && fav.type === mediaType
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!mediaType || !id) return;

      setLoading(true);
      setError('');

      try {
        const [detailsRes, creditsRes] = await Promise.all([
          getDetails(mediaType, id),
          getCredits(mediaType, id)
        ]);

        setDetails(detailsRes.data);
        setCredits(creditsRes.data.cast);
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Failed to fetch details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !details) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error || 'Details not found'}</Typography>
      </Box>
    );
  }

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 3,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${details.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          mb: 4
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={details.poster_path}
              alt={title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                {title}
              </Typography>
              <IconButton
                onClick={() => {
                  if (mediaType && id) {
                    onToggleFavorite(id, mediaType);
                  }
                }}
                sx={{ color: 'white' }}
              >
                {isFavorite ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
              {releaseDate} • ★ {details.vote_average.toFixed(1)}
            </Typography>

            <Typography sx={{ mb: 3 }}>
              {details.overview}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Cast</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {credits.map((credit) => (
                  <Chip
                    key={credit.id}
                    label={`${credit.name}${credit.character ? ` as ${credit.character}` : ''}`}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Details; 