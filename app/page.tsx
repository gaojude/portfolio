import PostEntry, { IPostEntry } from "@/app/PostEntry";

export default function Component() {
  return (
    <>
      {MOCK_POSTS.map((post) => (
        <PostEntry key={post.title} post={post} />
      ))}
    </>
  );
}

const MOCK_POSTS: Array<IPostEntry> = [
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
