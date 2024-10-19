import { Response, NextFunction } from "express";
import { AuthRequest, StatusError } from "../types/types";
import { user, UserDB } from "../models/user";
import { SplitDB } from "../models/split";
import { ConnectionDB } from "../models/connections";
import { validationResult } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import {
  FriendRequestAcceptedMail,
  FriendRequestMail,
  FriendRequestRejectedMail,
  FriendRemovedMail,
} from "../emails/email.templates";

export async function fetchUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    res.status(200).json({ success: true, data: user.data() });
  } catch (error) {
    next(error);
  }
}

export async function createSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // validating input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        `Validation Error! ${errors.array()[0].msg}`
      ) as StatusError;
      error.statusCode = 422;
      throw error;
    }

    const user = req.user! as user;
    const { name, amount, description, splitWith } = req.body;

    const user_friends = user.friends.map((friend) => friend.user.toString());
    // Checking if all users in splitWith are connected
    (splitWith as string[]).forEach(async (id: string) => {
      //checking if Id is valdi ObjectId
      if (!isValidObjectId(id)) {
        const error = new Error("Invalid User ID") as StatusError;
        error.statusCode = 400;
        throw error;
      }
      if (!user_friends.includes(id)) {
        const error = new Error("User not connected") as StatusError;
        error.statusCode = 400;
        throw error;
      }
    });

    // Creating split
    const eachAmount = amount / (splitWith.length + 1);
    const percentage = 100 / (splitWith.length + 1);
    const split = new SplitDB({
      name,
      amount,
      description,
      splitWith: (splitWith as string[]).map((id) => ({
        user: new Types.ObjectId(id),
        amount: eachAmount,
        percentage,
      })),
      createdBy: user._id,
    });
    await split.save();
    split.notify_all();
    res
      .status(201)
      .json({ success: true, message: "Split created", data: split });
  } catch (error) {
    next(error);
  }
}

export async function createPercentageSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // validating input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        `Validation Error! ${errors.array()[0].msg}`
      ) as StatusError;
      error.statusCode = 422;
      throw error;
    }

    const user = req.user! as user;
    const { name, amount, description, splitWith } = req.body;

    const user_friends = user.friends.map((friend) => friend.user.toString());

    let totalPercentage = 0;
    // Checking if all users in splitWith are connected
    (splitWith as { user_id: string; percentage: number }[]).forEach(
      async ({ user_id, percentage }) => {
        //checking if Id is valdi ObjectId
        if (!isValidObjectId(user_id)) {
          const error = new Error("Invalid User ID") as StatusError;
          error.statusCode = 400;
          throw error;
        }
        // checking percentage
        if (percentage > 100 || percentage < 0) {
          const error = new Error("Invalid Percentage") as StatusError;
          error.statusCode = 400;
          throw error;
        }
        if (!user_friends.includes(user_id)) {
          const error = new Error("User not connected") as StatusError;
          error.statusCode = 400;
          throw error;
        }
        totalPercentage += percentage;
      }
    );
    if (totalPercentage !== 100) {
      const error = new Error("Total Percentage should be 100") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    // Creating split
    const split = new SplitDB({
      name,
      amount,
      description,
      splitWith: (splitWith as { user_id: string; percentage: number }[]).map(
        ({ user_id, percentage }) => ({
          user: new Types.ObjectId(user_id),
          amount: (amount * percentage) / 100,
          percentage,
        })
      ),
      createdBy: user._id,
    });
    await split.save();
    split.notify_all();
    res
      .status(201)
      .json({ success: true, message: "Split created", data: split });
  } catch (error) {
    next(error);
  }
}

