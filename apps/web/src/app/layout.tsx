import type { Metadata } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getSiteSettings } from "@/lib/site-settings";
import { getThemeFromCookie } from "@/lib/theme-cookie";
// @ts-expect-error -- Next.js handles global CSS side-effect imports at build time
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeMemo",
  description: "Syntax memorization for experienced developers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ accent, theme }, settings] = await Promise.all([
    getThemeFromCookie(),
    getSiteSettings(),
  ]);

  return (
    <html
      lang="en"
      data-accent={accent}
      data-app-data-source={settings.appDataSource}
      className={`${theme} ${nunito.variable} ${jetbrainsMono.variable}`}
    >
      <body className={nunito.className}>
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
