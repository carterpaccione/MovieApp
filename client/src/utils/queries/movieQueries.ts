import { gql } from "@apollo/client";

export const QUERY_MOVIE = gql`
  query movie($imdbID: String!) {
    movie(imdbID: $imdbID) {
      _id
      title
      imdbID
      poster
      averageRating
      ratings {
        _id
        score
        review
        user {
          _id
          username
        }
        createdAt
      }
      averageRating
    }
  }
`;
