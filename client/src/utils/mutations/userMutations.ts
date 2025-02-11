import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($input: NewUserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($input: LoginUserInput!) {
    login(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_TO_SEEN = gql`
  mutation addToSeen($movieID: ID!) {
    addToSeen(movieID: $movieID) {
      _id
      username
      email
      movies {
        movie {
          _id
          title
          imdbID
        }
        status
      }
    }
  }
`;

export const ADD_TO_WATCHLIST = gql`
  mutation addToWatchList($movieID: ID!) {
    addToWatchList(movieID: $movieID) {
      _id
      username
      email
      movies {
        movie {
          _id
          title
          imdbID
        }
        status
      }
    }
  }
`;

export const REMOVE_FROM_USER = gql`
  mutation removeFromUser($movieID: ID!) {
    removeFromUser(movieID: $movieID) {
      _id
      username
      email
      movies {
        movie {
          _id
          title
          imdbID
        }
        status
      }
    }
  }
`;

export const SET_RECOMMENDATIONS = gql`
  mutation setRecommendations($input: SetRecsInputWrapper!) {
    setRecommendations(input: $input) {
      _id
      username
      email
      movies {
        movie {
          _id
          title
          imdbID
        }
        status
      }
      recommendedMovies {
        imdbID
        Title
        Year
        Type
        Poster
      }
    }
  }
`;
