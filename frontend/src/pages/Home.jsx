import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1/movies`;

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(API_BASE)
      .then(res => setMovies(res.data))
      .catch(err => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Movies</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.imdbId} movie={movie} />
        ))}
      </div>
    </div>
  );
}
