import { animate, stagger } from "motion";
import { useEffect, useRef } from "react";
import { Slot } from "@radix-ui/react-slot";

const splitText = (
  container: Element,
  granularity: Intl.SegmenterOptions["granularity"],
  locale = ["zh-Hans-CN", "en", "fr"],
  spanClass = `split-${granularity}`,
) => {
  // 1. Initialize the Segmenter
  // It's more efficient to create it once if processing many nodes.
  const segmenter = new Intl.Segmenter(locale, { granularity });

  // 2. Recursive function to process nodes
  function processNode(node: Node, fragment: DocumentFragment) {
    // Iterate over a *static copy* of the childNodes.
    // Modifying the DOM while iterating over the live NodeList can cause issues.
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];

      if (child.nodeType === Node.TEXT_NODE) {
        // 3. Process Text Nodes
        const text = child.nodeValue;
        if (text && text.trim() !== "") {
          // Avoid processing empty/whitespace-only nodes if desired
          const segments = segmenter.segment(text);
          for (const { segment } of segments) {
            if (segment.trim() === "") {
              fragment.appendChild(document.createTextNode(segment));
            } else {
              const span = document.createElement("span");
              span.textContent = segment;
              span.classList.add(spanClass);
              fragment.appendChild(span);
            }
          }
        } else if (text !== null) {
          // Keep whitespace nodes if needed for layout
          fragment.appendChild(document.createTextNode(text));
          // Or skip if you want to collapse whitespace:
          // if (text && text.trim() !== '') { fragment.appendChild(document.createTextNode(text)); }
        }
        // The original text node is not added to the fragment,
        // effectively replacing it with the new spans (or nothing).
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as Element;
        // 4. Process Element Nodes (Recursively)
        // Create a new element of the same type to append to the fragment
        const newElement = document.createElement(childElement.tagName);
        // Copy attributes
        for (let i = 0; i < childElement.attributes.length; i++) {
          const attr = childElement.attributes[i];
          newElement.setAttribute(attr.name, attr.value);
        }

        // Create a sub-fragment for this element's children
        const subFragment = document.createDocumentFragment();
        // Recurse into the original child element's children
        processNode(child, subFragment);
        // Append the processed children to the new element
        newElement.appendChild(subFragment);
        // Append the fully processed new element to the main fragment
        fragment.appendChild(newElement);
      } else {
        // 5. Preserve other node types (like comments)
        // Clone them and append to the fragment
        fragment.appendChild(child.cloneNode(true));
      }
    }
  }

  // 6. Main execution
  // Create the main DocumentFragment to build the new content
  const mainFragment = document.createDocumentFragment();

  // Start the recursive processing from the container element
  processNode(container, mainFragment);

  // 7. Replace the container's original content with the new structure
  // Using replaceChildren is generally preferred over innerHTML = '' + appendChild
  container.replaceChildren(mainFragment);

  return {
    sentences: container.querySelectorAll(".split-sentence"),
    words: container.querySelectorAll(".split-word"),
    graphemes: container.querySelectorAll(".split-grapheme"),
  };
};

export default function SplitText({
  asChild,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const Comp = asChild ? Slot : "div";
  const mutationObserver = useRef<MutationObserver>(null);
  const startDelay = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    mutationObserver.current ||= new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // observer add nodes
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType !== Node.ELEMENT_NODE) continue;
            const element = mutation.addedNodes[i] as Element;

            // First assistant message will send with parent element
            const firstAssistantMessage = element.querySelector(
              "[data-message-id]",
            );

            if (
              !element.hasAttribute("data-message-id") &&
              !firstAssistantMessage
            )
              continue;

            const { words } = splitText(
              firstAssistantMessage || element,
              "word",
            );
            if (words.length === 0) continue; // Skip if no words found

            element.scrollIntoView({ behavior: "smooth" });

            const now = performance.now();
            // Calculate the delay needed for the current animation to start after the previous one finishes its stagger
            // startDelay.current holds the absolute timestamp when the next animation *should* start
            const currentStartDelay = Math.max(0, startDelay.current - now); // Delay relative to now

            animate(
              words,
              { opacity: [0, 1], y: [10, 0] },
              {
                type: "spring",
                bounce: 0,
                // Apply the calculated delay before starting the stagger for this batch of words
                delay: stagger(0.01, { startDelay: currentStartDelay }),
              },
            );

            // Calculate the duration of the stagger effect for the current animation
            const currentStaggerDuration = words.length * 0.01;
            // Update the absolute timestamp for when the *next* animation should start.
            // It's the time the current animation actually starts (now + currentStartDelay)
            // plus the duration of its stagger effect.
            startDelay.current =
              now + currentStartDelay + currentStaggerDuration;
          }
        }
      });
    });

    const observer = mutationObserver.current;

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      startDelay.current = 0;
    };
  }, []);

  return (
    <>
      <Comp {...props} ref={containerRef} />
      <Stylesheet />
    </>
  );
}

function Stylesheet() {
  return (
    <style>{`
      .split-sentence,
      .split-word,
      split-grapheme {
          will-change: transform, opacity;
      }
  `}</style>
  );
}
