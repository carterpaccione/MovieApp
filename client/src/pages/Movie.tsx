import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";

import type { Movie } from "../models/Movie.js";
import { QUERY_USER_LIST_DATA } from "../utils/queries/listQueries";
import {
  ADD_MOVIE_TO_LIST,
  REMOVE_MOVIE_FROM_LIST,
} from "../utils/mutations/listMutations";
import { SAVE_MOVIE_TO_DB } from "../utils/mutations/movieMutations";

const Movie = () => {
  const idParams = useParams<{ id: string }>();
  const [addMovieToList] = useMutation(ADD_MOVIE_TO_LIST);
  const [removeMovieFromList] = useMutation(REMOVE_MOVIE_FROM_LIST);
  const [saveMovieToDB] = useMutation(SAVE_MOVIE_TO_DB);
  const [pageMovie, setPageMovie] = useState<Movie | null>(null);

  const {
    data: userListData,
    loading,
    error,
    refetch,
  } = useQuery(QUERY_USER_LIST_DATA);

  const seenList = userListData?.userListData[0]?.movies || [];
  const watchList = userListData?.userListData[1]?.movies || [];

  const isInSeenList = useMemo(() => isMovieInList(seenList, idParams.id), [seenList, idParams.id]);
  const isInWatchList = useMemo(() => isMovieInList(watchList, idParams.id), [watchList, idParams.id]);

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

  const isMovieInList = (list: any[], id: any) => {
    return list.some((movie) => movie.imdbID === id);
  };

  useEffect(() => {
    fetchAPIData();
  }, []);

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

  const handleSaveButton = async (listID: string) => {
    console.log("SAVE ListID: ", listID);
    try {
      const movieData = await saveMovie();
      const updatedList = await addMovieToList({
        variables: {
          input: {
            listID: listID,
            movieID: movieData?.data.saveMovieToDB._id,
          },
        },
      });
      refetch();
      console.log("handleSaveButton() Output:", updatedList);
    } catch (error: any) {
      console.error("Error saving movie:", error);
    }
  };

  const handleRemoveFromList = async (listID: string) => {
    console.log("REMOVE ListID: ", listID);
    try {
      const updatedList = await removeMovieFromList({
        variables: {
          input: {
            listID: listID,
            imdbID: idParams.id,
          },
        },
      });
      refetch();
      console.log("handleRemoveFromSeenList() Output:", updatedList);
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
  console.log("User Data: ", userListData);
  console.log("Movie Data: ", pageMovie);

  return (
    <div>
      <div>
        {isInSeenList ? (
          <button
            onClick={() => handleRemoveFromList(userListData.userListData.find((listObject: any) => (
              listObject.name === "Seen"
            ))._id)}
          >
            - Seen
          </button>
        ) : (
          <button
            onClick={() => handleSaveButton(userListData.userListData[0]._id)}
          >
            + Seen
          </button>
        )}
        {isInWatchList ? (
          <button
            onClick={() => handleRemoveFromList(userListData.userListData[1]._id)}
          >
            - WatchList
          </button>
        ) : (
          <button
            onClick={() => handleSaveButton(userListData.userListData[1]._id)}
          >
            + WatchList
          </button>
        )}
      </div>
      <h1>{pageMovie?.Title}</h1>
      <img src={pageMovie?.Poster} alt={pageMovie?.Title} />
      <p>{pageMovie?.Plot}</p>
    </div>
  );
};

export default Movie;