export async function createCustomSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // validating input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        `Validation Error! ${errors.array()[0].msg}`
      ) as StatusError;
      error.statusCode = 422;
      throw error;
    }

    const user = req.user! as user;
    const { name, description, splitWith } = req.body;

    const user_friends = user.friends.map((friend) => friend.user.toString());

    let totalAmount = 0;
    // Checking if all users in splitWith are connected
    (splitWith as { user_id: string; amount: number }[]).forEach(
      async ({ user_id, amount }) => {
        //checking if Id is valdi ObjectId
        if (!isValidObjectId(user_id)) {
          const error = new Error("Invalid User ID") as StatusError;
          error.statusCode = 400;
          throw error;
        }
        if (!user_friends.includes(user_id)) {
          const error = new Error("User not connected") as StatusError;
          error.statusCode = 400;
          throw error;
        }
        totalAmount += amount;
      }
    );

    if (totalAmount <= 0) {
      const error = new Error("Invalid Amount") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const split = new SplitDB({
      name,
      amount: totalAmount,
      description,
      splitWith: (splitWith as { user_id: string; amount: number }[]).map(
        ({ user_id, amount }) => ({
          user: new Types.ObjectId(user_id),
          amount,
          percentage: (amount / totalAmount) * 100,
        })
      ),
      createdBy: user._id,
    });
    await split.save();
    split.notify_all();
    res
      .status(201)
      .json({ success: true, message: "Split created", data: split });
  } catch (error) {
    next(error);
  }
}

export async function fetchSplits(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const fetch = req.query.fetch as string | undefined;
    // if fetch is not provided, fetch all splits
    // if fetch is "created", fetch splits created by user
    // if fetch is "received", fetch splits user is part of
    // if fetch is "all", fetch all splits

    let splits;
    if (fetch === "created") {
      splits = await SplitDB.find({ createdBy: user._id });
    } else if (fetch === "received") {
      splits = await SplitDB.find({
        "splitWith.user": user._id,
      });
    } else {
      splits = await SplitDB.find({
        $or: [{ createdBy: user._id }, { "splitWith.user": user._id }],
      });
    }

    res.status(200).json({ success: true, data: splits });
  } catch (error) {
    next(error);
  }
}

