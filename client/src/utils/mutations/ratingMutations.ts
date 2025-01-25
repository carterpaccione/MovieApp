import { gql } from '@apollo/client';

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