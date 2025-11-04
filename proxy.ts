import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/chat(.*)',
  '/api/chat(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Only protect routes that actually need authentication
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Only run on /chat routes and API routes that need auth
    // DO NOT include homepage to avoid redirect loops
    "/chat(.*)",
    "/api/chat(.*)",
    // Add any other routes that need authentication here
  ],
};
