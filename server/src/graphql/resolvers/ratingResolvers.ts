import { AuthenticationError, IApolloContext } from "../../utils/auth.js";
import Movie from "../../models/Movie.js";
import Rating from "../../models/Rating.js";
import User from "../../models/User.js";

interface RateMovieInput {
  input: {
    movieID: string;
    score: number;
    review: string;
  };
}

export const RatingResolvers = {
  Mutation: {
    addRating: async (
      _parent: any,
      { input }: RateMovieInput,
      context: IApolloContext
    ) => {
      console.log("Input: ", input);
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        // Make sure the Movie is in our database.
        const movie = await Movie.findOne({
          _id: input.movieID
        });
        if (!movie) {
          throw new Error("You must mark the movie as seen before rating it.");
        }
        // Check if the User has already rated the Movie.
        const existingRating = await Rating.findOne({ user: context.user._id, movie: movie._id });
        if (existingRating) {
          existingRating.score = input.score;
          existingRating.review = input.review;
          return await existingRating.save();
        }
        // Create the Rating.
        const rating = await Rating.create({
          user: context.user._id,
          movie: movie._id,
          score: input.score,
          review: input.review,
        });
        // Update the User's movies array @ movieID with the rating.
        const userUpdateResult = await User.findOneAndUpdate(
          { _id: context.user._id, "movies.movie": movie._id },
          { $set: { "movies.$.rating": rating._id } },
          { new: true }
        );
        console.log("Update result:", userUpdateResult);
        // Update the Movie's ratings array with the rating.
        const result = await Movie.findByIdAndUpdate({ _id: movie._id},
          {
            $push: { ratings: rating._id },
          },
          { new: true }
        ).populate([
          {
            path: "ratings",
            select: "score review createdAt",
            populate: {
              path: "user",
              select: "username",
            }
          }
        ]);
        console.log("Result: ", result);
        return result;
      } catch (error) {
        console.error("Error adding rating:", error);
        throw new Error("Could not add rating.");
      }
    },
  },
};
