// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Check if the request is for the admin page
  if (pathname === '/admin') {
    const password = searchParams.get('password');
    const expectedPassword = process.env.ADMIN_PASSWORD || 'pass'; // Set your expected password here

    // If the password is not provided or incorrect, redirect to the homepage
    if (password !== expectedPassword) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // If the request is not for the admin page or the password is correct, continue
  return NextResponse.next();
}