export async function fetchSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const id = req.params.splitId;

    if (!isValidObjectId(id)) {
      const error = new Error("Invalid Split ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const split = await SplitDB.findById(id);
    if (!split) {
      const error = new Error("Split not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (
      !split.createdBy.toString() === user.id &&
      !split.splitWith.find(
        (splitwithin) => splitwithin.user_id.toString() === user.id
      )
    ) {
      const error = new Error("Unauthorized") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ success: true, data: split });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatusInSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const id = req.params.splitId;
    const { userId } = req.params;
    const status = req.query.status as string | undefined;

    if (!isValidObjectId(id)) {
      const error = new Error("Invalid Split ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const split = await SplitDB.findById(id);
    if (!split) {
      const error = new Error("Split not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (split.createdBy.toString() !== user.id) {
      const error = new Error("Unauthorized") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    let userFound = false;
    split.splitWith = split.splitWith.map((splitwithin) => {
      if (splitwithin.user_id.toString() === userId) {
        userFound = true;
        if (status === "paid") {
          splitwithin.ispaid = true;
        } else if (status === "unpaid") {
          splitwithin.ispaid = false;
        } else {
          splitwithin.ispaid = !splitwithin.ispaid;
        }
      }
      return splitwithin;
    });

    if (!userFound) {
      const error = new Error("User not found in split") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Split updated" });
  } catch (error) {
    next(error);
  }
}

export async function settleSplit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const id = req.params.splitId;

    if (!isValidObjectId(id)) {
      const error = new Error("Invalid Split ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const split = await SplitDB.findById(id);
    if (!split) {
      const error = new Error("Split not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (split.createdBy.toString() !== user.id) {
      const error = new Error("Unauthorized") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    await split.settle();

    res.status(200).json({ success: true, message: "Split settled" });
  } catch (error) {
    next(error);
  }
}

export async function fetchAllFriends(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    res
      .status(200)
      .json({ success: true, message: "Friends fetched", data: user.friends });
  } catch (error) {
    next(error);
  }
}

export async function fetchFriend(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const id = req.params.friendId;

    if (!isValidObjectId(id)) {
      const error = new Error("Invalid Friend ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const friend = user.friends.find((friend) => friend.user.toString() === id);
    if (!friend) {
      const error = new Error("Friend not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    res
      .status(200)
      .json({ success: true, message: "Friend fetched", data: friend });
  } catch (error) {
    next(error);
  }
}

export async function removeFriend(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const id = req.params.friendId;

    if (!isValidObjectId(id)) {
      const error = new Error("Invalid Friend ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const friend = user.friends.find((friend) => friend.user.toString() === id);
    if (!friend) {
      const error = new Error("Friend not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    user.friends = user.friends.filter(
      (friend) => friend.user.toString() !== id
    );
    await user.save();

    const friendUser = await UserDB.findById(id);
    if (!friendUser) {
      const error = new Error("Friend not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    friendUser.friends = friendUser.friends.filter(
      (friend) => friend.user.toString() !== user.id
    );
    await friendUser.save();

    FriendRemovedMail(user, friendUser);

    res.status(200).json({ success: true, message: "Friend removed" });
  } catch (error) {
    next(error);
  }
}

export async function fetchAllFriendRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const type = req.query.type as string | undefined;
    // not provided -> fetch all friend requests
    // "sent"       -> fetch friend requests sent by user
    // "received"   -> fetch friend requests received by user
    // "all"        -> fetch all friend requests

    let friendRequests = [];
    if (type === "sent") {
      friendRequests = await ConnectionDB.find({ from: user._id });
    } else if (type === "received") {
      friendRequests = await ConnectionDB.find({ to: user._id });
    } else {
      friendRequests = await ConnectionDB.find({
        $or: [{ from: user._id }, { to: user._id }],
      });
    }
    res.status(200).json({
      success: true,
      message: "Friend Requests fetched",
      data: friendRequests,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendFriendRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const { friendId } = req.params;

    if (!isValidObjectId(friendId)) {
      const error = new Error("Invalid User ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const friend = await UserDB.findById(friendId);
    if (!friend) {
      const error = new Error("User not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (friend.friends.find((f) => f.user.toString() === user.id)) {
      // if user is in friend's friend list
      if (user.friends.find((f) => f.user.toString() === friend.id)) {
        // if both are already connected
        const error = new Error("Already connected") as StatusError;
        error.statusCode = 400;
        throw error;
      }
      // if user is in friend's friend list (only one way) [Create Connection both ways]
      user.friends.push({ user: friend.id });
      await user.save();
      res.status(200).json({
        success: true,
        message: "Friend Added",
        data: user.friends,
      });
    } else {
      // if user is not in friend's friend list
      if (user.friends.find((f) => f.user.toString() === friend.id)) {
        // if friend is in user's friend list (only one way) [Remove Connection and send request]
        user.friends = user.friends.filter(
          (f) => f.user.toString() !== friend.id
        );
      }
    }

    const connection = new ConnectionDB({
      from: user._id,
      to: friend._id,
    });
    await connection.save();

    FriendRequestMail(user, friend);

    res.status(201).json({
      success: true,
      message: "Friend Request sent",
      data: connection,
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptFriendRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const { requestId } = req.params;

    if (!isValidObjectId(requestId)) {
      const error = new Error("Invalid Request ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const connection = await ConnectionDB.findById(requestId);
    if (!connection) {
      const error = new Error("Request not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (connection.to.toString() !== user.id) {
      const error = new Error("Unauthorized") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    const friend = await UserDB.findById(connection.from);
    if (!friend) {
      const error = new Error("User not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    user.friends.push({ user: friend.id });
    await user.save();

    friend.friends.push({ user: user.id });
    await friend.save();

    await connection.deleteOne();

    FriendRequestAcceptedMail(friend, user);

    res.status(200).json({ success: true, message: "Friend Added" });
  } catch (error) {
    next(error);
  }
}

export async function rejectFriendRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user! as user;
    const { requestId } = req.params;

    if (!isValidObjectId(requestId)) {
      const error = new Error("Invalid Request ID") as StatusError;
      error.statusCode = 400;
      throw error;
    }

    const connection = await ConnectionDB.findById(requestId);
    if (!connection) {
      const error = new Error("Request not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    const friend = await UserDB.findById(connection.from);
    if (!friend) {
      const error = new Error("User not found") as StatusError;
      error.statusCode = 404;
      throw error;
    }

    if (connection.to.toString() !== user.id) {
      const error = new Error("Unauthorized") as StatusError;
      error.statusCode = 401;
      throw error;
    }

    await connection.deleteOne();

    FriendRequestRejectedMail(friend, user);

    res.status(200).json({ success: true, message: "Request Rejected" });
  } catch (error) {
    next(error);
  }
}
