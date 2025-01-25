import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      movies {
        movie {
          _id
          title
          imdbID
          poster
        }
        status
        rating {
          score
          review
        }
      }
    }
  }
`;

export const QUERY_USER_BY_ID = gql`
  query userByID($userID: ID!) {
    userByID(userID: $userID) {
      _id
      username
      movies {
        movie {
          _id
          title
          imdbID
          poster
        }
        status
        rating {
          score
          review
        }
      }
    }
  }
`;

export const QUERY_USER_MOVIE_DATA = gql`
  query userMovieData($movieID: ID!) {
    userMovieData(movieID: $movieID) {
      movie {
        _id
        title
        imdbID
      }
      status
    }
  }
`;
