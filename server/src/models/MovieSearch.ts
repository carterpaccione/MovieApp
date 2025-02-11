import { Schema, type Document } from "mongoose";

export interface IMovieSearch extends Document {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export const movieSearchSchema = new Schema<IMovieSearch>({
  Title: { type: String, required: true },
  Year: { type: String, required: true },
  imdbID: { type: String, required: true },
  Type: { type: String, required: true },
  Poster: { type: String, required: true },
});

export default movieSearchSchema;
