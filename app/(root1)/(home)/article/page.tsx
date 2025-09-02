import {
  LineItemContainer,
  LineItemDescription,
  LineItemHeading,
  LineItemOuterContainer,
  LineItemSubheading,
} from "../line-item";

export default function Page() {
  return (
    <LineItemOuterContainer>
      <LineItemContainer>
        <LineItemHeading>
          <a
            href="https://nextjs.org/blog/next-15-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js 15.3
          </a>
        </LineItemHeading>
        <LineItemSubheading>Jan 23, 2025</LineItemSubheading>
        <LineItemDescription>
          Next.js 15.3 introduces Server Component HMR, enhanced Static
          Generation performance, and improved observability with next/trace.
        </LineItemDescription>
      </LineItemContainer>

      <LineItemContainer>
        <LineItemHeading>
          <a
            href="https://craft.faire.com/zero-runtime-localization-in-next-js-864e252e387d"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zero Runtime Localization
          </a>
        </LineItemHeading>
        <LineItemSubheading>Sep 6, 2024</LineItemSubheading>
        <LineItemDescription>
          Faire optimized Next.js localization by embedding translations
          post-build and using stream patching, eliminating runtime overhead and
          improving scalability.
        </LineItemDescription>
      </LineItemContainer>

      <LineItemContainer>
        <LineItemHeading>
          <a
            href="https://craft.faire.com/boosting-performance-faires-transition-to-nextjs-3967f092caaf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Faire&apos;s Transition to Next.js
          </a>
        </LineItemHeading>
        <LineItemSubheading>Jul 30, 2024</LineItemSubheading>
        <LineItemDescription>
          Faire migrated from a single-page app to Next.js for better
          performance, leveraging SSR, response streaming, and Server
          Components.
        </LineItemDescription>
      </LineItemContainer>
    </LineItemOuterContainer>
  );
}
