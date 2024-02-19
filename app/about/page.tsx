/* eslint-disable react/no-unescaped-entities */
import React from "react";

const Page = () => {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold mb-5">Jude's Journey</h1>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="text-xl mb-5">
          Welcome to my professional story. As a Senior Frontend Engineer with a
          deep focus on Next.js, React, and enhancing web performance, my career
          is a testament to my dedication to pushing the boundaries of web
          development. Based in Ontario, Canada, my mission has always been to
          create exceptional user experiences that stand the test of time and
          technology shifts.
        </p>
        <p className="mb-5">
          Join me as I unfold the chapters of my journey, from the early days of
          fascination with the web to leading significant projects at Faire.
          It's a story of growth, challenges, and relentless pursuit of
          excellence.
        </p>
      </section>

      <section className="experience-section mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          The Professional Milestones
        </h2>

        <article className="experience-item mb-6">
          <h3 className="text-xl font-semibold">
            The Next.js Evolution: Senior Frontend Engineer at Faire
          </h3>
          <p className="text-gray-400 mb-3">
            Feb 2023 - Present (1 yr 1 mo) | Ontario, Canada - On-site
          </p>
          <p className="mb-3">
            The latest chapter in my career began in February 2023, when I
            embarked on a journey with Faire, a leading innovator in the digital
            marketplace. My primary mission was to migrate our codebase from
            Create React App to a modern Next.js application, a challenge that
            was both exciting and daunting.
          </p>
          <p className="mb-3">
            This transition wasn't just about improving our tech stack; it was
            about reimagining how we deliver experiences to our users. By
            establishing infrastructure for Next.js React Server Components, we
            not only improved our site's load times but opened up new
            possibilities for dynamic content rendering that were previously
            unimaginable.
          </p>
          <p className="mb-3">
            Perhaps most rewarding was optimizing React's render performance
            across Critical User Journeys. The impact was immediate and
            profound, with significant boosts in user satisfaction and
            engagement. These efforts underscored the importance of performance
            in building a successful web presence.
          </p>
        </article>

        <article className="experience-item mb-6">
          <h3 className="text-xl font-semibold">
            Apparel Category Expansion: Frontend Engineer at Faire
          </h3>
          <p className="text-gray-400 mb-3">
            Sep 2020 - Feb 2023 (2 yrs 6 mos) | Ontario, Canada - On-site
          </p>
          <p className="mb-3">
            My journey with Faire began in earnest in September 2020, as a
            Frontend Engineer tasked with leading a team on a pivotal project.
            Our goal was ambitious: to drive multi-million dollar Gross
            Merchandise Value (GMV) in the Apparel category through strategic
            enhancements and optimizations.
          </p>
          <p className="mb-3">
            The project required not just technical expertise, but a deep dive
            into A/B testing to iterate and validate our approaches. Our success
            in this venture wasn't just measured in code deployment but in the
            tangible business impact we created, paving the way for Faire to
            expand its foothold in the Apparel business.
          </p>
          <p className="mb-3">
            Overcoming structural blockers and delivering key features, we
            achieved more than just our immediate goals; we set new benchmarks
            for what could be achieved through focused, team-driven engineering
            efforts.
          </p>
        </article>
      </section>

      <section className="skills-section mb-10">
        <h2 className="text-2xl font-semibold mb-4">Crafting My Toolbox</h2>
        <p className="mb-5">
          Throughout my career, I've been fortunate to develop a broad and deep
          skill set that has enabled me to tackle a wide range of challenges.
          Here are some of the tools and technologies that I've mastered along
          the way:
        </p>
        <div className="flex flex-wrap gap-3 mb-5">
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            Next.js
          </span>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            React
          </span>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            Web Performance Optimization
          </span>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            Project Management
          </span>
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
            Frontend Architecture
          </span>
        </div>
        <p className="mb-5">
          These skills have not only been instrumental in my professional growth
          but have also allowed me to contribute meaningfully to the teams and
          projects I've been part of. Whether it's leading the charge on
          performance optimization or architecting robust frontend systems, my
          toolbox is always evolving to meet the needs of the ever-changing web
          landscape.
        </p>
      </section>
      <section className="reflection-section mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Reflections and Looking Forward
        </h2>
        <p className="mb-5">
          As I reflect on my journey so far, I'm filled with gratitude for the
          opportunities I've had and the challenges that have pushed me to grow.
          My path has been one of continuous learning, adaptation, and striving
          to make a meaningful impact through my work.
        </p>
        <p className="mb-5">
          Looking ahead, I'm excited about the future of web development and the
          role I can play in it. The landscape is constantly evolving, with new
          technologies, frameworks, and performance best practices emerging all
          the time. I'm committed to staying at the forefront of these changes,
          embracing new challenges, and continuing to contribute to the
          development community.
        </p>
        <p className="mb-5">
          Thank you for joining me on this journey. I'm looking forward to what
          the next chapters will bring and the opportunities to create even more
          impactful user experiences together.
        </p>
      </section>
    </>
  );
};

export default Page;
