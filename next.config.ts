// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.100.6:3000",
    "firebasestorage.googleapis.com"
  ],
  images:{
    
  }
  
};

export default withNextIntl(nextConfig);