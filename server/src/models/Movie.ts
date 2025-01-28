import { Schema, model, type Document } from "mongoose";
import { IRating } from "./Rating.js";

export interface IMovie extends Document {
  _id: string;
  title: string;
  imdbID: string;
  poster: string;
  ratings: IRating[];
  calculateAverageRating(): number;
  averageRating: number;
}

export const movieSchema: Schema<IMovie> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  imdbID: {
    type: String,
    required: true,
    unique: true,
  },
  poster: {
    type: String,
    required: true,
  },
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
});

movieSchema.methods.calculateAverageRating = function () {
  console.log("This ratings: ", this.ratings);
  console.log(
    "Ratings: ",
    this.ratings.map((rating: IRating) => rating.score)
  );
  if (!this.ratings || this.ratings.length === 0) {
    this.averageRating = 0; // Set to 0 if no ratings
    return;
  }

  const validScores = this.ratings
    .filter(
      (rating: IRating) => rating.score !== undefined && !isNaN(rating.score)
    )
    .map((rating: IRating) => rating.score);

  if (validScores.length === 0) {
    this.averageRating = 0; // Set to 0 if all scores are invalid
    return this.averageRating;
  }

  const averageRating =
    validScores.reduce((a: number, b: number) => a + b, 0) / validScores.length;

  console.log("Average rating: ", averageRating);
  this.averageRating = averageRating;
  console.log("This.averageRating: ", this.averageRating);
  return averageRating;
};

movieSchema.pre("save", function (next) {
  this.averageRating = this.calculateAverageRating();
  next();
});

const Movie = model<IMovie>("Movie", movieSchema);

export default Movie;
