import "./globals.css";
import QueryProvider from "#/utils/QueryProvider";
import { getServerSession } from "next-auth";
import ThemesProvider from "#/theme/ThemesProvider";
import Navbar from "#/components/navbar/Sidebar";
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
  // const session = await getServerSession(authOptions);
  return (
    <html lang={(await params).lang}>
      {/* <Head /> */}
      <body
        className="overflow-y-auto bg-ats-bg"
        suppressHydrationWarning={true}
      >
        {/* <NextAuthProvider>
          <SessionGuard> */}
            <QueryProvider>
              <ThemesProvider>
                {/* {session != null && session.error != 'RefreshAccessTokenError' ? ( */}
                  <>
                    <Navbar>
                    {/* <ApplicantTracking /> */}
                    {children}
                    </Navbar>
                  </>
                {/*  : (
                  children
                )} */}

              </ThemesProvider>
              <div style={{ margin: '3rem 0' }}></div>
            </QueryProvider>
          {/* </SessionGuard>
        </NextAuthProvider> */}
      </body>
    </html>
  );
}
