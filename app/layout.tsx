import type { Metadata } from "next";
import "./globals.css";
import { Kanit, Sora } from "next/font/google";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const kanit = Kanit({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-kanit" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "DecentraStream",
  description: "A Decentralized Video Sharing Platform",
};

export default async function RootLayout({ 
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie") || "";

  return (
    <html lang="en" className={`${kanit.variable} ${sora.variable}`}>
      <body className="font-body antialiased">
        <ContextProvider cookies={cookies}>
          <Providers>
            <Toaster position="bottom-center" />
            {children}
          </Providers>
        </ContextProvider>
      </body>
    </html>
  );
}
