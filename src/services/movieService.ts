import { type Movie } from "../types/movie.ts";

import axios from "axios";

export interface GetMovieRes {
  results: Movie[];
}
export const axiosConfig = {
  url: "https://api.themoviedb.org/3/search/movie",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};
export const fetchMovies = async (newQuery: string): Promise<Movie[]> => {
  const res = await axios.get<GetMovieRes>(
    `${axiosConfig.url}?query=${newQuery}`,
    axiosConfig
  );
  return res.data.results;
};