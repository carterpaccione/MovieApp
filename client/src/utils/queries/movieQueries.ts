import { gql } from "@apollo/client";

export const QUERY_MOVIE = gql`
  query movie($imdbID: String!) {
    movie(imdbID: $imdbID) {
      _id
      title
      imdbID
      poster
      ratings {
        _id
        score
        review
        user {
          username
        }
      }
      averageRating
    }
  }
`;
