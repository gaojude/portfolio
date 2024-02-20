"use client";

import React, { useRef } from "react";
import { createLink } from "@/app/admin/createLink";

export const CreateLinkForm = () => {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await createLink(formData);
        ref.current?.reset();
      }}
      className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-2xl mb-16"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="flex flex-col">
        <label htmlFor="url" className="mb-2 text-sm font-medium text-gray-200">
          URL<span className="text-red-500">*</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400 shadow-md transition duration-150 ease-in-out"
          placeholder="Enter URL"
          style={{ transition: "border 0.3s ease, box-shadow 0.3s ease" }}
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="title"
          className="mb-2 text-sm font-medium text-gray-200"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400 shadow-md transition duration-150 ease-in-out"
          placeholder="Enter title (optional)"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-2 text-sm font-medium text-gray-200"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400 shadow-md transition duration-150 ease-in-out"
          placeholder="Enter description (optional)"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out"
        style={{ transition: "background-color 0.3s ease" }}
      >
        Submit
      </button>
    </form>
  );
};

export const Collapsable = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="w-full max-w-md mx-auto rounded-lg border shadow-md overflow-hidden mt-16">
      {isOpen && <div className="mt-2 text-sm text-gray-600">{children}</div>}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="flex items-center justify-center w-full p-2 bg-gray-600 hover:bg-gray-500 text-gray-800 text-sm font-medium rounded-b-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {isOpen ? "Collapse" : name}
        <svg
          className={`w-4 h-4 ${isOpen ? "transform rotate-180" : ""} ml-2`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </div>
  );
};
