import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movies/${movie.imdbId}`)}
      className="cursor-pointer transform hover:scale-105 transition duration-300"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="rounded-lg shadow-lg"
      />
      <h2 className="mt-2 text-sm font-semibold text-center">
        {movie.title}
      </h2>
    </div>
  );
}
