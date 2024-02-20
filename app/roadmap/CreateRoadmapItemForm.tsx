"use client";

import React from "react";
import { createRoadmap } from "@/app/roadmap/actions";
import { styles } from "@/app/roadmap/styles";

export const CreateRoadmapItemForm = () => {
  const ref = React.useRef<HTMLFormElement>(null);

  return (
    <div className={`${styles.backgroundColor} py-10 px-4`}>
      {/* Intro section with dynamic styling */}
      <div className="container mx-auto text-center mb-12">
        <h1
          className={`text-3xl font-bold title-font mb-4 ${styles.primaryColor}`}
        >
          Roadmap
        </h1>
        <p className="mx-auto leading-relaxed text-base w-2/3 ${styles.secondaryColor}">
          This page is dedicated to tracking the development progress and
          upcoming features for our website. Here you can submit new ideas or
          tasks that you think should be included in our roadmap.
        </p>
      </div>

      {/* Create new roadmap item form */}
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center">
          <form
            className="w-full md:w-2/3 lg:w-1/2 p-4"
            ref={ref}
            action={async (formData) => {
              await createRoadmap(formData);
              ref.current?.reset();
            }}
          >
            <div className="relative mb-4">
              <label
                htmlFor="roadmap-item"
                className={`block text-sm font-medium ${styles.secondaryColor}`}
              >
                Roadmap Item
              </label>
              <input
                type="text"
                id="roadmap-item"
                name="roadmap-item"
                className={`w-full rounded border ${styles.borderColor} ${styles.focusState} bg-opacity-40 ${styles.backgroundColor} text-base outline-none text-gray-100 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out`}
              />
            </div>
            <button
              type="submit"
              className={`flex justify-center items-center text-white ${styles.primaryColor} border-0 py-2 px-8 focus:outline-none rounded text-lg transition duration-150 ease-in-out ${styles.hoverState}`}
            >
              {/* SVG and button text with dynamic styling */}
              <svg
                className="w-6 h-6 text-white mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
