import List from "../../models/List.js";
import Movie from "../../models/Movie.js";
import { IApolloContext } from "../../utils/auth.js";

interface AddMovieToListInput {
  input: {
    listID: string;
    movieID: string;
  };
}

interface RemoveMovieFromListInput {
  input: {
    listID: string;
    imdbID: string;
  };
}

export const ListResolvers = {
  Query: {
    list: async (_parent: any, listID: string) => {
      try {
        const list = List.findOne({ _id: listID });
        if (!list) {
          throw new Error("List not found.");
        }
        return list;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw new Error("Could not fetch list.");
      }
    },
    userListData: async (_parent: any, _args: any, context: IApolloContext) => {
      if (!context.user) {
        throw new Error("You are not logged in.");
      }
      try {
        const lists = List.find({ owner: context.user._id })
          .populate("owner")
          .populate("movies");
        return lists;
      } catch (error) {
        console.error("Error fetching user list data:", error);
        throw new Error("Could not fetch user list data.");
      }
    },
  },
  Mutation: {
    addMovieToList: async (_parent: any, { input }: AddMovieToListInput) => {
      try {
        const updatedList = List.findOneAndUpdate(
          { _id: input.listID },
          { $addToSet: { movies: input.movieID } },
          { runValidators: true, new: true }
        )
          .populate("owner")
          .populate("movies");
        if (!updatedList) {
          throw new Error("Could not find list.");
        }
        return updatedList;
      } catch (error) {
        console.error("Error adding movie to list:", error);
        throw new Error("Could not add movie to list.");
      }
    },
    removeMovieFromList: async (
      _parent: any,
      { input }: RemoveMovieFromListInput
    ) => {
      console.log("Remove Input: ", input);
      try {
        const movieData = await Movie.findOne({ imdbID: input.imdbID });
        if (!movieData) {
          throw new Error("Could not find movie.");
        }
        console.log("Movie Data: ", movieData);
        const listBeforeUpdate = await List.findById(input.listID).populate(
          "movies"
        );
        console.log("List Before Update: ", listBeforeUpdate);
        const updatedList = await List.findOneAndUpdate(
          { _id: input.listID },
          { $pull: { movies: movieData._id } },
          { runValidators: true, new: true }
        )
          .populate("owner")
          .populate("movies");
        if (!updatedList) {
          throw new Error("Could not find list.");
        }
        console.log("Updated List: ", updatedList);
        return updatedList;
      } catch (error) {
        console.error("Error removing movie from list:", error);
        throw new Error("Could not remove movie from list.");
      }
    },
  },
};
