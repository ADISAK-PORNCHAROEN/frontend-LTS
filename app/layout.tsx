import "./globals.css";
import QueryProvider from "#/utils/QueryProvider";
import { getServerSession } from "next-auth";
import ThemesProvider from "#/theme/ThemesProvider";
import Navbar from "#/components/navbar/Sidebar";
import { NextAuthProvider } from "./providers";
import { Metadata } from "next";
import ApplicantTracking from "#/components/navbar/ApplicantTracking";
import { notFound } from 'next/navigation';
import Footer from "#/components/navbar/Footer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

export const metadata: Metadata = {
  title: "LTS PROJECT",
  description: "",
  icons: {
    // icon: `${basePath}/Metadata/favicon.ico`, // /public path
    // icon: `${basePath}/Metadata/logo6.png`, // /public path
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}) {
  const session = await getServerSession();

  return (
    <html lang={(await params).lang}>
      <body
        className="bg-ats-bg"
        suppressHydrationWarning={true}
      >
        <NextAuthProvider>
          <QueryProvider>
            <ThemesProvider>
              {session ? (
                // Layout สำหรับหน้าที่ login แล้ว
                <div className="flex h-screen">
                  <Navbar />
                  <div className="flex flex-col flex-1">
                    <main
                      className="relative flex-1 overflow-y-auto px-8 pt-20 pb-8"
                      key={session.user?.email}
                    >
                      <ApplicantTracking />
                      <div className="w-full min-h-[calc(100vh-200px)]">
                        {children}
                      </div>
                    </main>
                    <Footer />
                  </div>
                </div>
              ) : (
                // Layout สำหรับหน้า login
                <main className="flex min-h-screen items-center justify-center">
                  {children}
                </main>
              )}
            </ThemesProvider>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}