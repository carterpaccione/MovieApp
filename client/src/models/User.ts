import { IUserMovie } from "./UserMovie";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    isCorrectPassword(password: string): Promise<boolean>;
    
    movies: IUserMovie[]
    friends?: IUser[];
    createdAt: Date;
}