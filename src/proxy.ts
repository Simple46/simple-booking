// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define what is PUBLIC. Everyone can see these.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/book/(.*)", // 👈 This is where attendees will go (we will build this next)
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. If the route is NOT public, force them to log in.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
