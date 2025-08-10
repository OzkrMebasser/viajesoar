import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'es',
  
  // Always show the locale in the URL
  localePrefix: 'always'
});

// Create and export the Link component and other navigation utilities
export const {Link, redirect, usePathname, useRouter} = 
  createNavigation(routing);