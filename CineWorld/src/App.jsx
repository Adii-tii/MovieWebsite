import React from "react";
import Search from "./components/search";
import { useEffect, useState } from "react";
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCards";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [Isloading, setIsLoading] = useState(false);

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

    } catch (error) {
      console.log(`error fetching movies! : ${error}`);
      setErrorMessage('error fetching movies please try again later');
    } finally{
      setIsLoading(false);
    }
  }

  useEffect( () => {
    fetchMovies((searchTerm));
  },[searchTerm])

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
        <section className="all-movies">
          <h2 className="mt-[40px]">All movies</h2>

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