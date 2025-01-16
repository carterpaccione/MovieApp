import { gql } from '@apollo/client';

export const SAVE_MOVIE_TO_DB = gql`
    mutation saveMovieToDB($input: SaveMovieToDBInput!) {
        saveMovieToDB(input: $input) {
            _id
            imdbID
            title
            poster
        }
    }`;