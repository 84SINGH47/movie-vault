import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder, Info, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaCardProps {
  item: Movie | TVShow;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const MediaCard = ({ item, isFavorite = false, onToggleFavorite }: MediaCardProps) => {
  const [showDescription, setShowDescription] = useState(false);
  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const mediaType = isMovie ? 'movie' : 'tv';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      style={{ height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Link to={`/${mediaType}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardMedia
              component="img"
              height="300"
              image={item.poster_path}
              alt={title}
              sx={{ objectFit: 'cover' }}
            />
          </Link>
          
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            {onToggleFavorite && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                  onClick={onToggleFavorite}
                >
                  {isFavorite ? (
                    <Favorite sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorder sx={{ color: 'white' }} />
                  )}
                </IconButton>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
                onClick={() => setShowDescription(!showDescription)}
              >
                {showDescription ? (
                  <Close sx={{ color: 'white' }} />
                ) : (
                  <Info sx={{ color: 'white' }} />
                )}
              </IconButton>
            </motion.div>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {releaseDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ★ {item.vote_average.toFixed(1)}
            </Typography>
          </Box>
        </CardContent>

        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                padding: '20px',
                overflow: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {item.overview}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default MediaCard; 