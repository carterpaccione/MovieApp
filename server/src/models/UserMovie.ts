import { Schema, type Document } from "mongoose";
import { IMovie } from "./Movie.js";
import { IRating } from "./Rating.js";

export enum MovieStatus {
  SEEN = "SEEN",
  WATCH_LIST = "WATCH_LIST",
  NONE = "NONE",
}

export interface IUserMovie extends Document {
  movie: IMovie;
  status: MovieStatus;
  rating?: IRating;
}

export const userMovieSchema = new Schema<IUserMovie>({
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  status: {
    type: String,
    enum: Object.values(MovieStatus),
    required: true,
  },
  rating: { type: Schema.Types.ObjectId, ref: "Rating", default: null },
});

export default userMovieSchema;
