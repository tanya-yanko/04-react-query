import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService.ts";
import type { Movie } from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

type MovieObj = Movie | null;

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}


export default function App() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<MovieObj>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isError, isLoading, isSuccess } = useQuery<MovieResponse>({
    queryKey: ['myQueryKey', searchValue, currentPage],
    queryFn: () => fetchMovies(searchValue, currentPage),
    enabled: !!searchValue && searchValue.trim().length > 0,
    staleTime: 5 * 60 * 1000, 
    placeholderData: (previousData) => previousData,
  });

  function handleGet(value: string): void {
    setSearchValue(value);
    setCurrentPage(1);
  }
  
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isSuccess]);

  function openModal(movie: Movie): void {
    setSelectedMovie(movie);
  }

  function closeModal(): void {
    setSelectedMovie(null);
  }

  const shouldShowPagination = 
    typeof data?.total_pages === 'number' && 
    data.total_pages > 1 && 
    !isError && 
    !isLoading;

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleGet} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {isSuccess && data?.results && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {shouldShowPagination && (
        <ReactPaginate 
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}