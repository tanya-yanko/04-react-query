import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const notifyError = () =>
    toast.error("No movies found for your request.", {
      style: { background: "rgba(125, 183, 255, 0.8)" },
      icon: "ℹ️",
    });

  const openModal = (movies: Movie) => {
    setSelectedMovie(movies);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (newQuery: string) => {
    try {
      setIsLoading(true);
      setError(false);
      const newMovies = await fetchMovies(newQuery);
      if (newMovies.length === 0) {
        notifyError();
      }

      setMovies(newMovies);
    } catch {
      setError(true);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      {selectedMovie !== null && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}