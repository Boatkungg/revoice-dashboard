import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const cookies = getSessionCookie(request);

    console.log("All cookies:", request.cookies.getAll());

    console.log("Session cookies found:", cookies);
    console.log("Request URL:", request.url);
    console.log("Cookie header:", request.headers.get('cookie'));

    const { pathname } = request.nextUrl;
    
    // Check if user is authenticated
    const isAuthenticated = !!cookies;
    
    // Define route types
    const isAuthRoute = pathname === "/signin" || pathname === "/signup";
    const isRootRoute = pathname === "/";
    
    // If user is not authenticated
    if (!isAuthenticated) {
        // Allow access to auth routes
        if (isAuthRoute) {
            return NextResponse.next();
        }
        // Redirect to signin for protected routes
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    
    // If user is authenticated
    if (isAuthenticated) {
        // Redirect from root to dashboard
        if (isRootRoute) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Redirect from auth routes to dashboard
        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Allow access to dashboard and other protected routes
        return NextResponse.next();
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/", "/signin", "/signup"],
};