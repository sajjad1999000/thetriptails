const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "dlnyhcsbubffmhegtcai.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/advertise',
        destination: '/work-with-us',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;