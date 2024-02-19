export default function Component() {
  return (
    <div className="dark-mode min-h-screen bg-gray-800 text-white">
      <header className="text-center p-5 bg-gray-900">
        <h1 className="text-3xl font-bold">Jude Gao&apos;s Tech Blog (WIP)</h1>
        <p className="text-gray-400">Explorations in Frontend Technology</p>
        <div className="max-w-6xl mx-auto mt-3">
          <div className="mb-5">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Search blog posts..."
            />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto mt-5">
        {MOCK_POSTS.map((post) => (
          <article
            key={post.title}
            className="bg-gray-700 p-5 rounded-lg shadow-md mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-xl">{post.title}</h2>
              <span className="text-gray-400 text-sm">
                Posted on {post.createdAt.toLocaleDateString()} | Last Edited{" "}
                {post.lastEditedAt.toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              A deep dive into the latest improvements and how they can enhance
              your web development workflow.
            </p>
            <div className="flex justify-between items-center">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Read More →
              </a>
              <span className="text-gray-400">
                Tags: {post.tags.join(", ")}
              </span>
            </div>
          </article>
        ))}
      </main>
      <footer className="text-center bg-gray-900 mt-5 p-5">
        <p>&copy; 2024 Jude Gao. All rights reserved.</p>
      </footer>
    </div>
  );
}

const MOCK_POSTS: Array<{
  title: string;
  createdAt: Date;
  lastEditedAt: Date;
  tags: string[];
}> = [
  {
    title: "Advanced State Management with Redux Toolkit & TypeScript",
    createdAt: new Date("2023-04-25"),
    lastEditedAt: new Date("2024-01-22"),
    tags: ["Redux", "TypeScript", "State Management"],
  },
  {
    title: "Tailwind CSS: Revolutionizing Design Systems with JIT Mode",
    createdAt: new Date("2023-06-01"),
    lastEditedAt: new Date("2024-02-09"),
    tags: ["Tailwind CSS", "Design Systems", "JIT"],
  },
  {
    title: "TypeScript 4.x: Leveraging Stronger Types for Scalable Apps",
    createdAt: new Date("2023-06-17"),
    lastEditedAt: new Date("2024-02-15"),
    tags: ["TypeScript", "Strong Types", "Scalable"],
  },
  {
    title: "Exploring the Capabilities of React 18 Concurrent Features",
    createdAt: new Date("2023-09-18"),
    lastEditedAt: new Date("2024-01-25"),
    tags: ["React", "Concurrent", "Frontend"],
  },
  {
    title: "GraphQL: A New Frontier for Efficient Data Fetching",
    createdAt: new Date("2023-10-02"),
    lastEditedAt: new Date("2024-02-12"),
    tags: ["GraphQL", "Data Fetching", "Efficiency"],
  },
  {
    title: "SvelteKit: The Next Generation Framework for Svelte Apps",
    createdAt: new Date("2023-10-11"),
    lastEditedAt: new Date("2024-01-20"),
    tags: ["SvelteKit", "Svelte", "Framework"],
  },
  {
    title: "Unlocking Next.js 12: The Future of SSR and SSG",
    createdAt: new Date("2023-11-07"),
    lastEditedAt: new Date("2024-02-01"),
    tags: ["Next.js", "SSR", "SSG"],
  },
  {
    title: "Pioneering Frontend Performance with Web Vitals",
    createdAt: new Date("2023-11-14"),
    lastEditedAt: new Date("2024-02-12"),
    tags: ["Performance", "Web Vitals", "Frontend"],
  },
  {
    title: "Webpack 5: Strategies for Faster Build Times",
    createdAt: new Date("2023-11-30"),
    lastEditedAt: new Date("2024-02-08"),
    tags: ["Webpack", "Build Times", "Optimization"],
  },
  {
    title: "Vue 3 Composition API: Reimagining Reactive Frontends",
    createdAt: new Date("2024-01-04"),
    lastEditedAt: new Date("2024-02-09"),
    tags: ["Vue", "Composition API", "Reactive"],
  },
];
