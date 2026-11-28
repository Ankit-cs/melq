import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import UnsupportedScreen from "@/components/ui/UnsupportedScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Melq",
  description: "Framework-independent AI agent benchmarking, chaos-testing & execution platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${serif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <div id="app-root">
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </div>

        <div id="unsupported-root">
          <UnsupportedScreen />
        </div>
      </body>
    </html>
  );
}
