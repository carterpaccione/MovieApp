export const fetchMovieByID = async (imdbID: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/movies/${imdbID}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
  }
};
