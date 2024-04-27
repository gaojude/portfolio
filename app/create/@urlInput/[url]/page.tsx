import { Input } from "@/components/ui/input";
import React from "react";

const Page = ({ params: { url } }: { params: { url: string } }) => {
  return (
    <Input
      className="focus:border-primary focus:ring-primary w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
      id="url"
      placeholder="Enter a URL"
      type="url"
      name="url"
      defaultValue={decodeURIComponent(url)}
    />
  );
};

export default Page;
