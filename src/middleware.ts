import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTE_PROTECTED_REGEX = /\/(?!.)|\/settings(?!.)/i;

export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  if (session) {
    const responseAPI = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/login`,
      {
        headers: {
          Cookie: `session=${session?.value}`,
        },
      }
    );

    if (responseAPI.status == 200 && !ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    } else if (
      responseAPI.status == 200 &&
      ROUTE_PROTECTED_REGEX.test(pathname)
    ) {
      return NextResponse.next();
    }

    if (responseAPI.status == 401 && !ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.next();
    } else if (
      responseAPI.status == 401 &&
      ROUTE_PROTECTED_REGEX.test(pathname)
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (!ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/signup", "/settings", "/forgotPassword"],
};
