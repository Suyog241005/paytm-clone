import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  outputFileTracingRoot: path.join(process.cwd(), "../../")
};

export default nextConfig;
