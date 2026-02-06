import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl("./i18n.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);

