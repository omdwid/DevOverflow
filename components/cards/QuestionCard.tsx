import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { getTimeStamp, formatLargeNumber } from "@/lib/utils";

interface Props {
  clerkId?: string
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { _id: string; name: string; picture: string, clerkId: string };
  upvotes: string[];
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Props) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimeStamp(createdAt)}
        </span>
        <Link href={`/question/${_id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
      </div>
      {/* if signed in add edit delete */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
            totalQuestions={0}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles="body-medium text-dark400_light700 "
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatLargeNumber(upvotes.length)}
          title="Votes"
          textStyles="small-medium text-dark400_light800 "
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={answers.length}
          title="Answers"
          textStyles="small-medium text-dark400_light800 "
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatLargeNumber(views)}
          title="View"
          textStyles="small-medium text-dark400_light800 "
        />
      </div>
    </div>
  );
};

export default QuestionCard;
