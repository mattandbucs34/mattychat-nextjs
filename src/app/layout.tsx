import "./globals.css";
import type { Metadata } from "next";
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: "MattyChat Chat Chat",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={'antialiased'}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
