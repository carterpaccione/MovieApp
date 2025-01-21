import { IMovie } from './Movie.js';
import { IUser } from './User.js';

export interface IRating {
    _id: string;
    movie: IMovie;
    user: IUser;
    score: number;
    review?: string;
    createdAt: Date;
}