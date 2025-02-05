/** @type {import('next').NextConfig} */
const nextConfig = {
  experiments: {
    asyncWebAssembly: true, // ✅ Enables WebAssembly (Modern)
    layers: true, // ✅ Required for WebAssembly support
  },
};

console.log("✅ Next.js config loaded!");

module.exports = nextConfig;
