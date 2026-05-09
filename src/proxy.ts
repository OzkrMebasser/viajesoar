// src/proxy.ts
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/app/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(es|en)/:path*']  // ← tu matcher original de next-intl
};


// import createMiddleware from 'next-intl/middleware';
// import {routing} from '@/app/i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(es|en)/:path*']
// };