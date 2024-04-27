import { Input } from "@/components/ui/input";
import React from "react";

const Page = () => {
  return (
    <Input
      className="focus:border-primary focus:ring-primary w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
      id="url"
      placeholder="Enter a URL"
      type="url"
      name="url"
      value=""
    />
  );
};

export default Page;
