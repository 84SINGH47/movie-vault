import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Favorites from './pages/Favorites';

// Add console log to check environment variable
console.log('API Key available:', !!import.meta.env.VITE_OMDB_API_KEY);
console.log('Environment:', import.meta.env.MODE);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
  },
});

function App() {
  const [favorites, setFavorites] = useState<Array<{ id: string; type: 'movie' | 'tv' }>>(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add error handling for localStorage
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        JSON.parse(storedFavorites);
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      localStorage.setItem('favorites', '[]');
    }

    // Check if API key is available
    if (!import.meta.env.VITE_OMDB_API_KEY) {
      setError('API key not found. Please check environment variables.');
    }
  }, []);

  const toggleFavorite = (id: string, type: 'movie' | 'tv') => {
    setFavorites((prev) => {
      const newFavorites = prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, type }];
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
      return newFavorites;
    });
  };

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#e50914',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1>{error}</h1>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route 
            path="/:mediaType/:id" 
            element={
              <Details 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <Favorites 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
