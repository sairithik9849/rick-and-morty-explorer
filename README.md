# Rick and Morty Multiverse Explorer

A Single Page Application (SPA) built with React and Vite that allows you to explore the vast universe of Rick and Morty. Browse through characters, discover unique locations across dimensions, and relive memorable episodes from the series.

## Features

- **Characters**: Browse through all characters from across infinite dimensions with detailed character pages
- **Locations**: Explore different dimensions, planets, and parallel realities
- **Episodes**: Access information about all episodes from the series
- **Filtering & Search**: Filter and search across characters, locations, and episodes
- **Pagination**: Navigate through paginated results efficiently
- **Responsive Design**: Modern UI with smooth animations and responsive layout

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
# or
npm start
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```


## API

This application uses the [Rick and Morty API](https://rickandmortyapi.com), a free and open RESTful API that provides comprehensive information about the show.

## Available Routes

- `/` - Home page
- `/characters/page/:page` - Character list with pagination
- `/characters/:id` - Character detail page
- `/locations/page/:page` - Location list with pagination
- `/locations/:id` - Location detail page
- `/episodes/page/:page` - Episode list with pagination
- `/episodes/:id` - Episode detail page

## License

This project is part of CS 554 Lab-5 assignment at Stevens Institute of Technology.
