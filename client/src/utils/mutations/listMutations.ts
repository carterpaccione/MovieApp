import { gql } from "@apollo/client";

export const ADD_MOVIE_TO_LIST = gql`
  mutation addMovieToList($input: AddMovieToListInput!) {
    addMovieToList(input: $input) {
      _id
      name
      owner {
        _id
        username
      }
      movies {
        _id
        imdbID
        title
        poster
      }
    }
  }
`;

export const REMOVE_MOVIE_FROM_LIST = gql`
  mutation removeMovieFromList($input: RemoveMovieFromListInput!) {
    removeMovieFromList(input: $input) {
      _id
      name
      owner {
        _id
        username
      }
      movies {
        _id
        imdbID
        title
        poster
      }
    }
  }
`;
