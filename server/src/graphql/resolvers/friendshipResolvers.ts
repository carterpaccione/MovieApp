import { AuthenticationError, IApolloContext } from "../../utils/auth.js";
import Friendship from "../../models/Friendship.js";
import User from "../../models/User.js";

export const FriendshipResolvers = {
  Query: {
    friendshipStatus: async (
      _parent: any,
      { userID }: { userID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      console.log("PARAMS: ", userID, context.user._id);
      try {
        const friendship = await Friendship.findOne({
          $or: [
            { requester: context.user._id, recipient: userID },
            { requester: userID, recipient: context.user._id },
          ],
        }).populate([
          {
            path: "requester",
            select: "username _id",
          },
          {
            path: "recipient",
            select: "username _id",
          },
          "status",
        ]);
        if (!friendship) {
          console.log("No friendship found.");
          throw new Error("No friendship found.");
        }
        console.log("FRIENDSHIP:", friendship);
        return friendship;
      } catch (error) {
        console.error("Error fetching Friendship Status:", error);
        throw new Error("Could not Friendship Status.");
      }
    },
  },
  Mutation: {
    addFriend: async (
      _parent: any,
      { recipientID }: { recipientID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const response = await Friendship.create({
          requester: context.user._id,
          recipient: recipientID,
          status: "PENDING",
        });
        console.log("ADD FRIEND RESPONSE:", response);
        return response;
      } catch (error) {
        console.error("Error creating friendship:", error);
        throw new Error("Could not create friendship.");
      }
    },
    acceptFriend: async (
      _parent: any,
      { friendshipID }: { friendshipID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const updatedFriendship = await Friendship.findOneAndUpdate(
          { _id: friendshipID },
          { status: "ACCEPTED" },
          { new: true }
        ).populate([
          {
            path: "requester",
            select: "username _id",
          },
          {
            path: "recipient",
            select: "username _id",
          },
          "status",
        ]);
        const updatedRequester = await User.findOneAndUpdate(
          { _id: updatedFriendship?.requester._id },
          { $addToSet: { friends: context.user._id } },
          { new: true }
        );
        if (!updatedRequester) throw new Error("User not found.");
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: updatedFriendship?.requester._id } },
          { new: true }
        );
        if (!updatedUser) throw new Error("User not found.");
        console.log("ACCEPT FRIEND RESPONSE:", updatedFriendship);
        return updatedFriendship;
      } catch (error) {
        console.error("Error accepting friend:", error);
        throw new Error("Could not accept friend.");
      }
    },
    rejectFriend: async (
      _parent: any,
      { friendshipID }: { friendshipID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        return await Friendship.findOneAndUpdate(
          { _id: friendshipID },
          { status: "REJECTED" },
          { new: true }
        ).populate([
          {
            path: "requester",
            select: "username _id",
          },
          {
            path: "recipient",
            select: "username _id",
          },
          "status",
        ]);
      } catch (error) {
        console.error("Error rejecting friend:", error);
        throw new Error("Could not reject friend.");
      }
    },
    deleteRequest: async (
      _parent: any,
      { friendshipID }: { friendshipID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const friendRequest = await Friendship.findById(friendshipID);
        if (!friendRequest) {
          throw new Error("Friend request not found.");
        }
        await Friendship.findByIdAndDelete(friendshipID);
        return context.user._id;
      } catch (error) {
        console.error("Error deleting request:", error);
        throw new Error("Could not delete request.");
      }
    },
    removeFriend: async (
      _parent: any,
      { friendshipID }: { friendshipID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const friendship = await Friendship.findByIdAndDelete(friendshipID);
        if (!friendship) {
          throw new Error("Friendship not found.");
        }
        const updatedUserOne = await User.findOneAndUpdate(
          { _id: friendship.requester },
          { $pull: { friends: friendship.recipient } },
          { new: true }
        );
        if (!updatedUserOne) {
          throw new Error("UserOne not found.");
        }
        const updatedUserTwo = await User.findOneAndUpdate(
          { _id: friendship.recipient },
          { $pull: { friends: friendship.requester } },
          { new: true }
        );
        if (!updatedUserTwo) {
          throw new Error("UserTwo not found.");
        }
        return context.user;
      } catch (error) {
        console.error("Error removing friend:", error);
        throw new Error("Could not remove friend.");
      }
    },
  },
};
