import React from "react";
import Search from "./components/search";
import { useEffect, useState } from "react";
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCards";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

//create a debounce function here
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [Isloading, setIsLoading] = useState(false);
  const [debouncedSearchterm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // makes the user stop for 500ms to prevent overloading the server from which data is fetched
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const fetchMovies = async(query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`:
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch movies!');
      }

      const data = await response.json();

      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(`error fetching movies! : ${error}`);
      setErrorMessage('error fetching movies please try again later');
    } finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect( () => {
    fetchMovies((debouncedSearchterm));
  },[debouncedSearchterm])

  useEffect( () => {
    loadTrendingMovies();
  }, [])

  return ( 
    <main>
      <div>
        <div className="pattern"></div>
        <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner"></img>
          <h1>Find <span className="text-gradient">Movies</span> you enjoy without the hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Search>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All movies</h2>

          {Isloading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
        </div>
      </div>
    </main>
   );
}
 
export default App;