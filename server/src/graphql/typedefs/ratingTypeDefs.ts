import { gql } from 'graphql-tag';

export const ratingTypeDefs = gql`

    scalar DateTime
    
    type Rating {
        _id: ID!
        movie: Movie!
        user: User!
        score: Int!
        review: String
        createdAt: DateTime
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