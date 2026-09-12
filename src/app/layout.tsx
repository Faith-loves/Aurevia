import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});

const cormorantGaramond = localFont({
  src: "../../public/fonts/cormorant-garamond-latin.woff2",
  variable: "--font-cormorant",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurévia",
  description: "A premium fragrance discovery and shopping experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
