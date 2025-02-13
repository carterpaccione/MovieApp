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
          averageRating
        }
        status
        rating {
          score
          review
        }
      }
      friends {
        _id
        username
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

export const QUERY_USER_RECOMMENDATIONS = gql`
  query userRecommendations {
    userRecommendations {
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
      friends {
        _id
        username
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
        averageRating
      }
      status
      rating {
        _id
        score
        review
      }
    }
  }
`;

export const QUERY_USER_LIST_DATA = gql`
  query userListData {
    userListData {
      movies {
        movie {
          title
          imdbID
        }
        status
        rating {
          score
        }
      }
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUsers($query: String!) {
    searchUsers(query: $query) {
      _id
      username
    }
  }
`;