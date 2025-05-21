import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // console.log("middleware executed");
  const token = req.cookies.get('accessToken')?.value;
  console.log(token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/dashboard",
    "/product/:path*",
    "/cancel",
    "/confirm/:path*",
  ],
}