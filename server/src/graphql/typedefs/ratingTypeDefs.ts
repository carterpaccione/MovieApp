import { gql } from 'graphql-tag';

export const ratingTypeDefs = gql`

    type Rating {
        _id: ID!
        movie: Movie
        user: User
        score: Int
        review: String
    }

    input NewRatingInput {
        movieID: ID!
        score: Int!
    }

    input NewReviewInput {
        movieID: ID!
        review: String!
    }

    type Mutation {
        addRating(input: NewRatingInput): Movie
        addReview(input: NewReviewInput): Movie
    }
`;