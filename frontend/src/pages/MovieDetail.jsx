import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function MovieDetail() {
  const { imdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviewBody, setReviewBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/v1/movies/${imdbId}`
        );
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to load movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbId]);

  const submitReview = async () => {
    if (!reviewBody.trim()) return;

    try {
      await axios.post(`${API_BASE}/api/v1/reviews`, {
        imdbId,
        reviewBody,
      });

      setReviewBody("");

      const updated = await axios.get(
        `${API_BASE}/api/v1/movies/${imdbId}`
      );
      setMovie(updated.data);
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!movie) return <div className="p-6">Movie not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={getEmbedUrl(movie.trailerLink)}
          title="Trailer"
          allowFullScreen
        />
      </div>

      <h1 className="text-3xl font-bold">{movie.title}</h1>

      <div className="flex flex-wrap gap-2">
        {movie.genres?.map((genre, index) => (
          <span
            key={index}
            className="bg-red-600 px-3 py-1 rounded-full text-sm"
          >
            {genre}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        <div className="space-y-4 mb-6">
          {movie.reviewIds && movie.reviewIds.length > 0 ? (
            movie.reviewIds.map((review, index) => (
              <div key={index} className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <p className="text-gray-200">{review.body}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </div>

        <div className="mt-6">
          <textarea
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-zinc-800 p-3 rounded-lg text-white border border-zinc-700 focus:ring-2 focus:ring-red-600 outline-none"
            rows={3}
          />

          <button
            onClick={submitReview}
            className="mt-3 bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}