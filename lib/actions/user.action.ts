"use server";
import { revalidatePath } from "next/cache";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import Answer from "../database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";


export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof User> = {};

    const skipNumber = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joindedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joindedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .skip(skipNumber)
      .limit(pageSize)
      .sort(sortOptions);

    const usersCount = await User.countDocuments({});

    const isNext = usersCount > skipNumber + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userParams: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create({
      clerkId: userParams.clerkId,
      username: userParams.username,
      email: userParams.email,
      name: userParams.name,
      picture: userParams.picture,
    });

    return newUser;
  } catch (error) {
    console.log("error while creating user", error);
    throw error;
  }
}

export async function updateUser(userParams: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = userParams;
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData);

    revalidatePath(path);
  } catch (error) {
    console.log("error while updating user", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const deletedUser = await User.findOneAndDelete({ clerkId });
    if (!deletedUser) {
      throw new Error("User not found");
    }

    const userQuestionId = await Question.find({
      author: deletedUser._id,
    }).distinct("_id");

    await Question.deleteMany({ author: deletedUser._id });

    return deletedUser;
  } catch (error) {
    console.log("error while deleting user", error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      //remove question to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        {
          new: true,
        }
      );
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $push: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { clerkId, page = 1, pageSize = 2, filter, searchQuery } = params;
    const skipNumber = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId: clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipNumber,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedUser = await User.findOne({ clerkId: clerkId });
    const totalSavedQuestions = savedUser.saved.length;

    const isNext = totalSavedQuestions > skipNumber + user.saved.length;

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $sum: "$upvotes" }
        }
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" }
        }
      }
    ])

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $sum: "$upvotes" }
        }
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" }
        }
      }
    ])

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ])

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      { type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: questionUpvotes?.totalUpvotes || 0 },
      { type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: answerUpvotes?.totalUpvotes || 0 },
      { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0 },
    ]

    const badgeCounts = assignBadges({ criteria });

    return { user, totalAnswers, totalQuestions, badgeCounts };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = pageSize * (page - 1);

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");


    const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext: isNextQuestions };
  } catch (error) { }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipNumber = pageSize * (page - 1);

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipNumber)
      .limit(pageSize)
      .populate("author", "_id clerkId name picture")
      .populate("question", "_id title");

    const isNext = totalAnswers > skipNumber + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) { }
}
