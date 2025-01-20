import { Schema, type Document } from "mongoose";
import { IMovie } from "./Movie.js";

export enum MovieStatus {
  SEEN = "SEEN",
  WATCH_LIST = "WATCH_LIST",
}

export interface IUserMovie extends Document {
  movie: IMovie;
  status: MovieStatus;
}

export const userMovieSchema = new Schema<IUserMovie>({
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  status: {
    type: String,
    enum: Object.values(MovieStatus),
    required: true,
  },
});

export default userMovieSchema;
