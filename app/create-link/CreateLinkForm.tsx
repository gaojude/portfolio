"use client";

import React from "react";
import { createLink } from "@/app/create-link/createLink";

export const CreateLinkForm = () => {
  return (
    <form
      action={createLink}
      className="space-y-4 bg-gray-800 p-4 rounded-lg shadow-lg"
    >
      <div className="flex flex-col">
        <label htmlFor="url" className="mb-2 text-sm font-medium text-gray-300">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
          placeholder="Enter URL"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="title"
          className="mb-2 text-sm font-medium text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
          placeholder="Enter title (optional)"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="mb-2 text-sm font-medium text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
          placeholder="Enter description (optional)"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Submit
      </button>
    </form>
  );
};
