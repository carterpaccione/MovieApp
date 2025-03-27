import { gql } from 'graphql-tag';

export const movieSearchTypeDefs = gql`
  type MovieSearch {
    Title: String!
    Year: String!
    imdbID: String!
    Type: String!
    Poster: String!
  }
`;