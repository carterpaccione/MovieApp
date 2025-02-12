import { Schema } from "mongoose";

interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  friends: IUser[];
  movies: IUserMovie[];
  recommendedMovies: IMovieSearch[];
}

interface IMovieSearch {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

enum MovieStatus {
  SEEN = "SEEN",
  WATCH_LIST = "WATCH_LIST",
  NONE = "NONE",
}

interface IUserMovie {
  movie: Movie;
  status: MovieStatus;
  rating: number;
}

interface IMovie {
  _id: Schema.Types.ObjectId;
  title: string;
  imdbID: string;
  poster: string;
  ratings: IRating[];
  calculateAverageRating(): number;
  averageRating: number;
}

interface IRating {
  _id: Schema.Types.ObjectId;
  movie: IMovie;
  user: IUser;
  score: number;
  review?: string;
  createdAt: Date;
}

enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

interface Friendship {
  requester: IUser;
  recipient: IUser;
  status: FriendshipStatus;
  createdAt: Date;
}

export type { IUser, IMovieSearch, MovieStatus, IUserMovie, IMovie, IRating, Friendship, FriendshipStatus };
