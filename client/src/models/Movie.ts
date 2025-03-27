import { IRating } from './Rating.js';

export interface MovieSearch {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface Movie {
    Actors: string;
    Awards: string;
    BoxOffice: string;
    Country: string;
    DVD: string;
    Director: string;
    Genre: string;
    Language: string;
    Metascore: string;
    Plot: string;
    Poster: string;
    Production: string;
    Rated: string;
    Ratings: [{
        Source: string;
        Value: string;
    }];
    Released: string;
    Response: string;
    Runtime: string;
    Title: string;
    Type: string;
    Website: string;
    Writer: string;
    Year: string;
    imdbID: string;
    imdbRating: string;
    imdbVotes: string;
}

export interface IMovie {
    _id: string;
    title: string;
    imdbID: string;
    poster: string;
    ratings?: IRating[];
    calculateAverageRating(): number;
    averageRating: number;
}

export interface IUserMovie {
    movie: IMovie;
    status: string;
    rating: IRating;
}

export interface SeenMovie {
    movie: {
      imdbID: string;
      title: string;
    };
    rating: {
      score: number;
    };
    status: string;
  }
  
  export interface Recommendation {
    title: string;
    year: string;
    imdbID: string;
    poster: string;
  }