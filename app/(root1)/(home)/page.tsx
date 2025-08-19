export default function Page() {
  return (
    <>
    <div className="px-4 max-w-full">
      <div className="flex flex-wrap justify-center gap-6 my-8">
        {/* GitHub Icon */}
        <a
          href="https://github.com/gaojude"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="touch-manipulation"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white hover:opacity-75 transition-opacity"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* LinkedIn Icon */}
        <a
          href="https://linkedin.com/in/jude-gao"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="touch-manipulation"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white hover:opacity-75 transition-opacity"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </a>

        {/* X (Twitter) Icon */}
        <a
          href="https://twitter.com/gao_jude"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className="touch-manipulation"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white hover:opacity-75 transition-opacity"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        </a>

        {/* Cal.com Icon */}
        <a
          href="https://cal.com/jude-gao-ymrglb/30min"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Schedule a meeting"
          className="touch-manipulation"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white hover:opacity-75 transition-opacity"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0Zm0 19.2a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Zm.6-6.6V6h-1.2v7.2l5.4 3.132.6-1.032-4.8-2.7Z" />
          </svg>
        </a>
      </div>
      </div>
    </>
  );
}
