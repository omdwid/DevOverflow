"use server";
import { revalidatePath } from "next/cache";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "../database/question.model";

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
    if (!deleteUser) {
      throw new Error("User not found");
    }

    const userQuestionId = await Question.find({
      author: deleteUser._id,
    }).distinct("_id");

    await Question.deleteMany({author: deletedUser._id});

    return deletedUser;
    
  } catch (error) {
    console.log("error while deleting user", error);
    throw error;
  }
}
