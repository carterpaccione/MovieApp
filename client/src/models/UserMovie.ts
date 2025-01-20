import { IMovie } from "./Movie.js";

export enum MovieStatus {
    SEEN = "SEEN",
    WATCH_LIST = "WATCH_LIST",
}

export interface IUserMovie {
    movie: IMovie;
    status: MovieStatus;
}