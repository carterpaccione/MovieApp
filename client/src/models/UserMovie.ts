import { IMovie } from "./Movie.js";
import { IRating } from "./Rating.js";

export enum MovieStatus {
    SEEN = "SEEN",
    WATCH_LIST = "WATCH_LIST",
}

export interface IUserMovie {
    movie: IMovie;
    status: MovieStatus;
    rating: IRating
}