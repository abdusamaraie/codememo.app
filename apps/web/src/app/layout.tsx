import type { Metadata } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getThemeFromCookie } from "@/lib/theme-cookie";
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
  const { accent, theme } = await getThemeFromCookie();

  return (
    <html
      lang="en"
      data-accent={accent}
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
