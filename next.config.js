/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    // basePath: process.env.NEXT_PUBLIC_BASE_PATH, // ระบุ base path ถ้าจำเป็น
    images: {
      unoptimized: true, // กำหนดให้ Next.js ไม่ใช้ Image Optimization เมื่อทำการ build แบบ static
    },
    // เพิ่ม configuration สำหรับ static files
    // experimental: {
    //   outputFileTracingRoot: process.env.NODE_ENV === "production" ? "./" : undefined,
    //   outputStandalone: true,
    // }
  }
  
  module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone', // แทนที่ experimental.outputStandalone
//   outputFileTracingRoot: process.cwd(), // ย้ายออกมาจาก experimental
// }

// module.exports = nextConfig