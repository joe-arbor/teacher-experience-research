/** @type {import('next').NextConfig} */
const nextConfig = {
  // In dev, ensure asset URLs (CSS, JS) use the same origin as the page when using a custom port (e.g. 3001).
  // Without this, CSS can fail to load when the app is opened on a non-default port.
  ...(process.env.NODE_ENV === "development" &&
    process.env.PORT && {
      assetPrefix: `http://localhost:${process.env.PORT}`,
    }),
};

module.exports = nextConfig;
