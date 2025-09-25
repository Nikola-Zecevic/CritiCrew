import apiService from './apiService.js';

// Movies service - handles all movie-related data operations
class MoviesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get all movies from backend
  async getAllMovies() {
    try {
      const movies = await apiService.getAllMovies();
      return this.transformMoviesData(movies);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      throw new Error('Unable to load movies. Please try again later.');
    }
  }

  // Get single movie by ID
  async getMovieById(id) {
    try {
      const movie = await apiService.getMovieById(id);
      return this.transformMovieData(movie);
    } catch (error) {
      console.error(`Failed to fetch movie ${id}:`, error);
      throw new Error('Movie not found.');
    }
  }

  // Get movies by genre with sorting
  async getMoviesByGenre(genre, sort = 'desc') {
    try {
      const movies = await apiService.getMoviesByGenre(genre, sort);
      return this.transformMoviesData(movies);
    } catch (error) {
      console.error(`Failed to fetch movies for genre ${genre}:`, error);
      throw new Error('Unable to load movies for this genre.');
    }
  }

  // Get movie by slug (for routing)
  async getMovieBySlug(slug) {
    try {
      const movies = await this.getAllMovies();
      return movies.find(movie => movie.slug === slug) || null;
    } catch (error) {
      console.error(`Failed to fetch movie by slug ${slug}:`, error);
      return null;
    }
  }

  // Transform backend movie data to match frontend expectations
  transformMoviesData(movies) {
    return movies.map(movie => this.transformMovieData(movie));
  }

  transformMovieData(movie) {
    return {
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      year: movie.year,
      rating: movie.rating || 0,
      image: movie.image,
      description: movie.description,
      genre: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      director: movie.director,
      // Add duration field - you might want to add this to your backend schema
      duration: movie.duration || 'N/A'
    };
  }

  // Get unique genres from all movies
  async getUniqueGenres() {
    try {
      const movies = await this.getAllMovies();
      const allGenres = movies.flatMap(movie => movie.genres);
      return [...new Set(allGenres)].sort();
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return [];
    }
  }

  // Search movies by title
  async searchMovies(query) {
    try {
      const movies = await this.getAllMovies();
      const lowerQuery = query.toLowerCase();
      return movies.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.director.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search movies:', error);
      return [];
    }
  }
}

// Create and export singleton instance
const moviesService = new MoviesService();

