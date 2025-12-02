import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Movies App",
  description: "Author - Aman Garg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="z-10 h-dvh w-full p-4 md:p-7 lg:p-20">{children}</main>
        
        <div className="fixed bottom-0 left-0 w-full z-[-1]">
          {/* First Wave */}
          <img
            src="/layoutImages/Vector.svg"
            className="w-full"
            alt="Wave 1"
          />

          {/* Second Wave overlapping the first */}
          <img
            src="/layoutImages/Vector2.svg"
            className="w-full absolute bottom-0 left-0"
            alt="Wave 2"
          />
        </div>
      </body>
    </html>
  );
}
