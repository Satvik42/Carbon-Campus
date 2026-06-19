import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Carbon Compass | AI-Powered Carbon Decision Assistant',
  description: 'Design a sustainable future. Evaluate the environmental impact of your choices, simulate lifestyle changes, and build your custom action roadmap.',
  keywords: ['sustainability', 'carbon footprint', 'climate tech', 'gemini ai', 'green choices', 'co2 emissions'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}>
        {/* Skip Navigation Link for screen reader / keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content" className="flex-grow flex flex-col" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
