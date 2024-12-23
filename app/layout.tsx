import "./globals.css";
import QueryProvider from "#/utils/QueryProvider";
import { getServerSession } from "next-auth";
import ThemesProvider from "#/theme/ThemesProvider";
import Navbar from "#/components/navbar/Sidebar";
import { NextAuthProvider } from "./providers";
/* import { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

export const metadata: Metadata = {
  title: "CALYPZO",
  description: "Recruitment Management System",
  icons: {
    // icon: `${basePath}/Metadata/favicon.ico`, // /public path
    icon: `${basePath}/Metadata/logo6.png`, // /public path

  },
};
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}) {
  const session = await getServerSession();
  console.log("layout session", session);
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
  //           {/* {session != null && session.error != 'RefreshAccessTokenError' ? ( */}
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
              <div className="flex h-full">
                <Navbar />
                <main className="overflow-y-auto px-8 pt-20">
                  {children}
                </main>
              </div>
            </ThemesProvider>
            <div style={{ margin: '3rem 0' }}></div>
          </QueryProvider>
        </NextAuthProvider>
      </body>

    </html>
  );
}
