import { gql } from 'graphql-tag';

export const ratingTypeDefs = gql`

    type Rating {
        _id: ID!
        movie: Movie!
        user: User!
        score: Int!
        review: String
        createdAt: String
    }

    input RateMovieInput {
        movieID: String
        score: Int
        review: String
    }

    type Mutation {
        addRating(input: RateMovieInput): Rating
        deleteRating(ratingID: ID!): Rating
    }
`;