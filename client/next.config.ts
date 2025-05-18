import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com" ,
      },
       {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com" ,
      },
    ],
  },
};

export default nextConfig;
