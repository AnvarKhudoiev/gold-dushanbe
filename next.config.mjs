/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Русская версия живёт на «/», внутри это страницы /ru
  async rewrites() {
    return [
      { source: "/", destination: "/ru" },
      { source: "/product/:id", destination: "/ru/product/:id" },
    ];
  },
  // Иконки и картинки в /public браузер кэширует на месяц
  async headers() {
    return [
      {
        source: "/:file(icon-.*\\.png|apple-touch-icon\\.png|logo\\.svg|icon\\.svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};
export default nextConfig;
