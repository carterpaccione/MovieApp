import { IUserMovie } from "./UserMovie.js";
import { MovieSearch } from "./Movie.js";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    isCorrectPassword(password: string): Promise<boolean>;
    
    movies: IUserMovie[]
    recommendedMovies: MovieSearch[];
    friends?: IUser[];
    createdAt: Date;
}