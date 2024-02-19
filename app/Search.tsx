import React from "react";

const Search = () => {
  return (
    <div className="max-w-6xl mx-auto mt-3">
      <div className="relative mb-5">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors duration-200"
          placeholder="Search blog posts..."
        />
        <div className="absolute top-2 left-3">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Search;
