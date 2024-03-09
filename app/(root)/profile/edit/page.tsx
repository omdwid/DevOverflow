import Profile from "@/components/forms/Profile";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";

import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const mongoUser = await getUserById({ userId: userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile
          clerkId={userId}
          user={JSON.stringify(mongoUser)}
        />
      </div>
    </>
  );
};

export default Page;
