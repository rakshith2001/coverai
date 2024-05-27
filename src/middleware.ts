import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isTenantRoute = createRouteMatcher([
  '/',
])


export default clerkMiddleware((auth, req) => {
  // Restrict admin routes to users with specific permissions
  // Restrict organization routes to signed in users
  if (isTenantRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};