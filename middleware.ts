import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  let validToken = false;
  const JWTRoute = 'http://localhost:3000/api/JWT';
  const headers = { cookie: req.headers.get("cookie") }; //keep the cookie to forward it to the JWT API route
  const response = await fetch(JWTRoute, {
      method: 'GET',
      headers: headers
    });
  if (!response.ok){ //not a valid token
    const url = req.nextUrl.clone()
    url.pathname = '/unauthorized'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next();
}

export const config = {
    matcher: ['/api/publish/:path*', '/api/post/:path*', '/api/profile/:path*', '/profile/', '/create/' ]
};