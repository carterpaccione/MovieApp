import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import type { Movie, IMovie } from "../models/Movie.js";
import type { IUserMovie } from "../models/UserMovie.js";
import { QUERY_MOVIE } from "../utils/queries/movieQueries.js";
import { QUERY_USER_MOVIE_DATA } from "../utils/queries/userQueries.js";
import { SAVE_MOVIE_TO_DB } from "../utils/mutations/movieMutations";
import {
  ADD_TO_SEEN,
  REMOVE_FROM_SEEN,
} from "../utils/mutations/userMutations";

const Movie = () => {
  const idParams = useParams<{ id: string }>();
  const [saveMovieToDB] = useMutation(SAVE_MOVIE_TO_DB);
  const [addToSeen] = useMutation(ADD_TO_SEEN);
  const [removeFromSeen] = useMutation(REMOVE_FROM_SEEN);
  const [pageMovie, setPageMovie] = useState<Movie | null>(null);

  const fetchAPIData = async () => {
    if (idParams.id) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/movies/${idParams.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPageMovie(data);
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchAPIData();
  }, []);

  const { data: dbMovie } = useQuery<{ movie: IMovie }>(QUERY_MOVIE, {
    variables: { imdbID: idParams.id },
  });
  const {
    data: userMovieData,
    loading,
    error,
    refetch,
  } = useQuery<{ userMovieData: IUserMovie }>(QUERY_USER_MOVIE_DATA, {
    variables: { movieID: dbMovie?.movie._id },
  });

  const saveMovie = async () => {
    try {
      const movieData = await saveMovieToDB({
        variables: {
          input: {
            title: pageMovie?.Title,
            imdbID: pageMovie?.imdbID,
            poster: pageMovie?.Poster,
          },
        },
      });
      console.log("saveMovie() Output: ", movieData);
      return movieData;
    } catch (error: any) {
      console.error("Error saving movie:", error);
    }
  };

  const handleSaveButton = async () => {
    try {
      const movieData = await saveMovie();
      await addToSeen({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      refetch();
      console.log("handleSaveButton() Output:", movieData);
    } catch (error: any) {
      console.error("Error saving movie:", error);
    }
  };

  const handleRemoveButton = async () => {
    try {
      await removeFromSeen({ variables: { movieID: dbMovie?.movie._id } });
      refetch();
    } catch (error: any) {
      console.error("Error removing movie:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error("Error fetching User Data:", error);
  }
  console.log("DB Movie: ", dbMovie);
  console.log("UserMovie Data: ", userMovieData);
  console.log("Movie Data: ", pageMovie);

  return (
    <div>
      <div>
        {userMovieData? (
          userMovieData.userMovieData?.status === "SEEN" ? (
            <button onClick={() => handleRemoveButton()}>Mark Unseen</button>
          ) : (
            <button onClick={() => handleSaveButton()}>Mark Seen</button>
          )
        ) : (
          <button onClick={() => handleSaveButton()}>Mark Seen</button>
        )}
      </div>
      <h1>{pageMovie?.Title}</h1>
      <img src={pageMovie?.Poster} alt={pageMovie?.Title} />
      <p>{pageMovie?.Plot}</p>
    </div>
  );
};

export default Movie;
