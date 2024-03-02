"use server";

import { revalidatePath } from "next/cache";
import Answer from "../database/answer.model";
import Question from "../database/question.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    // add the answer to the question object of the database
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // Todo: add interaction i.e. increase the reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({
      question: questionId,
    })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    // add the answer to the question object of the database
    return { answers };
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();

    let updateQuery = {};

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if(!answer){
      throw new Error("Answer not found");
    }

    // TODO: increment user reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();

    let updateQuery = {};

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if(!answer){
      throw new Error("Answer not found");
    }

    // TODO: increment user reputation
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
