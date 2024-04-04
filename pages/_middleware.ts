// import { NextRequest, NextResponse } from 'next/server';
// import cookie from 'cookie';

// export function middleware(req: NextRequest) {
//   const cookies = cookie.parse(req.headers.get('cookie') || '');
//   const token = cookies['token'];

//   if (!token) {
//     // If there's no token, redirect to the login page
//     return NextResponse.redirect('/login');
//   }

//   // If there's a token, continue with the request
//   return NextResponse.next();
// }