// Keep some fallback data for development
export const fallbackMovies = [
  {
    id: 2,
    slug: "the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    image: "/images/dark-knight.jpg",
    description:
      "Batman must accept one of the greatest psychological and physical tests.",
    genre: "Action, Crime, Drama",
    duration: "152 min",
    director: "Christopher Nolan",
  },
  {
    id: 3,
    slug: "pulp-fiction",
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    image: "/images/pulp-fiction.jpg",
    description:
      "The lives of two mob hitmen, a boxer, and a gangster intertwine.",
    genre: "Crime, Drama",
    duration: "154 min",
    director: "Quentin Tarantino",
  },
  {
    id: 4,
    slug: "inception",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    image: "/images/inception.jpg",
    description:
      "A thief who steals corporate secrets through dream-sharing technology.",
    genre: "Action, Adventure, Sci-Fi",
    duration: "148 min",
    director: "Christopher Nolan",
  },
  {
    id: 5,
    slug: "the-matrix",
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    image: "/images/matrix.jpg",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality.",
    genre: "Action, Sci-Fi",
    duration: "136 min",
    director: "Lana Wachowski, Lilly Wachowski",
  },
  {
    id: 6,
    slug: "interstellar",
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    image: "/images/interstellar.jpg",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: "Adventure, Drama, Sci-Fi",
    duration: "169 min",
    director: "Christopher Nolan",
  },
  {
    id: 7,
    slug: "the-godfather",
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    image: "/images/godfather.jpg",
    description:
      "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    genre: "Crime, Drama",
    duration: "175 min",
    director: "Francis Ford Coppola",
  },
  {
    id: 8,
    slug: "forrest-gump",
    title: "Forrest Gump",
    year: 1994,
    rating: 8.8,
    image: "/images/forest-gump.jpg",
    description:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, and more.",
    genre: "Drama, Romance",
    duration: "142 min",
    director: "Robert Zemeckis",
  },
  {
    id: 9,
    slug: "the-lord-of-the-rings",
    title: "The Lord of the Rings",
    year: 2003,
    rating: 8.9,
    image: "/images/lotr.jpg",
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army.",
    genre: "Adventure, Drama, Fantasy",
    duration: "201 min",
    director: "Peter Jackson",
  },
  {
    id: 10,
    slug: "fight-club",
    title: "Fight Club",
    year: 1999,
    rating: 8.8,
    image: "/images/fight-club.jpg",
    description:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    genre: "Drama",
    duration: "139 min",
    director: "David Fincher",
  },
  {
    id: 11,
    slug: "goodfellas",
    title: "Goodfellas",
    year: 1990,
    rating: 8.7,
    image: "/images/goodfellas.jpg",
    description:
      "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    genre: "Biography, Crime, Drama",
    duration: "146 min",
    director: "Martin Scorsese",
  },
  {
    id: 12,
    slug: "the-silence-of-the-lambs",
    title: "The Silence of the Lambs",
    year: 1991,
    rating: 8.6,
    image: "/images/silence-lambs.jpg",
    description:
      "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    genre: "Crime, Drama, Thriller",
    duration: "118 min",
    director: "Jonathan Demme",
  },
  {
    id: 13,
    slug: "parasite",
    title: "Parasite",
    year: 2019,
    rating: 8.6,
    image: "/images/parasite.jpg",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    genre: "Comedy, Drama, Thriller",
    duration: "132 min",
    director: "Bong Joon Ho",
  },
  {
    id: 14,
    slug: "the-departed",
    title: "The Departed",
    year: 2006,
    rating: 8.5,
    image: "/images/departed.jpg",
    description:
      "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    genre: "Crime, Drama, Thriller",
    duration: "151 min",
    director: "Martin Scorsese",
  },
  {
    id: 15,
    slug: "whiplash",
    title: "Whiplash",
    year: 2014,
    rating: 8.5,
    image: "/images/whiplash.jpg",
    description:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    genre: "Drama, Music",
    duration: "106 min",
    director: "Damien Chazelle",
  },
  {
    id: 16,
    slug: "gladiator",
    title: "Gladiator",
    year: 2000,
    rating: 8.5,
    image: "/images/gladiator.jpg",
    description:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    genre: "Action, Adventure, Drama",
    duration: "155 min",
    director: "Ridley Scott",
  },
  {
    id: 17,
    slug: "nightcrawler",
    title: "Nightcrawler",
    year: 2014,
    rating: 7.8,
    image: "/images/nightcrawler.jpg",
    description:
      "A driven young man stumbles upon the underground world of L.A. crime journalism and blurs the line between observer and participant to become the star of his own story.",
    genre: "Crime, Drama, Thriller",
    duration: "117 min",
    director: "Dan Gilroy",
  },
  {
    id: 18,
    slug: "the-lion-king",
    title: "The Lion King",
    year: 1994,
    rating: 8.5,
    image: "/images/lion-king.jpg",
    description:
      "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    genre: "Animation, Adventure, Drama",
    duration: "88 min",
    director: "Roger Allers, Rob Minkoff",
  },
  {
    id: 19,
    slug: "avengers-endgame",
    title: "Avengers: Endgame",
    year: 2019,
    rating: 8.4,
    image: "/images/endgame.jpg",
    description:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    genre: "Action, Adventure, Drama",
    duration: "181 min",
    director: "Anthony Russo, Joe Russo",
  },
  {
    id: 20,
    slug: "joker",
    title: "Joker",
    year: 2019,
    rating: 8.4,
    image: "/images/joker.jpg",
    description:
      "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
    genre: "Crime, Drama, Thriller",
    duration: "122 min",
    director: "Todd Phillips",
  },
  // Just one fallback movie for development
  {
    id: 1,
    slug: "the-shawshank-redemption",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    image: "/images/shawshank.jpg",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
    genre: "Drama",
    genres: ["Drama"],
    director: "Frank Darabont",
    duration: "142 min"
  }
];

export default moviesService;
