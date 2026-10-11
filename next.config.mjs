/** @type {import('next').NextConfig} */
const nextConfig = {
  // Русская версия живёт на «/», внутри это страницы /ru
  async rewrites() {
    return [
      { source: "/", destination: "/ru" },
      { source: "/product/:id", destination: "/ru/product/:id" },
    ];
  },
};
export default nextConfig;
