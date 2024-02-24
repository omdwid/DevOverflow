import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/home/HomeFilter";
import Filter from "@/components/shared/Filter";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import NoResult from "@/components/shared/NoResult";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";

import Link from "next/link";
import React from "react";

// const questions = [
//   {
//     _id: "1",
//     title: "How to optimize Python code for better performance?",
//     tags: [
//       {
//         _id: "1",
//         name: "python",
//       },
//       {
//         _id: "2",
//         name: "sql",
//       },
//     ],
//     author: {
//       _id: "1",
//       name: "John Doe",
//       picture: "url_to_picture",
//     },
//     upvotes: 10,
//     views: 500000,
//     answers: [],
//     createdAt: new Date("2024-01-01T12:00:00.000Z"),
//   },
//   {
//     _id: "2",
//     title: "How to implement advanced SQL queries?",
//     tags: [
//       {
//         _id: "1",
//         name: "python",
//       },
//       {
//         _id: "2",
//         name: "sql",
//       },
//     ],
//     author: {
//       _id: "2",
//       name: "Jane Doe",
//       picture: "url_to_picture",
//     },
//     upvotes: 10,
//     views: 100,
//     answers: [],
//     createdAt: new Date("2021-09-01T12:00:00.000Z"),
//   },
//   {
//     _id: "3",
//     title: "Best practices for building responsive React components",
//     tags: [
//       {
//         _id: "3",
//         name: "javascript",
//       },
//       {
//         _id: "4",
//         name: "react",
//       },
//     ],
//     author: {
//       _id: "3",
//       name: "Alice Smith",
//       picture: "url_to_picture",
//     },
//     upvotes: 15,
//     views: 120,
//     answers: [],
//     createdAt: new Date("2021-09-02T12:00:00.000Z"),
//   },
//   {
//     _id: "4",
//     title: "Introduction to Spring framework for Java developers",
//     tags: [
//       {
//         _id: "5",
//         name: "java",
//       },
//       {
//         _id: "6",
//         name: "spring",
//       },
//     ],
//     author: {
//       _id: "4",
//       name: "Bob Johnson",
//       picture: "url_to_picture",
//     },
//     upvotes: 8,
//     views: 90,
//     answers: [],
//     createdAt: new Date("2021-09-03T12:00:00.000Z"),
//   },
//   {
//     _id: "5",
//     title: "Getting started with Angular and TypeScript",
//     tags: [
//       {
//         _id: "7",
//         name: "typescript",
//       },
//       {
//         _id: "8",
//         name: "angular",
//       },
//     ],
//     author: {
//       _id: "5",
//       name: "Eva Martinez",
//       picture: "url_to_picture",
//     },
//     upvotes: 20,
//     views: 150,
//     answers: [],
//     createdAt: new Date("2021-09-04T12:00:00.000Z"),
//   },
//   {
//     _id: "6",
//     title: "Building web applications with Ruby on Rails",
//     tags: [
//       {
//         _id: "9",
//         name: "ruby",
//       },
//       {
//         _id: "10",
//         name: "rails",
//       },
//     ],
//     author: {
//       _id: "6",
//       name: "Michael Brown",
//       picture: "url_to_picture",
//     },
//     upvotes: 12,
//     views: 110,
//     answers: [],
//     createdAt: new Date("2021-09-05T12:00:00.000Z"),
//   },
// ];

const page = async () => {
  const result = await getQuestions({});
  

  return (
    <>
      <div className="flex flex-col-reverse w-full justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={`/ask-question`} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;
