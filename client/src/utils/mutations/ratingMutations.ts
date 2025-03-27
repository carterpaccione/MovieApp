import { gql } from "@apollo/client";

export const ADD_RATING = gql`
  mutation addRating($input: RateMovieInput) {
    addRating(input: $input) {
      _id
      score
      review
      createdAt
    }
  }
`;

export const DELETE_RATING = gql`
  mutation deleteRating($ratingID: ID!) {
    deleteRating(ratingID: $ratingID) {
      _id
    }
  }
`;
