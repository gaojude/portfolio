import React from "react";

export interface IPostEntry {
  title: string;
  createdAt: Date;
  lastEditedAt: Date;
  tags: string[];
}

const PostEntry = ({ post }: { post: IPostEntry }) => {
  return (
    <article className="bg-gray-700 p-5 rounded-lg shadow-md mb-4 hover:bg-gray-600 cursor-pointer transition-colors duration-200 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">{post.title}</h2>
        <span className="text-gray-400 text-sm">
          Posted on {post.createdAt.toLocaleDateString()} | Last Edited{" "}
          {post.lastEditedAt.toLocaleDateString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

export default PostEntry;
