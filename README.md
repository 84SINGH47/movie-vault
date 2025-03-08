# MovieVault

A modern and interactive movie and TV show dashboard built with React and TypeScript. This application allows users to browse popular movies and TV shows, search for specific titles, view detailed information, and bookmark their favorites.

## Features

- Browse popular movies and TV shows
- Search functionality for finding specific titles
- Detailed view with cast information and trailers
- Bookmark favorite movies and TV shows
- Responsive design for all screen sizes
- Modern UI with smooth animations
- Dark theme for comfortable viewing

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (get it from [https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api))

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd movievault
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your TMDB API key:
```
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Material-UI
- Axios
- React Router
- Framer Motion

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript interfaces
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License
