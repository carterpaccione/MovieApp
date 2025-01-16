import { gql } from 'graphql-tag';

export const movieTypeDefs = gql`

    type Movie {
        _id: ID!
        title: String
        imdbID: String
        poster: String
        ratings: [Rating]
        averageRating: Float
    }

    input SaveMovieToDBInput {
        title: String!
        imdbID: String!
        poster: String!
    }

    type Query {
        movie(imdbID: String!): Movie
    }

    type Mutation {
        saveMovieToDB(input: SaveMovieToDBInput!): Movie
        rateMovie(movieID: ID!, rating: Float!, review: String): Movie
    }
`;