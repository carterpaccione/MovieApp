import { AuthenticationError } from "../../utils/auth.js";
import Friendship from "../../models/Friendship.js";
import { IUser } from "../../models/User.js";

interface Context {
  user?: IUser | null;
}

interface NewFriendshipInput {
  input: {
    recipientId: string;
  };
}

export const FriendshipResolvers = {
  Mutation: {
    addFriend: async (
      _parent: any,
      { input }: NewFriendshipInput,
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        return await Friendship.create({
          requesterId: context.user._id,
          recipentId: input.recipientId,
          status: "pending",
        });
      } catch (error) {
        console.error("Error creating friendship:", error);
        throw new Error("Could not create friendship.");
      }
    },
    acceptFriend: async (
      _parent: any,
      { friendshipId }: { friendshipId: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        return await Friendship.findOneAndUpdate(
          { _id: friendshipId },
          { status: "accepted" },
          { new: true }
        );
      } catch (error) {
        console.error("Error accepting friend:", error);
        throw new Error("Could not accept friend.");
      }
    },
    rejectFriend: async (
      _parent: any,
      { friendshipId }: { friendshipId: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        return await Friendship.findOneAndUpdate(
          { _id: friendshipId },
          { status: "rejected" },
          { new: true }
        );
      } catch (error) {
        console.error("Error rejecting friend:", error);
        throw new Error("Could not reject friend.");
      }
    },
  },
};
