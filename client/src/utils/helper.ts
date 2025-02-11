import { ImportMeta } from '../components/header.js';

const apiURL = (import.meta as unknown as ImportMeta).env.VITE_API_BASE_URL;

export const fetchMovieByID = async (imdbID: string) => {
  try {
    const response = await fetch(`${apiURL}/api/movies/${imdbID}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
  }
};
