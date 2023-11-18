import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const ROUTE_PROTECTED_REGEX = /\/(?!.)|\/settings(?!.)/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = cookies().get("accessToken");
  if (token) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    const { status } = await response.json();

    if (status == 200) {
      if (ROUTE_PROTECTED_REGEX.test(pathname)) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } else {
      if (ROUTE_PROTECTED_REGEX.test(pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
      } else {
        return NextResponse.next();
      }
    }
  } else {
    if (ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/signup", "/settings"],
};
