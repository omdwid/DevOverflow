import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[50px] items-center gap-1 rounded-xl px-4">
        <label htmlFor="global-search"><Image src="/assets/icons/search.svg" alt="search" width={24} height={24} className="cursor-pointer"/></label>
        <Input
          id="global-search"
          type="text"
          placeholder="Search Globally"
          value=""
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
