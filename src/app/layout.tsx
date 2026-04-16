
import {ReactNode} from 'react';
import './globals.css';
import "flag-icons/css/flag-icons.min.css";
import { GoogleAnalytics } from "@next/third-parties/google";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body>
        {children}
         {/* <GoogleAnalytics gaId="G-XXXXXXXXXX" /> */}
      </body>
    </html>
  );
}

// export default function RootLayout({children}: Props) {
//   return children;
// }