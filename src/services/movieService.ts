import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const BEARER_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchMovies = async (query: string, page: number): Promise<MovieResponse> => {
  if (!BEARER_TOKEN) {
    throw new Error('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file.');
  }

  if (!query || !query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  if (page < 1 || page > 500) {
    throw new Error('Page number must be between 1 and 500');
  }

  try {
    const response = await apiClient.get<MovieResponse>('/search/movie', {
      params: {
        query: query.trim(),
        include_adult: false,
        language: 'en-US',
        page: Math.min(page, 500),
      },
    });

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Invalid response format from TMDB API');
    }

    return {
      ...response.data,
      total_pages: Math.min(response.data.total_pages, 500),
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;

      if (status) {
        switch (status) {
          case 401:
            throw new Error('Invalid TMDB API key. Please check your Bearer Token in the .env file.');
          case 403:
            throw new Error('Access denied. Please check your TMDB API permissions.');
          case 404:
            throw new Error('TMDB API endpoint not found.');
          case 429:
            throw new Error('Too many requests. Please wait a moment and try again.');
          case 500:
          case 502:
          case 503:
          case 504:
            throw new Error('TMDB server error. Please try again later.');
          default:
            throw new Error(`Request failed: ${status} - ${statusText || 'Unknown error'}`);
        }
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }

      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection.');
      }

      throw new Error(`Request failed: ${error.message}`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred while fetching movies.');
  }
};
