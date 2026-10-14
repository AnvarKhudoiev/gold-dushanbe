/** @type {import('next').NextConfig} */
const supaHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
  } catch {
    return "";
  }
})();

const nextConfig = {
  poweredByHeader: false,
  // Картинки из Supabase Storage сжимаются и режутся под размер экрана (WebP/AVIF) через Vercel
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      ...(supaHost ? [{ protocol: "https", hostname: supaHost, pathname: "/storage/v1/object/public/**" }] : []),
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
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
