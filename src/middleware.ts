import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasValidClerkKeys =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default function middleware(req: any) {
    // If no valid Clerk keys, bypass authentication for demo mode
    if (!hasValidClerkKeys) {
        return NextResponse.next();
    }

    // Otherwise use Clerk middleware
    return clerkMiddleware(async (auth, req) => {
        if (isProtectedRoute(req)) await auth.protect();
    })(req);
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
