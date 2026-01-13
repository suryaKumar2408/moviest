import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MOVIE_API = "http://localhost:8080/api/v1/movies";
const REVIEW_API = "http://localhost:8080/api/v1/reviews";

export default function MovieDetail() {
  const { imdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviewBody, setReviewBody] = useState("");

  useEffect(() => {
    axios.get(`${MOVIE_API}/${imdbId}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [imdbId]);

  const submitReview = async () => {
    if (!reviewBody.trim()) return;

    await axios.post(REVIEW_API, {
      imdbId,
      reviewBody
    });

    setReviewBody("");

  
    const updated = await axios.get(`${MOVIE_API}/${imdbId}`);
    setMovie(updated.data);
  };

  if (!movie) return <div className="p-6">Loading...</div>;
  const getEmbedUrl = (url) => {
  if (!url) return "";
  const videoId = url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}`;
};


  return (
    <div className="p-6 space-y-6">
      
      <div className="aspect-video">
         <iframe
  className="w-full h-full rounded-lg"
  src={getEmbedUrl(movie.trailerLink)}
  title="Trailer"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>

      </div>

      <h1 className="text-3xl font-bold">{movie.title}</h1>

      <div className="flex flex-wrap gap-2">
        {movie.genres.map((genre, index) => (
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

        <div className="space-y-4">
          {movie.reviewIds.map(review => (
            <div
              key={review.id}
              className="bg-zinc-900 p-4 rounded-lg"
            >
              {review.body}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <textarea
            value={reviewBody}
            onChange={e => setReviewBody(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-zinc-800 p-3 rounded-lg text-white"
            rows={3}
          />

          <button
            onClick={submitReview}
            className="mt-3 bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
