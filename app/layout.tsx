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
  description: "Recruitment Management System",
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
  // console.log("layout session", session);

  // return (
  //   <html lang={(await params).lang}>
  //     {/* <Head /> */}
  //     <body
  //       className="overflow-y-auto bg-ats-bg"
  //       suppressHydrationWarning={true}
  //     >
  //       {/* <NextAuthProvider>
  //         <SessionGuard> */}
  //       <QueryProvider>
  //         <ThemesProvider>
  // {/* {session != null && session.error != 'RefreshAccessTokenError' ? ( */}
  //           <>
  //             <Navbar>
  //               {/* <ApplicantTracking /> */}
  //               <main className="flex-grow overflow-y-auto">
  //                 {children}
  //               </main>
  //             </Navbar>
  //           </>
  //           {/*  : (
  //                 children
  //               )} */}

  //         </ThemesProvider>
  //         <div style={{ margin: '3rem 0' }}></div>
  //       </QueryProvider>
  //       {/* </SessionGuard>
  //       </NextAuthProvider> */}
  //     </body>
  //   </html>
  // );
  return (
    <html lang={(await params).lang}>
      <body
        className="overflow-hidden bg-ats-bg"
        suppressHydrationWarning={true}
      >
        <NextAuthProvider>
          <QueryProvider>
            <ThemesProvider>
              {session ? (
                // Layout สำหรับหน้าที่ login แล้ว
                <div className="flex h-screen">
                  <Navbar />
                  <main
                    className="relative flex-1 overflow-x-hidden overflow-y-auto px-8 pt-20 flex flex-col"
                    key={session.user?.email}
                  >
                    <ApplicantTracking />
                    <div className="w-full flex-grow">
                      {children}
                    </div>
                    <div className="w-screen relative left-0 right-0 -mx-8">
                      <Footer />
                    </div>
                  </main>
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
