import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const Layout = ({
  children,
  urlInput,
}: {
  children: ReactNode;
  urlInput: ReactNode;
}) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold dark:text-gray-200">
          Create Bookmark
        </h1>
        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            const url = formData.get("url");
            if (typeof url !== "string") {
              throw new Error("Invalid Input");
            }
            redirect(`/create/${encodeURIComponent(url)}`);
          }}
        >
          <div>
            <label
              className="mb-2 block font-medium text-gray-700 dark:text-gray-300"
              htmlFor="url"
            >
              URL
            </label>
            {urlInput}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Layout;
