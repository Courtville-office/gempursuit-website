/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i1.ytimg.com" },
      { protocol: "https", hostname: "i2.ytimg.com" },
      { protocol: "https", hostname: "i3.ytimg.com" },
      { protocol: "https", hostname: "i4.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      { source: "/guests", destination: "/specials", permanent: true },
      {
        source:
          "/articles/jean-baptiste-tavernier-map-sellers-son-behind-hope-diamond",
        destination:
          "/articles/jean-baptiste-tavernier-historys-greatest-jewel-merchant",
        permanent: true,
      },
      // /admin was the previous Decap-CMS path. Forward to the new
      // Sanity Studio so any old links / bookmarks still work.
      { source: "/admin", destination: "/studio", permanent: true },
      { source: "/admin/:path*", destination: "/studio", permanent: true },
    ];
  },
};

export default nextConfig;
